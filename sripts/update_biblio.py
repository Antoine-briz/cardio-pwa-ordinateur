#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mise à jour automatique de la bibliographie SARIC.

Génère :
  - data/publications.json : tous les lundis, top 10 des articles publiés la semaine écoulée,
    dans les domaines ciblés, triés par nombre total de citations Semantic Scholar.
  - data/recommandations.json : uniquement le 1er lundi du mois,
    recommandations/guidelines récentes dans les domaines ciblés.

À utiliser avec GitHub Actions.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PUBLICATIONS_PATH = DATA_DIR / "publications.json"
RECOMMANDATIONS_PATH = DATA_DIR / "recommandations.json"

NCBI_EMAIL = os.getenv("NCBI_EMAIL", "saric@example.com")
NCBI_API_KEY = os.getenv("NCBI_API_KEY", "")
SEMANTIC_SCHOLAR_API_KEY = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")

USER_AGENT = f"SARIC-Biblio-Updater/1.0 ({NCBI_EMAIL})"

DOMAINS = {
    "Réanimation": [
        "critical care",
        "intensive care",
        "ICU",
        "sepsis",
        "shock",
        "ARDS",
        "mechanical ventilation",
    ],
    "Anesthésie": [
        "anesthesia",
        "anaesthesia",
        "perioperative",
        "cardiac anesthesia",
        "cardiothoracic anesthesia",
    ],
    "Infectiologie": [
        "infectious diseases",
        "antimicrobial",
        "antibiotic",
        "bacteremia",
        "endocarditis",
        "sepsis",
    ],
    "Cardiologie": [
        "cardiology",
        "heart failure",
        "acute coronary syndrome",
        "valvular heart disease",
        "arrhythmia",
        "interventional cardiology",
    ],
    "Chirurgie cardiaque": [
        "cardiac surgery",
        "cardiothoracic surgery",
        "valve surgery",
        "CABG",
        "aortic surgery",
        "ECMO",
    ],
}

RECOMMENDATION_SOURCES = [
    {
        "source": "SFAR",
        "site": "sfar.org",
        "terms": ["recommandations", "RFE", "anesthésie", "réanimation", "expert"],
    },
    {
        "source": "SRLF",
        "site": "srlf.org",
        "terms": ["recommandations", "réanimation", "expert", "guidelines"],
    },
    {
        "source": "SPILF",
        "site": "infectiologie.com",
        "terms": ["recommandations", "infectiologie", "antibiothérapie", "guidelines"],
    },
    {
        "source": "ESC",
        "site": "escardio.org",
        "terms": ["guidelines", "cardiology", "ESC"],
    },
    {
        "source": "EACTS",
        "site": "eacts.org",
        "terms": ["guidelines", "cardiac surgery", "recommendations"],
    },
]


@dataclass
class BiblioItem:
    source: str
    date: str
    titre: str
    description: str
    lien: str
    citation_count: int = 0

    def as_json(self) -> Dict[str, str]:
        return {
            "source": self.source,
            "date": self.date,
            "titre": self.titre,
            "description": self.description,
            "lien": self.lien,
        }


def http_get_json(url: str, headers: Optional[Dict[str, str]] = None, retries: int = 3) -> Any:
    req_headers = {"User-Agent": USER_AGENT}
    if headers:
        req_headers.update(headers)

    last_err: Optional[Exception] = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as exc:
            last_err = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"GET JSON failed: {url}") from last_err


def http_get_text(url: str, headers: Optional[Dict[str, str]] = None, retries: int = 3) -> str:
    req_headers = {"User-Agent": USER_AGENT}
    if headers:
        req_headers.update(headers)

    last_err: Optional[Exception] = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as exc:
            last_err = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"GET text failed: {url}") from last_err


def previous_week_range(today: Optional[date] = None) -> tuple[date, date]:
    """Retourne lundi précédent → dimanche précédent."""
    today = today or date.today()
    this_monday = today - timedelta(days=today.weekday())
    last_monday = this_monday - timedelta(days=7)
    last_sunday = this_monday - timedelta(days=1)
    return last_monday, last_sunday


def is_first_monday(today: Optional[date] = None) -> bool:
    today = today or date.today()
    return today.weekday() == 0 and 1 <= today.day <= 7


def pubmed_search(query: str, start: date, end: date, retmax: int = 80) -> List[str]:
    term = f'({query}) AND ("{start.isoformat()}"[Date - Publication] : "{end.isoformat()}"[Date - Publication])'
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
    data = http_get_json(url)
    return data.get("esearchresult", {}).get("idlist", []) or []


def pubmed_summary(pmids: Iterable[str]) -> List[Dict[str, Any]]:
    ids = list(dict.fromkeys(pmids))
    if not ids:
        return []

    out: List[Dict[str, Any]] = []
    for i in range(0, len(ids), 100):
        chunk = ids[i:i + 100]
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
        data = http_get_json(url)
        result = data.get("result", {})
        for pmid in chunk:
            if pmid in result:
                out.append(result[pmid])
        time.sleep(0.34 if not NCBI_API_KEY else 0.12)
    return out


def semantic_by_pmid(pmid: str) -> Optional[Dict[str, Any]]:
    fields = "title,abstract,year,publicationDate,citationCount,venue,url,externalIds"
    url = f"https://api.semanticscholar.org/graph/v1/paper/PMID:{pmid}?fields={urllib.parse.quote(fields)}"
    headers = {}
    if SEMANTIC_SCHOLAR_API_KEY:
        headers["x-api-key"] = SEMANTIC_SCHOLAR_API_KEY

    try:
        return http_get_json(url, headers=headers, retries=2)
    except Exception:
        return None


def clean_title(title: str) -> str:
    return re.sub(r"\s+", " ", (title or "").strip())


def one_sentence(text: str, fallback: str) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    if not text:
        return fallback

    # Coupe à la première phrase raisonnable.
    parts = re.split(r"(?<=[.!?])\s+", text)
    sent = parts[0].strip() if parts else text
    if len(sent) > 260:
        sent = sent[:257].rsplit(" ", 1)[0] + "..."
    return sent


def article_url(pmid: str, sem: Optional[Dict[str, Any]]) -> str:
    if sem and sem.get("url"):
        return sem["url"]
    return f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"


def pubdate_from_summary(summary: Dict[str, Any]) -> str:
    raw = summary.get("pubdate") or summary.get("epubdate") or ""
    # Exemples PubMed : "2026 Apr 21", "2026", "2026 Apr"
    if not raw:
        return ""
    return raw


def update_publications() -> None:
    start, end = previous_week_range()

    pmids: List[str] = []
    for domain, terms in DOMAINS.items():
        domain_query = " OR ".join(f'"{t}"' for t in terms)
        ids = pubmed_search(domain_query, start, end, retmax=80)
        pmids.extend(ids)
        time.sleep(0.34 if not NCBI_API_KEY else 0.12)

    pmids = list(dict.fromkeys(pmids))
    summaries = {str(s.get("uid")): s for s in pubmed_summary(pmids)}

    items: List[BiblioItem] = []
    for pmid in pmids:
        summary = summaries.get(str(pmid), {})
        title = clean_title(summary.get("title", ""))
        if not title:
            continue

        sem = semantic_by_pmid(pmid)
        citation_count = int((sem or {}).get("citationCount") or 0)
        abstract = (sem or {}).get("abstract") or ""
        venue = (sem or {}).get("venue") or summary.get("source") or "PubMed"

        items.append(BiblioItem(
            source=venue,
            date=(sem or {}).get("publicationDate") or pubdate_from_summary(summary),
            titre=title,
            description=one_sentence(
                abstract,
                f"Article publié la semaine écoulée dans un domaine SARIC, indexé dans PubMed."
            ),
            lien=article_url(pmid, sem),
            citation_count=citation_count,
        ))

        # Limite pour respecter les quotas Semantic Scholar sans clé.
        time.sleep(1.1 if not SEMANTIC_SCHOLAR_API_KEY else 0.12)

    # Trie par citations totales actuelles, garde 10.
    top10 = sorted(items, key=lambda x: x.citation_count, reverse=True)[:10]

    # Si Semantic Scholar ne répond pas assez, on garde au moins les plus récents PubMed.
    if not top10:
        for pmid, summary in list(summaries.items())[:10]:
            top10.append(BiblioItem(
                source=summary.get("source") or "PubMed",
                date=pubdate_from_summary(summary),
                titre=clean_title(summary.get("title", "")),
                description="Article publié la semaine écoulée dans un domaine SARIC, indexé dans PubMed.",
                lien=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                citation_count=0,
            ))

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PUBLICATIONS_PATH.write_text(
        json.dumps([x.as_json() for x in top10], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def search_crossref_guidelines(start: date, end: date) -> List[BiblioItem]:
    """Complément via Crossref pour recommandations/guidelines récentes."""
    query_terms = [
        '"guideline" cardiology',
        '"recommendations" cardiac surgery',
        '"expert consensus" anaesthesia',
        '"guidelines" intensive care',
        '"guidelines" infectious diseases',
    ]

    found: List[BiblioItem] = []
    for q in query_terms:
        params = {
            "query.bibliographic": q,
            "filter": f"from-pub-date:{start.isoformat()},until-pub-date:{end.isoformat()}",
            "rows": "5",
            "sort": "published",
            "order": "desc",
            "mailto": NCBI_EMAIL,
        }
        url = "https://api.crossref.org/works?" + urllib.parse.urlencode(params)
        try:
            data = http_get_json(url)
            for it in data.get("message", {}).get("items", []):
                title = clean_title((it.get("title") or [""])[0])
                if not title:
                    continue
                pub = it.get("published-print") or it.get("published-online") or {}
                parts = pub.get("date-parts", [[]])[0]
                pub_date = "-".join(str(x).zfill(2) for x in parts) if parts else ""
                link = it.get("URL") or ""
                found.append(BiblioItem(
                    source=(it.get("container-title") or ["Crossref"])[0],
                    date=pub_date,
                    titre=title,
                    description="Recommandation, guideline ou consensus récent identifié automatiquement.",
                    lien=link,
                ))
        except Exception:
            pass
        time.sleep(1)
    return found


def pubmed_guidelines(start: date, end: date) -> List[BiblioItem]:
    terms = [
        '"Practice Guideline"[Publication Type]',
        'guideline',
        'recommendations',
        '"expert consensus"',
        '"position statement"',
    ]
    domain_terms = []
    for values in DOMAINS.values():
        domain_terms.extend(values)
    query = f'({" OR ".join(terms)}) AND ({" OR ".join(f"{t}" for t in domain_terms)})'

    pmids = pubmed_search(query, start, end, retmax=60)
    summaries = pubmed_summary(pmids)

    out: List[BiblioItem] = []
    for s in summaries:
        pmid = str(s.get("uid", ""))
        title = clean_title(s.get("title", ""))
        if not pmid or not title:
            continue
        out.append(BiblioItem(
            source=s.get("source") or "PubMed",
            date=pubdate_from_summary(s),
            titre=title,
            description="Recommandation, guideline ou consensus récent dans un domaine SARIC.",
            lien=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
        ))
    return out


def society_placeholder_links() -> List[BiblioItem]:
    """Liens permanents vers les pages de recommandations des sociétés savantes."""
    return [
        BiblioItem(
            source="SFAR",
            date="Mise à jour mensuelle",
            titre="Page recommandations SFAR",
            description="Page source à surveiller pour les recommandations formalisées d’experts en anesthésie-réanimation.",
            lien="https://sfar.org/recommandations/",
        ),
        BiblioItem(
            source="SRLF",
            date="Mise à jour mensuelle",
            titre="Page recommandations SRLF",
            description="Page source à surveiller pour les recommandations en médecine intensive-réanimation.",
            lien="https://www.srlf.org/recommandations/",
        ),
        BiblioItem(
            source="SPILF",
            date="Mise à jour mensuelle",
            titre="Page recommandations SPILF",
            description="Page source à surveiller pour les recommandations en infectiologie et antibiothérapie.",
            lien="https://www.infectiologie.com/fr/recommandations.html",
        ),
        BiblioItem(
            source="ESC",
            date="Mise à jour mensuelle",
            titre="ESC Clinical Practice Guidelines",
            description="Page source des recommandations européennes de cardiologie.",
            lien="https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines",
        ),
        BiblioItem(
            source="EACTS",
            date="Mise à jour mensuelle",
            titre="EACTS Guidelines",
            description="Page source à surveiller pour les recommandations en chirurgie cardio-thoracique.",
            lien="https://www.eacts.org/resources/guidelines/",
        ),
    ]


def update_recommandations() -> None:
    today = date.today()
    # Recherche sur les 6 derniers mois pour éviter une page vide.
    start = today - timedelta(days=183)
    end = today

    items = pubmed_guidelines(start, end)
    items.extend(search_crossref_guidelines(start, end))

    # Déduplique par titre.
    seen = set()
    unique: List[BiblioItem] = []
    for item in items:
        key = clean_title(item.titre).lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(item)

    # Ajoute toujours les pages sources des sociétés savantes à la fin.
    unique = unique[:10] + society_placeholder_links()

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    RECOMMANDATIONS_PATH.write_text(
        json.dumps([x.as_json() for x in unique], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Tous les lundis : publications.
    update_publications()

    # Premier lundi du mois : recommandations.
    if is_first_monday():
        update_recommandations()
    else:
        print("Pas le premier lundi du mois : recommandations.json conservé.")


if __name__ == "__main__":
    main()
