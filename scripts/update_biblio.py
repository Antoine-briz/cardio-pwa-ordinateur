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
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

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
    documents: Optional[List[Dict[str, str]]] = None

    def as_json(self) -> Dict[str, Any]:
        data = {
            "source": self.source,
            "date": self.date,
            "titre": self.titre,
            "description": self.description,
            "lien": self.lien,
            "domaine": self.domaine,
            "citations": str(self.citation_count),
            "score": str(round(self.score, 1)),
        }

        if self.documents:
            data["documents"] = self.documents

        return data

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

def smart_abstract_summary(text: str, fallback: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    if not text:
        return fallback

    sentences = re.split(r"(?<=[.!?])\s+", text)

    good_sentences = []

    for s in sentences:
        s_clean = s.strip()
        low = s_clean.lower()

        if len(s_clean) < 40:
            continue

        # ❌ phrases inutiles
        if any(x in low for x in [
            "copyright",
            "all rights reserved",
            "doi:",
            "trial registration"
        ]):
            continue

        # ✅ phrases intéressantes
        score = 0

        if any(x in low for x in ["randomized", "trial", "cohort", "study", "analysis"]):
            score += 2

        if any(x in low for x in ["result", "outcome", "associated", "significant", "increase", "decrease"]):
            score += 3

        if any(x in low for x in ["objective", "aim", "background"]):
            score += 1

        good_sentences.append((score, s_clean))

    if not good_sentences:
        return fallback

    # 🔥 tri des meilleures phrases
    good_sentences.sort(reverse=True)

    selected = [s for _, s in good_sentences[:2]]

    result = " ".join(selected)

    # 🇫🇷 traduction
    result_fr = translate_to_french(result)

    if len(result_fr) > 320:
        result_fr = result_fr[:317].rsplit(" ", 1)[0] + "..."

    return result_fr

def llm_abstract_summary(title: str, abstract: str, fallback: str) -> str:
    abstract = re.sub(r"\s+", " ", (abstract or "").strip())

    if not abstract:
        return fallback

    if not OPENAI_API_KEY:
        return smart_abstract_summary(abstract, fallback)

    prompt = f"""
Tu es médecin anesthésiste-réanimateur et tu rédiges une veille bibliographique médicale.

Résume l'abstract ci-dessous en français, en 1 à 2 phrases maximum.
Le résumé doit expliquer clairement l'objectif, le type d'étude et le message principal.
Maximum 450 caractères. Ne conclus pas au-delà de l'abstract.

Titre :
{title}

Abstract :
{abstract}
""".strip()

    payload = {
        "model": "gpt-4o-mini",
        "input": prompt,
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
    }

    delays = [3, 8]

    for attempt, delay in enumerate(delays, start=1):
        try:
            req = urllib.request.Request(
                "https://api.openai.com/v1/responses",
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            text = data.get("output_text", "").strip()

            if not text:
                try:
                    text = data["output"][0]["content"][0]["text"].strip()
                except Exception:
                    text = ""

            if not text:
                return smart_abstract_summary(abstract, fallback)

            text = re.sub(r"\s+", " ", text).strip()

            if len(text) > 520:
                text = text[:517].rsplit(" ", 1)[0] + "..."

            print(f"LLM résumé utilisé pour : {title[:50]}")
            return text

        except Exception as exc:
            print(f"ERREUR LLM tentative {attempt} pour '{title[:60]}': {type(exc).__name__} - {exc}")
            time.sleep(delay)

    return smart_abstract_summary(abstract, fallback)

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
    print("OPENAI KEY:", "OK" if OPENAI_API_KEY else "ABSENTE")

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
            description=smart_abstract_summary(
              abstract,
              "Résumé automatique indisponible pour cet article."
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

        final_selection.extend(group[:5])

        final_selection = sorted(
        final_selection,
        key=lambda x: (domain_order.index(x.domaine), -x.score)
    )

    # Résumés LLM uniquement pour les 25 articles sélectionnés
    for item in final_selection:
        full_abstract = ""

        for pmid in pmids:
            summary = summaries.get(str(pmid), {})
            if clean_title(summary.get("title", "")) == item.titre:
                sem = semantic.get(str(pmid))
                full_abstract = (sem or {}).get("abstract") or abstracts.get(str(pmid), "")
                break

        item.description = llm_abstract_summary(
            item.titre,
            full_abstract,
            item.description or "Résumé automatique indisponible pour cet article."
        )

        time.sleep(3.0)


  
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

def html_text_snippet(html: str, max_len: int = 220) -> str:
    text = re.sub(r"<script.*?</script>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<style.*?</style>", " ", text, flags=re.S | re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:max_len].rsplit(" ", 1)[0] + "..." if len(text) > max_len else text


def fetch_html(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_recommendation_candidates(source: str, page_url: str, max_candidates: int = 100) -> List[Dict[str, str]]:
    html = fetch_html(page_url)

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        title = html_text_snippet(label_html, 320)
        if not title or len(title) < 10:
            continue

        low = f"{title} {href}".lower()

        if any(x in low for x in [
            "accueil", "contact", "connexion", "login", "adhérer",
            "facebook", "twitter", "linkedin", "youtube", "instagram",
            "mentions", "privacy", "cookies", "search", "rechercher",
            "congrès", "agenda", "formation", "newsletter", "sitemap",
            "membership", "education", "about", "news"
        ]):
            continue

        if not any(x in low for x in [
            "recommandation", "recommandations",
            "guideline", "guidelines",
            "rfe", "rpp", "consensus",
            "référentiel", "referentiel",
            "prise en charge",
            "clinical practice",
            "practice guideline",
            "position statement",
            "diaporama"
        ]):
            continue

        full_url = urllib.parse.urljoin(page_url, href)

        year_match = re.search(r"(20\d{2})", title + " " + href)
        year = year_match.group(1) if year_match else "À vérifier"

        candidates.append({
            "source": source,
            "date": year,
            "titre": title,
            "description": "",
            "lien": full_url,
        })

    seen = set()
    unique = []

    for item in candidates:
        key = (item["titre"].lower().strip(), item["lien"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    return unique[:max_candidates]


def llm_select_recommendations(source: str, page_url: str, candidates: List[Dict[str, str]]) -> List[Dict[str, str]]:
    if not candidates:
        return []

    if not OPENAI_API_KEY:
        return candidates[:3]

    prompt = f"""
Tu es médecin anesthésiste-réanimateur et tu dois sélectionner les vraies recommandations officielles les plus récentes.

Source : {source}
Page officielle : {page_url}

Parmi les candidats ci-dessous, sélectionne exactement les 3 recommandations/guidelines officielles les plus récentes.
Exclus les liens de navigation, congrès, actualités, formation, vidéos, pages génériques, pages d'accueil et archives non pertinentes.

Pour chaque recommandation, rédige une description courte en français, en une phrase, expliquant le thème principal.
Ne pas inventer d'information absente du titre. Si le thème est incertain, rester général.

Retourne uniquement un JSON valide sous cette forme :
[
  {{"date":"YYYY ou date courte", "titre":"...", "description":"...", "lien":"..."}},
  {{"date":"YYYY ou date courte", "titre":"...", "description":"...", "lien":"..."}},
  {{"date":"YYYY ou date courte", "titre":"...", "description":"...", "lien":"..."}}
]

Candidats :
{json.dumps(candidates, ensure_ascii=False)}
""".strip()

    payload = {
        "model": "gpt-4o-mini",
        "input": prompt,
    }

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
    }

    try:
        req = urllib.request.Request(
            "https://api.openai.com/v1/responses",
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        text = data.get("output_text", "").strip()

        if not text:
            text = data["output"][0]["content"][0]["text"].strip()

        text = re.sub(r"^```json\s*|\s*```$", "", text.strip(), flags=re.I | re.S)
        selected = json.loads(text)

        if isinstance(selected, list):
            return selected[:3]

    except Exception as exc:
        print(f"LLM recommandations indisponible pour {source}: {type(exc).__name__} - {exc}")

    return candidates[:3]


def fetch_society_recommendations(source: str, page_url: str) -> BiblioItem:
    try:
        candidates = extract_recommendation_candidates(source, page_url)
        selected = llm_select_recommendations(source, page_url, candidates)

        if not selected:
            selected = [{
                "date": "À vérifier",
                "titre": f"Page officielle {source}",
                "description": "Ouvrir la page officielle pour vérifier les dernières recommandations.",
                "lien": page_url,
            }]

        dates = " / ".join([x.get("date", "") for x in selected if x.get("date")])

        return BiblioItem(
            source=source,
            date=dates or "À vérifier",
            titre=f"3 dernières recommandations {source}",
            description="",
            lien=selected[0].get("lien") or page_url,
            domaine="Recommandations",
            documents=selected,
        )

    except Exception as exc:
        print(f"{source}: erreur recommandations: {exc}")

        return BiblioItem(
            source=source,
            date="À vérifier",
            titre=f"Page officielle {source}",
            description="",
            lien=page_url,
            domaine="Recommandations",
            documents=[{
                "date": "À vérifier",
                "titre": f"Page officielle {source}",
                "description": "Impossible de récupérer automatiquement les recommandations.",
                "lien": page_url,
            }],
        )

def fetch_spilf_recommendations() -> BiblioItem:
    page_url = "https://www.infectiologie.com/fr/diaporamas-recommandations.html"
    source = "SPILF"

    try:
        candidates = extract_recommendation_candidates(source, page_url, max_candidates=30)

        if not candidates:
            raise RuntimeError("Aucun candidat SPILF trouvé")

        prompt = f"""
Tu es médecin infectiologue et tu dois sélectionner les dernières recommandations officielles SPILF.

Page officielle : {page_url}

Important :
- cette page est déjà organisée de la plus récente vers la plus ancienne ;
- sélectionne les 3 recommandations les plus récentes affichées sur cette page ;
- privilégie donc les premiers vrais liens de recommandations/diaporamas ;
- exclus uniquement les menus, archives, navigation, réseaux sociaux, pages génériques.

Pour chaque recommandation, rédige une description courte en français, en une phrase.

Retourne uniquement un JSON valide :
[
  {{"date":"YYYY", "titre":"...", "description":"...", "lien":"..."}},
  {{"date":"YYYY", "titre":"...", "description":"...", "lien":"..."}},
  {{"date":"YYYY", "titre":"...", "description":"...", "lien":"..."}}
]

Candidats :
{json.dumps(candidates, ensure_ascii=False)}
""".strip()

        if not OPENAI_API_KEY:
            selected = candidates[:3]
        else:
            payload = {
                "model": "gpt-4o-mini",
                "input": prompt,
            }

            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
            }

            req = urllib.request.Request(
                "https://api.openai.com/v1/responses",
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            text = data.get("output_text", "").strip()

            if not text:
                text = data["output"][0]["content"][0]["text"].strip()

            text = re.sub(r"^```json\s*|\s*```$", "", text.strip(), flags=re.I | re.S)
            selected = json.loads(text)[:3]

        return BiblioItem(
            source="SPILF",
            date=" / ".join([x.get("date", "") for x in selected if x.get("date")]),
            titre="3 dernières recommandations SPILF",
            description="",
            lien=selected[0].get("lien") if selected else page_url,
            domaine="Recommandations",
            documents=selected,
        )

    except Exception as exc:
        print(f"SPILF recommandations indisponibles: {type(exc).__name__} - {exc}")
        return fetch_society_recommendations("SPILF", page_url)

def latest_link_from_page(source: str, page_url: str, keywords: List[str]) -> Optional[BiblioItem]:
    try:
        html = fetch_html(page_url)
    except Exception as exc:
        print(f"{source}: impossible de lire {page_url}: {exc}")
        return BiblioItem(
            source=source,
            date="À vérifier",
            titre=f"Page officielle {source}",
            description=f"Impossible de récupérer automatiquement la dernière recommandation. Ouvrir la page officielle.",
            lien=page_url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 180)
        low = f"{label} {href}".lower()

        if not label or len(label) < 8:
            continue

        if any(k.lower() in low for k in keywords):
            full_url = urllib.parse.urljoin(page_url, href)
            candidates.append((label, full_url))

    if not candidates:
        return BiblioItem(
            source=source,
            date="À vérifier",
            titre=f"Page officielle {source}",
            description="Aucune recommandation individuelle détectée automatiquement. Ouvrir la page officielle.",
            lien=page_url,
            domaine="Recommandations",
        )

    title, link = candidates[0]

    return BiblioItem(
        source=source,
        date="Dernière détectée",
        titre=title,
        description=f"Dernière recommandation ou guideline détectée automatiquement sur le site officiel {source}.",
        lien=link,
        domaine="Recommandations",
    )


def fetch_latest_sfar_reco() -> Optional[BiblioItem]:
    url = "https://sfar.org/recommandations/"

    try:
        html = fetch_html(url)
    except Exception as exc:
        print(f"SFAR erreur : {exc}")
        return BiblioItem(
            source="SFAR",
            date="À vérifier",
            titre="Recommandations SFAR",
            description="Impossible de récupérer automatiquement les recommandations. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 260)

        if not label:
            continue

        low = label.lower()

        # Ignorer navigation / menus / liens non pertinents
        if any(x in low for x in [
            "accueil",
            "adhérer",
            "connexion",
            "contact",
            "facebook",
            "twitter",
            "linkedin",
            "youtube",
            "instagram",
            "rechercher",
            "mentions",
            "politique",
            "plan du site",
            "congrès",
            "formation",
            "actualités",
            "agenda",
            "la sfar",
        ]):
            continue

        # Garder les vrais intitulés de recommandations
        if not any(x in low for x in [
            "prise en charge",
            "gestion",
            "recommandation",
            "référentiel",
            "rfe",
            "rpp",
            "antibioprophylaxie",
            "analgésie",
            "intubation",
            "diagnostic",
            "sepsis",
            "traumatisme",
            "périopératoire",
            "péri opératoire",
            "hémorragie",
            "réanimation",
            "anesthésie",
            "douleur",
            "patient",
            "procédure",
        ]):
            continue

        # Exclure les titres trop génériques
        if len(label) < 20:
            continue

        full_url = urllib.parse.urljoin(url, href)

        year_match = re.search(r"(20\d{2})", label + " " + href)
        year = year_match.group(1) if year_match else "Récent"

        candidates.append({
            "title": label,
            "url": full_url,
            "year": year,
        })

    # Déduplication par titre
    seen = set()
    unique = []

    for item in candidates:
        key = item["title"].lower().strip()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    top3 = unique[:3]

    if not top3:
        return BiblioItem(
            source="SFAR",
            date="À vérifier",
            titre="Recommandations SFAR",
            description="Aucune recommandation individuelle détectée automatiquement. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    titre = " | ".join([x["title"] for x in top3])
    lien = top3[0]["url"]

    description = "3 dernières recommandations SFAR : " + " ; ".join(
        [f'{x["title"]} ({x["url"]})' for x in top3]
    )

    return BiblioItem(
        source="SFAR",
        date=top3[0]["year"],
        titre=titre,
        description=description,
        lien=lien,
        domaine="Recommandations",
    )

def fetch_latest_srlf_reco() -> Optional[BiblioItem]:
    url = "https://www.srlf.org/recommandations-referentiels-epp"

    try:
        html = fetch_html(url)
    except Exception as exc:
        print(f"SRLF erreur : {exc}")
        return BiblioItem(
            source="SRLF",
            date="À vérifier",
            titre="Recommandations, référentiels et EPP SRLF",
            description="Impossible de récupérer automatiquement les recommandations. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 260)

        if not label:
            continue

        low = label.lower()

        # Ignorer navigation / menus / réseaux sociaux
        if any(x in low for x in [
            "accueil",
            "adhérer",
            "connexion",
            "contact",
            "facebook",
            "twitter",
            "linkedin",
            "youtube",
            "instagram",
            "mentions",
            "politique",
            "plan du site",
            "agenda",
            "congrès",
            "formation",
            "actualités",
            "la srlf",
            "rechercher",
            "voir plus",
            "lire la suite",
        ]):
            continue

        # Garder les vrais intitulés de recommandations/référentiels/EPP
        if not any(x in low for x in [
            "recommandation",
            "recommandations",
            "référentiel",
            "référentiels",
            "epp",
            "rfe",
            "consensus",
            "conférence",
            "prise en charge",
            "pratiques",
            "guidelines",
        ]):
            continue

        if len(label) < 20:
            continue

        full_url = urllib.parse.urljoin(url, href)

        year_match = re.search(r"(20\d{2})", label + " " + href)
        year = int(year_match.group(1)) if year_match else 0

        candidates.append({
            "title": label,
            "url": full_url,
            "year": year,
        })

    # Déduplication
    seen = set()
    unique = []

    for item in candidates:
        key = item["title"].lower().strip()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    # Les plus récentes d'abord si l'année est détectée,
    # sinon on conserve l'ordre de la page.
    unique = sorted(
        unique,
        key=lambda x: x["year"],
        reverse=True
    )

    top3 = unique[:3]

    if not top3:
        return BiblioItem(
            source="SRLF",
            date="À vérifier",
            titre="Recommandations, référentiels et EPP SRLF",
            description="Aucune recommandation individuelle détectée automatiquement. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    titre = " | ".join([x["title"] for x in top3])
    lien = top3[0]["url"]

    description = "3 dernières recommandations SRLF : " + " ; ".join(
        [f'{x["title"]} ({x["url"]})' for x in top3]
    )

    best_year = top3[0]["year"]

    return BiblioItem(
        source="SRLF",
        date=str(best_year) if best_year else "Récent",
        titre=titre,
        description=description,
        lien=lien,
        domaine="Recommandations",
    )


def fetch_latest_spilf_reco() -> Optional[BiblioItem]:
    url = "https://www.infectiologie.com/fr/diaporamas-recommandations.html"

    try:
        html = fetch_html(url)
    except Exception as exc:
        print(f"SPILF erreur : {exc}")
        return BiblioItem(
            source="SPILF",
            date="À vérifier",
            titre="Diaporamas des recommandations SPILF",
            description="Impossible de récupérer automatiquement les recommandations. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 220)

        if not label:
            continue

        low = label.lower()

        # On ignore les liens de menu/navigation
        if any(x in low for x in [
            "accueil",
            "documents",
            "recommandations archivées",
            "partager",
            "facebook",
            "twitter",
            "linkedin",
            "accès membres",
        ]):
            continue

        # On ne garde que les liens de la liste des diaporamas
        if not any(x in low for x in [
            "antibiothérapie",
            "allergie",
            "traitement",
            "syphilis",
            "endocardite",
            "encéphalites",
            "pneumopathie",
            "pneumonies",
            "infection",
            "infections",
            "arthrites",
            "abcès",
            "bêta-lactamines",
            "légionellose",
        ]):
            continue

        full_url = urllib.parse.urljoin(url, href)

        year_match = re.search(r"(20\d{2})", label)
        year = year_match.group(1) if year_match else "Récent"

        candidates.append({
            "title": label,
            "url": full_url,
            "year": year,
        })

    top3 = candidates[:3]

    if not top3:
        return BiblioItem(
            source="SPILF",
            date="À vérifier",
            titre="Diaporamas des recommandations SPILF",
            description="Aucun diaporama individuel détecté automatiquement. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    titre = " | ".join([x["title"] for x in top3])
    lien = top3[0]["url"]

    description = "3 dernières recommandations SPILF : " + " ; ".join(
        [f'{x["title"]} ({x["url"]})' for x in top3]
    )

    return BiblioItem(
        source="SPILF",
        date=top3[0]["year"],
        titre=titre,
        description=description,
        lien=lien,
        domaine="Recommandations",
    )


def fetch_latest_esc_guideline() -> Optional[BiblioItem]:
    url = "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/"

    try:
        html = fetch_html(url)
    except Exception as exc:
        print(f"ESC erreur : {exc}")
        return BiblioItem(
            source="ESC",
            date="À vérifier",
            titre="ESC Clinical Practice Guidelines",
            description="Impossible de récupérer automatiquement les recommandations. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 280)

        if not label:
            continue

        low = label.lower()

        # Ignorer navigation / menus / filtres / liens non pertinents
        if any(x in low for x in [
            "login",
            "my esc",
            "congress",
            "membership",
            "education",
            "journals",
            "news",
            "about",
            "contact",
            "privacy",
            "cookies",
            "terms",
            "advertising",
            "sitemap",
            "all rights",
            "download the app",
            "esc 365",
            "search",
            "filter",
        ]):
            continue

        # Garder les vraies guidelines ESC
        if not any(x in low for x in [
            "guidelines",
            "esc guidelines",
            "clinical practice guidelines",
            "focused update",
            "consensus statement",
        ]):
            continue

        if len(label) < 20:
            continue

        full_url = urllib.parse.urljoin(url, href)

        year_match = re.search(r"(20\d{2})", label + " " + href)
        year = int(year_match.group(1)) if year_match else 0

        candidates.append({
            "title": label,
            "url": full_url,
            "year": year,
        })

    # Déduplication par titre
    seen = set()
    unique = []

    for item in candidates:
        key = item["title"].lower().strip()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    # Plus récentes d'abord si année détectée
    unique = sorted(
        unique,
        key=lambda x: x["year"],
        reverse=True
    )

    top3 = unique[:3]

    if not top3:
        return BiblioItem(
            source="ESC",
            date="À vérifier",
            titre="ESC Clinical Practice Guidelines",
            description="Aucune guideline individuelle détectée automatiquement. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    titre = " | ".join([x["title"] for x in top3])
    lien = top3[0]["url"]

    description = "3 dernières recommandations ESC : " + " ; ".join(
        [f'{x["title"]} ({x["url"]})' for x in top3]
    )

    best_year = top3[0]["year"]

    return BiblioItem(
        source="ESC",
        date=str(best_year) if best_year else "Récent",
        titre=titre,
        description=description,
        lien=lien,
        domaine="Recommandations",
    )
  
def fetch_latest_eacts_guideline() -> Optional[BiblioItem]:
    url = "https://www.eacts.org/clinical-practice-guidelines/"

    try:
        html = fetch_html(url)
    except Exception as exc:
        print(f"EACTS erreur : {exc}")
        return BiblioItem(
            source="EACTS",
            date="À vérifier",
            titre="EACTS Clinical Practice Guidelines",
            description="Impossible de récupérer automatiquement les recommandations. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    links = re.findall(
        r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
        html,
        flags=re.I | re.S
    )

    candidates = []

    for href, label_html in links:
        label = html_text_snippet(label_html, 280)

        if not label:
            continue

        low = label.lower()

        # Ignorer navigation / menus / liens non pertinents
        if any(x in low for x in [
            "login",
            "register",
            "membership",
            "annual meeting",
            "academy",
            "education",
            "events",
            "news",
            "about",
            "contact",
            "privacy",
            "cookies",
            "terms",
            "search",
            "read more",
            "view all",
        ]):
            continue

        # Garder uniquement les vraies guidelines / recommandations
        if not any(x in low for x in [
            "guidelines",
            "guideline",
            "recommendations",
            "recommendation",
            "consensus",
            "clinical practice",
            "position statement",
        ]):
            continue

        if len(label) < 20:
            continue

        full_url = urllib.parse.urljoin(url, href)

        year_match = re.search(r"(20\d{2})", label + " " + href)
        year = int(year_match.group(1)) if year_match else 0

        candidates.append({
            "title": label,
            "url": full_url,
            "year": year,
        })

    # Déduplication
    seen = set()
    unique = []

    for item in candidates:
        key = item["title"].lower().strip()
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    # Les plus récentes d'abord si l'année est détectée,
    # sinon l'ordre de la page est conservé.
    unique = sorted(
        unique,
        key=lambda x: x["year"],
        reverse=True
    )

    top3 = unique[:3]

    if not top3:
        return BiblioItem(
            source="EACTS",
            date="À vérifier",
            titre="EACTS Clinical Practice Guidelines",
            description="Aucune guideline individuelle détectée automatiquement. Ouvrir la page officielle.",
            lien=url,
            domaine="Recommandations",
        )

    titre = " | ".join([x["title"] for x in top3])
    lien = top3[0]["url"]

    description = "3 dernières recommandations EACTS : " + " ; ".join(
        [f'{x["title"]} ({x["url"]})' for x in top3]
    )

    best_year = top3[0]["year"]

    return BiblioItem(
        source="EACTS",
        date=str(best_year) if best_year else "Récent",
        titre=titre,
        description=description,
        lien=lien,
        domaine="Recommandations",
    )

def update_recommandations() -> None:
    print("Recherche intelligente des dernières recommandations officielles")

    items = [
        fetch_society_recommendations("SFAR", "https://sfar.org/recommandations/"),
        fetch_society_recommendations("SRLF", "https://www.srlf.org/recommandations-referentiels-epp"),
        fetch_spilf_recommendations(),
        fetch_society_recommendations("ESC", "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/"),
        fetch_society_recommendations("EACTS", "https://www.eacts.org/clinical-practice-guidelines/"),
    ]

    DATA_DIR.mkdir(parents=True, exist_ok=True)

    RECOMMANDATIONS_PATH.write_text(
        json.dumps([x.as_json() for x in items], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"{len(items)} lignes de recommandations écrites dans {RECOMMANDATIONS_PATH}")

def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Tous les lundis : publications + recommandations
    update_publications()
    update_recommandations()


if __name__ == "__main__":
    main()
