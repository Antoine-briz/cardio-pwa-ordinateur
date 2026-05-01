#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mise à jour automatique optimisée de la bibliographie SARIC.

Version optimisée :
- PubMed récupère un nombre limité d'articles récents par domaine.
- Semantic Scholar est interrogé en BATCH, par paquets, au lieu d'un appel par article.
- Beaucoup plus rapide, surtout sans clé Semantic Scholar.

Génère :
  - data/publications.json : chaque lundi, top 10 des articles publiés la semaine écoulée,
    triés par nombre total de citations Semantic Scholar.
  - data/recommandations.json : uniquement le 1er lundi du mois,
    recommandations/guidelines récentes dans les domaines ciblés.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PUBLICATIONS_PATH = DATA_DIR / "publications.json"
RECOMMANDATIONS_PATH = DATA_DIR / "recommandations.json"

NCBI_EMAIL = os.getenv("NCBI_EMAIL", "saric@example.com")
NCBI_API_KEY = os.getenv("NCBI_API_KEY", "")
SEMANTIC_SCHOLAR_API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")

USER_AGENT = f"SARIC-Biblio-Updater/2.0 ({NCBI_EMAIL})"

# Réglages vitesse / qualité
PUBMED_RETMAX_PER_DOMAIN = int(os.getenv("PUBMED_RETMAX_PER_DOMAIN", "30"))
MAX_PMIDS_TOTAL = int(os.getenv("MAX_PMIDS_TOTAL", "250"))
SEMANTIC_BATCH_SIZE = int(os.getenv("SEMANTIC_BATCH_SIZE", "80"))

DOMAINS = {
    "Réanimation": [
        "critical care",
        "intensive care",
        "ICU",
        "sepsis",
        "shock",
        "ARDS",
        "mechanical ventilation",
        "vasopressor",
    ],
    "Anesthésie": [
        "anesthesia",
        "anaesthesia",
        "perioperative",
        "cardiac anesthesia",
        "cardiothoracic anesthesia",
        "intraoperative",
    ],
    "Infectiologie": [
        "infectious diseases",
        "antimicrobial",
        "antibiotic",
        "bacteremia",
        "endocarditis",
        "sepsis",
        "multidrug resistant",
    ],
    "Cardiologie": [
        "cardiology",
        "heart failure",
        "acute coronary syndrome",
        "valvular heart disease",
        "arrhythmia",
        "interventional cardiology",
        "TAVI",
    ],
    "Chirurgie cardiaque": [
        "cardiac surgery",
        "cardiothoracic surgery",
        "valve surgery",
        "CABG",
        "aortic surgery",
        "ECMO",
        "cardiopulmonary bypass",
    ],
}

PUBMED_PUBLICATION_FILTER = (
    '("journal article"[Publication Type] OR '
    '"clinical trial"[Publication Type] OR '
    '"randomized controlled trial"[Publication Type] OR '
    '"systematic review"[Publication Type] OR '
    '"meta-analysis"[Publication Type] OR '
    '"practice guideline"[Publication Type])'
)

HIGH_VALUE_TERMS = [
    "randomized",
    "trial",
    "multicenter",
    "meta-analysis",
    "systematic review",
    "guideline",
    "consensus",
    "cohort",
    "registry",
]


@dataclass
class BiblioItem:
    source: str
    date: str
    titre: str
    description: str
    lien: str
    citation_count: int = 0
    score: float = 0.0
    domaine: str = ""

    def as_json(self) -> Dict[str, str]:
        return {
            "source": self.source,
            "date": self.date,
            "titre": self.titre,
            "description": self.description,
            "lien": self.lien,
            "domaine": self.domaine,
            "citations": str(self.citation_count),
            "score": str(round(self.score, 1)),
        }


def http_json(
    url: str,
    *,
    method: str = "GET",
    payload: Optional[Dict[str, Any]] = None,
    headers: Optional[Dict[str, str]] = None,
    retries: int = 2,
    timeout: int = 25,
) -> Any:
    req_headers = {"User-Agent": USER_AGENT}
    if headers:
        req_headers.update(headers)

    data_bytes = None
    if payload is not None:
        data_bytes = json.dumps(payload).encode("utf-8")
        req_headers["Content-Type"] = "application/json"

    last_err: Optional[Exception] = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, data=data_bytes, headers=req_headers, method=method)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as exc:
            last_err = exc
            time.sleep(1.2 * (attempt + 1))
    raise RuntimeError(f"HTTP JSON failed: {method} {url}") from last_err


def previous_week_range(today: Optional[date] = None) -> Tuple[date, date]:
    today = today or date.today()
    this_monday = today - timedelta(days=today.weekday())
    return this_monday - timedelta(days=7), this_monday - timedelta(days=1)


def is_first_monday(today: Optional[date] = None) -> bool:
    today = today or date.today()
    return today.weekday() == 0 and 1 <= today.day <= 7


def clean_title(title: str) -> str:
    return re.sub(r"\s+", " ", (title or "").strip())


def translate_to_french(text: str) -> str:
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=" + urllib.parse.quote(text)
        data = http_json(url, timeout=10)
        translated = "".join([x[0] for x in data[0]])
        return translated
    except Exception:
        return text  # fallback en anglais si erreur

def one_sentence(text: str, fallback: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    if not text:
        return fallback

    sentences = re.split(r"(?<=[.!?])\s+", text)

    selected = []
    for s in sentences:
        s_clean = s.strip()

        if len(s_clean) < 40:
            continue

        if any(x in s_clean.lower() for x in [
            "copyright",
            "all rights reserved",
            "doi:",
            "trial registration"
        ]):
            continue

        selected.append(s_clean)

        if len(selected) == 2:
            break

    if not selected:
        return fallback

    result = " ".join(selected)

    # Traduction simple en français
    result_fr = translate_to_french(result)

    if len(result_fr) > 360:
        result_fr = result_fr[:357].rsplit(" ", 1)[0] + "..."

    return result_fr


def pubdate_from_summary(summary: Dict[str, Any]) -> str:
    return summary.get("epubdate") or summary.get("pubdate") or ""


def pubmed_search(query: str, start: date, end: date, retmax: int) -> List[str]:
    term = (
        f'({query}) AND {PUBMED_PUBLICATION_FILTER} '
        f'AND ("{start.isoformat()}"[Date - Publication] : "{end.isoformat()}"[Date - Publication])'
    )
    params = {
        "db": "pubmed",
        "term": term,
        "retmode": "json",
        "retmax": str(retmax),
        "sort": "pub+date",
        "tool": "saric_biblio",
        "email": NCBI_EMAIL,
    }
    if NCBI_API_KEY:
        params["api_key"] = NCBI_API_KEY

    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + urllib.parse.urlencode(params)
    data = http_json(url, timeout=20)
    return data.get("esearchresult", {}).get("idlist", []) or []


def pubmed_summary(pmids: Iterable[str]) -> Dict[str, Dict[str, Any]]:
    ids = list(dict.fromkeys(pmids))
    if not ids:
        return {}

    result_map: Dict[str, Dict[str, Any]] = {}
    for i in range(0, len(ids), 150):
        chunk = ids[i:i + 150]
        params = {
            "db": "pubmed",
            "id": ",".join(chunk),
            "retmode": "json",
            "tool": "saric_biblio",
            "email": NCBI_EMAIL,
        }
        if NCBI_API_KEY:
            params["api_key"] = NCBI_API_KEY

        url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?" + urllib.parse.urlencode(params)
        data = http_json(url, timeout=25)
        result = data.get("result", {})
        for pmid in chunk:
            if pmid in result:
                result_map[str(pmid)] = result[pmid]

        time.sleep(0.12 if NCBI_API_KEY else 0.34)
    return result_map


def semantic_batch_by_pmids(pmids: List[str]) -> Dict[str, Dict[str, Any]]:
    """Retourne {pmid: semantic_paper}. Utilise l'API batch pour accélérer."""
    out: Dict[str, Dict[str, Any]] = {}
    if not pmids:
        return out

    fields = "title,abstract,year,publicationDate,citationCount,venue,url,externalIds"
    url = "https://api.semanticscholar.org/graph/v1/paper/batch?fields=" + urllib.parse.quote(fields)
    headers = {}
    if SEMANTIC_SCHOLAR_API_KEY:
        headers["x-api-key"] = SEMANTIC_SCHOLAR_API_KEY

    for i in range(0, len(pmids), SEMANTIC_BATCH_SIZE):
        chunk = pmids[i:i + SEMANTIC_BATCH_SIZE]
        payload = {"ids": [f"PMID:{p}" for p in chunk]}

        try:
            papers = http_json(
                url,
                method="POST",
                payload=payload,
                headers=headers,
                retries=2,
                timeout=30,
            )
            if isinstance(papers, list):
                for paper in papers:
                    if not paper:
                        continue
                    ext = paper.get("externalIds") or {}
                    pmid = str(ext.get("PubMed") or ext.get("PMID") or "")
                    if pmid:
                        out[pmid] = paper
        except Exception as exc:
            print(f"Semantic batch failed for chunk {i // SEMANTIC_BATCH_SIZE + 1}: {exc}")

        time.sleep(0.5 if SEMANTIC_SCHOLAR_API_KEY else 1.5)

    return out


def compute_quality_score(title: str, citation_count: int) -> float:
    t = title.lower()
    bonus = 0
    for term in HIGH_VALUE_TERMS:
        if term in t:
            bonus += 3
    return citation_count * 10 + bonus

TOP_JOURNALS = [
    "new england journal of medicine", "nejm",
    "lancet", "jama", "bmj",
    "circulation", "jacc", "european heart journal", "eur heart j",
    "intensive care medicine", "critical care", "critical care medicine",
    "american journal of respiratory and critical care medicine", "ajrccm",
    "british journal of anaesthesia", "bja",
    "anesthesiology", "anesthesia & analgesia", "anaesthesia",
    "clinical infectious diseases", "lancet infectious diseases",
    "journal of thoracic and cardiovascular surgery", "jtcvs",
    "european journal of cardio-thoracic surgery", "ejcts",
    "annals of thoracic surgery",
]


def study_type_score(title: str) -> int:
    t = title.lower()

    if any(x in t for x in ["guideline", "recommendation", "recommendations", "consensus", "position statement"]):
        return 100

    if any(x in t for x in ["meta-analysis", "systematic review"]):
        return 90

    if any(x in t for x in ["randomized", "randomised", "randomized controlled", "trial"]):
        return 80

    if "multicenter" in t or "multicentre" in t:
        return 70

    if "cohort" in t or "registry" in t:
        return 60

    return 30


def journal_score(venue: str) -> int:
    v = (venue or "").lower()

    for journal in TOP_JOURNALS:
        if journal in v:
            return 40

    return 10


def domain_relevance_score(domain: str, title: str) -> int:
    t = title.lower()
    bonus = 0

    if domain == "Réanimation":
        if any(x in t for x in ["icu", "intensive care", "critical care", "sepsis", "shock", "ards", "ventilation"]):
            bonus += 25

    elif domain == "Anesthésie":
        if any(x in t for x in ["anesthesia", "anaesthesia", "analgesia", "block", "perioperative", "airway"]):
            bonus += 25

    elif domain == "Cardiologie":
        if any(x in t for x in ["heart", "cardiac", "coronary", "valve", "arrhythmia", "heart failure", "myocardial"]):
            bonus += 25

    elif domain == "Chirurgie cardiaque":
        if any(x in t for x in ["cardiac surgery", "cardiothoracic", "thoracic surgery", "cabg", "aortic", "valve surgery", "ecmo"]):
            bonus += 25

    elif domain == "Infectiologie":
        if any(x in t for x in ["infection", "infectious", "antibiotic", "antimicrobial", "bacteremia", "endocarditis", "sepsis"]):
            bonus += 25

    return bonus


def citation_score(citation_count: int) -> int:
    return min(int(citation_count or 0), 20)


def compute_final_score(title: str, venue: str, domain: str, citation_count: int) -> float:
    return (
        study_type_score(title)
        + journal_score(venue)
        + domain_relevance_score(domain, title)
        + citation_score(citation_count)
    )


def article_url(pmid: str, sem: Optional[Dict[str, Any]]) -> str:
    if sem and sem.get("url"):
        return sem["url"]
    return f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"

def pubmed_abstracts(pmids: List[str]) -> Dict[str, str]:
    if not pmids:
        return {}

    import xml.etree.ElementTree as ET

    out: Dict[str, str] = {}

    for i in range(0, len(pmids), 100):
        chunk = pmids[i:i + 100]

        params = {
            "db": "pubmed",
            "id": ",".join(chunk),
            "retmode": "xml",
            "tool": "saric_biblio",
            "email": NCBI_EMAIL,
        }

        if NCBI_API_KEY:
            params["api_key"] = NCBI_API_KEY

        url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?" + urllib.parse.urlencode(params)

        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=30) as resp:
                xml_text = resp.read().decode("utf-8", errors="replace")

            root = ET.fromstring(xml_text)

            for article in root.findall(".//PubmedArticle"):
                pmid_el = article.find(".//PMID")
                if pmid_el is None or not pmid_el.text:
                    continue

                pmid = pmid_el.text.strip()
                parts = []

                for abs_el in article.findall(".//AbstractText"):
                    txt = "".join(abs_el.itertext()).strip()
                    if txt:
                        label = abs_el.attrib.get("Label")
                        parts.append(f"{label}: {txt}" if label else txt)

                if parts:
                    out[pmid] = " ".join(parts)

        except Exception as exc:
            print(f"Erreur récupération abstracts PubMed: {exc}")

        time.sleep(0.12 if NCBI_API_KEY else 0.34)

    return out


def doi_from_summary(summary: Dict[str, Any]) -> str:
    for item in summary.get("articleids", []) or []:
        if item.get("idtype") == "doi" and item.get("value"):
            return item["value"]
    return ""


def crossref_citation_count(doi: str) -> int:
    if not doi:
        return 0

    url = "https://api.crossref.org/works/" + urllib.parse.quote(doi)

    try:
        data = http_json(url, timeout=15)
        return int(data.get("message", {}).get("is-referenced-by-count") or 0)
    except Exception:
        return 0

def update_publications() -> None:
    start, end = previous_week_range()
    print(f"Recherche des publications du {start.isoformat()} au {end.isoformat()}")

    pmids: List[str] = []
    domain_hits: Dict[str, int] = {}
    pmid_domains: Dict[str, str] = {}

    for domain, terms in DOMAINS.items():
        query = " OR ".join(f'"{t}"' for t in terms)
        ids = pubmed_search(query, start, end, retmax=PUBMED_RETMAX_PER_DOMAIN)

        domain_hits[domain] = len(ids)

        for pmid in ids:
            if pmid not in pmid_domains:
                pmid_domains[pmid] = domain

        pmids.extend(ids)
        time.sleep(0.12 if NCBI_API_KEY else 0.34)

    pmids = list(dict.fromkeys(pmids))[:MAX_PMIDS_TOTAL]

    print(f"Articles PubMed uniques retenus avant enrichissement : {len(pmids)}")
    print(f"Répartition par domaine : {domain_hits}")

    summaries = pubmed_summary(pmids)
    semantic = semantic_batch_by_pmids(pmids)
    abstracts = pubmed_abstracts(pmids)

    items: List[BiblioItem] = []

    for pmid in pmids:
        summary = summaries.get(str(pmid), {})
        title = clean_title(summary.get("title", ""))

        if not title:
            continue

        sem = semantic.get(str(pmid))

        citation_count = int((sem or {}).get("citationCount") or 0)

        if citation_count == 0:
            doi = doi_from_summary(summary)
            citation_count = crossref_citation_count(doi)

        abstract = (sem or {}).get("abstract") or abstracts.get(str(pmid), "")

        venue = (sem or {}).get("venue") or summary.get("source") or "PubMed"
        pub_date = (sem or {}).get("publicationDate") or pubdate_from_summary(summary)

        domain = pmid_domains.get(str(pmid), "")
score = compute_final_score(title, venue, domain, citation_count)

        items.append(BiblioItem(
            source=venue,
            date=pub_date,
            titre=title,
            description=one_sentence(
                abstract,
                "Article publié la semaine écoulée dans un domaine SARIC, indexé dans PubMed."
            ),
            lien=article_url(pmid, sem),
            citation_count=citation_count,
            score=score,
            domaine=domain,
        ))

    domain_order = [
    "Réanimation",
    "Anesthésie",
    "Cardiologie",
    "Chirurgie cardiaque",
    "Infectiologie",
]

final_selection: List[BiblioItem] = []

for domain in domain_order:
    group = [item for item in items if item.domaine == domain]
    group = sorted(group, key=lambda x: x.score, reverse=True)

    final_selection.extend(group[:4])

final_selection = sorted(
    final_selection,
    key=lambda x: (domain_order.index(x.domaine), -x.score)
)

DATA_DIR.mkdir(parents=True, exist_ok=True)

PUBLICATIONS_PATH.write_text(
    json.dumps([x.as_json() for x in final_selection], ensure_ascii=False, indent=2),
    encoding="utf-8",
)

print(f"{len(final_selection)} publications écrites dans {PUBLICATIONS_PATH} : 4 par domaine si disponibles")

def pubmed_guidelines(start: date, end: date) -> List[BiblioItem]:
    terms = [
        '"Practice Guideline"[Publication Type]',
        '"Guideline"[Publication Type]',
        'guideline',
        'recommendations',
        '"expert consensus"',
        '"position statement"',
    ]
    domain_terms = []
    for values in DOMAINS.values():
        domain_terms.extend(values)

    quoted_domains = " OR ".join(f'"{t}"' for t in domain_terms)
    query = f'({" OR ".join(terms)}) AND ({quoted_domains})'
    pmids = pubmed_search(query, start, end, retmax=80)
    summaries = pubmed_summary(pmids)

    out: List[BiblioItem] = []
    for pmid, s in summaries.items():
        title = clean_title(s.get("title", ""))
        if not title:
            continue
        out.append(BiblioItem(
            source=s.get("source") or "PubMed",
            date=pubdate_from_summary(s),
            titre=title,
            description="Recommandation, guideline ou consensus récent dans un domaine SARIC.",
            lien=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
        ))
    return out


def crossref_guidelines(start: date, end: date) -> List[BiblioItem]:
    queries = [
        '"guideline" cardiology',
        '"recommendations" cardiac surgery',
        '"expert consensus" anaesthesia',
        '"guidelines" intensive care',
        '"guidelines" infectious diseases',
        '"ESC guidelines"',
        '"cardiac surgery guidelines"',
    ]

    found: List[BiblioItem] = []
    for q in queries:
        params = {
            "query.bibliographic": q,
            "filter": f"from-pub-date:{start.isoformat()},until-pub-date:{end.isoformat()}",
            "rows": "4",
            "sort": "published",
            "order": "desc",
            "mailto": NCBI_EMAIL,
        }
        url = "https://api.crossref.org/works?" + urllib.parse.urlencode(params)
        try:
            data = http_json(url, timeout=20)
            for it in data.get("message", {}).get("items", []):
                title = clean_title((it.get("title") or [""])[0])
                if not title:
                    continue
                pub = it.get("published-print") or it.get("published-online") or {}
                parts = pub.get("date-parts", [[]])[0]
                pub_date = "-".join(str(x).zfill(2) for x in parts) if parts else ""
                found.append(BiblioItem(
                    source=(it.get("container-title") or ["Crossref"])[0],
                    date=pub_date,
                    titre=title,
                    description="Recommandation, guideline ou consensus récent identifié automatiquement.",
                    lien=it.get("URL") or "",
                ))
        except Exception as exc:
            print(f"Crossref failed for {q}: {exc}")
        time.sleep(0.5)
    return found


def society_source_links() -> List[BiblioItem]:
    return [
        BiblioItem("SFAR", "Mise à jour mensuelle", "Page recommandations SFAR",
                   "Page source à surveiller pour les recommandations formalisées d’experts en anesthésie-réanimation.",
                   "https://sfar.org/recommandations/"),
        BiblioItem("SRLF", "Mise à jour mensuelle", "Page recommandations SRLF",
                   "Page source à surveiller pour les recommandations en médecine intensive-réanimation.",
                   "https://www.srlf.org/recommandations/"),
        BiblioItem("SPILF", "Mise à jour mensuelle", "Page recommandations SPILF",
                   "Page source à surveiller pour les recommandations en infectiologie et antibiothérapie.",
                   "https://www.infectiologie.com/fr/recommandations.html"),
        BiblioItem("ESC", "Mise à jour mensuelle", "ESC Clinical Practice Guidelines",
                   "Page source des recommandations européennes de cardiologie.",
                   "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines"),
        BiblioItem("EACTS", "Mise à jour mensuelle", "EACTS Guidelines",
                   "Page source à surveiller pour les recommandations en chirurgie cardio-thoracique.",
                   "https://www.eacts.org/resources/guidelines/"),
    ]


def update_recommandations() -> None:
    today = date.today()
    start = today - timedelta(days=183)
    end = today

    print(f"Recherche recommandations du {start.isoformat()} au {end.isoformat()}")

    items = []
    try:
        items.extend(pubmed_guidelines(start, end))
    except Exception as exc:
        print(f"PubMed guidelines failed: {exc}")

    try:
        items.extend(crossref_guidelines(start, end))
    except Exception as exc:
        print(f"Crossref guidelines failed: {exc}")

    seen = set()
    unique: List[BiblioItem] = []
    for item in items:
        key = clean_title(item.titre).lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(item)

    unique = unique[:10]

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    RECOMMANDATIONS_PATH.write_text(
        json.dumps([x.as_json() for x in unique], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"{len(unique)} recommandations écrites dans {RECOMMANDATIONS_PATH}")


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Tous les lundis : publications + recommandations
    update_publications()
    update_recommandations()


if __name__ == "__main__":
    main()
