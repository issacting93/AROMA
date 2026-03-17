"""
AROMA Literature Search Pipeline
=================================
Multi-source PRISMA-stage search for the AROMA care-role taxonomy.

Sources: Semantic Scholar, OpenAlex, PubMed (Entrez)
Output:  De-duplicated CSV ready for Rayyan import + screening

Usage:
    pip install requests biopython rapidfuzz pandas
    python aroma_search_pipeline.py
"""

import csv
import hashlib
import json
import os
import re
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional

import pandas as pd
import requests
from rapidfuzz import fuzz

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

START_YEAR = 2015
END_YEAR = 2025
OUTPUT_DIR = Path("aroma_search_output")
CONTACT_EMAIL = "zac.chia@nyu.edu"  # OpenAlex polite pool / PubMed Entrez

# Rate-limit guards (seconds between requests)
RATE_LIMITS = {
    "semantic_scholar": 1.0,
    "openalex": 0.25,
    "pubmed": 0.34,  # NCBI asks for ≤3 req/s without API key
}

# ---------------------------------------------------------------------------
# QUERY DECOMPOSITION
# ---------------------------------------------------------------------------
# Full Boolean doesn't work on keyword-search APIs.  Instead we send focused
# sub-queries that each represent a meaningful facet of the search space,
# then merge results.  This gets better recall than one giant Boolean string.

SEMANTIC_SCHOLAR_QUERIES = [
    "chatbot mental health support role",
    "conversational agent emotional support strategy",
    "LLM mental health counseling empathy",
    "AI companion wellbeing interaction design",
    "virtual agent therapy conversational",
    "social robot emotional support relational",
    "dialogue system mental health coaching",
    "AI mental health peer support persona",
    "large language model psychological counseling",
    "chatbot emotional support reflective listening",
    "AI wellbeing intervention conversation",
    "conversational AI psychotherapy interaction",
    "LLM empathy mental health conversation",
    "chatbot care role therapeutic alliance",
    "AI mental health support modality",
]

OPENALEX_QUERIES = [
    "chatbot mental health support role strategy",
    "conversational agent emotional support empathy",
    "LLM mental health counseling interaction",
    "AI companion wellbeing relational design",
    "virtual agent therapy peer support",
    "social robot emotional support conversation",
    "dialogue system coaching mental health",
    "large language model psychological support persona",
    "AI mental health intervention conversational",
    "chatbot therapeutic alliance care role",
]

# PubMed supports real Boolean via Entrez — use the full query.
PUBMED_QUERY = (
    '("mental health"[tiab] OR "emotional support"[tiab] OR "wellbeing"[tiab] '
    'OR "well-being"[tiab] OR "psychological"[tiab]) '
    'AND ("chatbot"[tiab] OR "conversational agent"[tiab] OR "LLM"[tiab] '
    'OR "large language model"[tiab] OR "AI companion"[tiab] '
    'OR "virtual agent"[tiab] OR "social robot"[tiab] OR "dialogue system"[tiab]) '
    'AND ("support"[tiab] OR "counseling"[tiab] OR "counselling"[tiab] '
    'OR "therapy"[tiab] OR "peer support"[tiab] OR "coaching"[tiab] '
    'OR "care"[tiab] OR "intervention"[tiab]) '
    'AND ("role"[tiab] OR "persona"[tiab] OR "stance"[tiab] OR "behavior"[tiab] '
    'OR "strategy"[tiab] OR "interaction design"[tiab] OR "relational"[tiab] '
    'OR "empathy"[tiab] OR "conversation"[tiab])'
)

# ---------------------------------------------------------------------------
# DATA MODEL
# ---------------------------------------------------------------------------

@dataclass
class Paper:
    title: str
    abstract: Optional[str] = None
    year: Optional[int] = None
    doi: Optional[str] = None
    pmid: Optional[str] = None
    ss_id: Optional[str] = None          # Semantic Scholar corpus ID
    openalex_id: Optional[str] = None
    authors: Optional[str] = None
    venue: Optional[str] = None
    citation_count: Optional[int] = None
    source_apis: str = ""                 # comma-separated list of APIs that found it
    search_query: str = ""                # which sub-query surfaced it

    # For dedup
    _norm_title: str = field(default="", repr=False)

    def __post_init__(self):
        self._norm_title = self._normalize(self.title) if self.title else ""
        if self.doi:
            self.doi = self.doi.lower().replace("https://doi.org/", "").strip()

    @staticmethod
    def _normalize(text: str) -> str:
        """Lowercase, strip punctuation, collapse whitespace."""
        text = text.lower()
        text = re.sub(r"[^\w\s]", "", text)
        return re.sub(r"\s+", " ", text).strip()


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def reconstruct_abstract(inv_index: dict) -> Optional[str]:
    """OpenAlex stores abstracts as inverted indices — reconstruct to plain text."""
    if not inv_index:
        return None
    word_positions: dict[int, str] = {}
    for word, positions in inv_index.items():
        for pos in positions:
            word_positions[pos] = word
    return " ".join(word_positions[i] for i in sorted(word_positions))


def rate_limit(source: str):
    """Simple per-source rate limiter."""
    time.sleep(RATE_LIMITS.get(source, 0.5))


def log(msg: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


# ---------------------------------------------------------------------------
# SOURCE: SEMANTIC SCHOLAR
# ---------------------------------------------------------------------------

def fetch_semantic_scholar(queries: list[str], per_query_limit: int = 100) -> list[Paper]:
    """
    Semantic Scholar /paper/search endpoint.
    Sends each sub-query separately, collects results.
    """
    BASE = "https://api.semanticscholar.org/graph/v1/paper/search"
    FIELDS = "title,abstract,year,externalIds,citationCount,authors,venue"
    papers: list[Paper] = []

    for q in queries:
        log(f"  S2: '{q}'")
        offset = 0
        fetched = 0
        while fetched < per_query_limit:
            params = {
                "query": q,
                "limit": min(100, per_query_limit - fetched),
                "offset": offset,
                "year": f"{START_YEAR}-{END_YEAR}",
                "fields": FIELDS,
            }
            try:
                resp = requests.get(BASE, params=params, timeout=30)
                resp.raise_for_status()
                data = resp.json()
            except Exception as e:
                log(f"    ⚠ S2 error: {e}")
                break

            if "data" not in data or not data["data"]:
                break

            for p in data["data"]:
                ext = p.get("externalIds") or {}
                authors = ", ".join(
                    a.get("name", "") for a in (p.get("authors") or [])
                )
                papers.append(Paper(
                    title=p.get("title", ""),
                    abstract=p.get("abstract"),
                    year=p.get("year"),
                    doi=ext.get("DOI"),
                    pmid=ext.get("PubMed"),
                    ss_id=p.get("paperId"),
                    authors=authors,
                    venue=p.get("venue"),
                    citation_count=p.get("citationCount"),
                    source_apis="SemanticScholar",
                    search_query=q,
                ))
                fetched += 1

            offset += len(data["data"])
            total_avail = data.get("total", 0)
            if offset >= total_avail:
                break
            rate_limit("semantic_scholar")

        log(f"    → {fetched} results")
        rate_limit("semantic_scholar")

    log(f"  Semantic Scholar total (pre-dedup): {len(papers)}")
    return papers


# ---------------------------------------------------------------------------
# SOURCE: OPENALEX
# ---------------------------------------------------------------------------

def fetch_openalex(queries: list[str], per_query_limit: int = 100) -> list[Paper]:
    """
    OpenAlex /works endpoint with keyword search.
    """
    BASE = "https://api.openalex.org/works"
    papers: list[Paper] = []

    for q in queries:
        log(f"  OA: '{q}'")
        page = 1
        fetched = 0
        while fetched < per_query_limit:
            params = {
                "search": q,
                "filter": f"from_publication_date:{START_YEAR}-01-01,to_publication_date:{END_YEAR}-12-31",
                "per_page": min(100, per_query_limit - fetched),
                "page": page,
                "mailto": CONTACT_EMAIL,
            }
            try:
                resp = requests.get(BASE, params=params, timeout=30)
                resp.raise_for_status()
                data = resp.json()
            except Exception as e:
                log(f"    ⚠ OA error: {e}")
                break

            results = data.get("results", [])
            if not results:
                break

            for w in results:
                # Reconstruct abstract from inverted index
                abstract = reconstruct_abstract(w.get("abstract_inverted_index"))
                # Get primary DOI
                doi_raw = w.get("doi")
                # Authors
                authors = ", ".join(
                    a.get("author", {}).get("display_name", "")
                    for a in (w.get("authorships") or [])
                )
                # Venue (primary source)
                venue = ""
                primary_loc = w.get("primary_location") or {}
                source_info = primary_loc.get("source") or {}
                venue = source_info.get("display_name", "")

                papers.append(Paper(
                    title=w.get("display_name", ""),
                    abstract=abstract,
                    year=w.get("publication_year"),
                    doi=doi_raw,
                    openalex_id=w.get("id"),
                    authors=authors,
                    venue=venue,
                    citation_count=w.get("cited_by_count"),
                    source_apis="OpenAlex",
                    search_query=q,
                ))
                fetched += 1

            page += 1
            if page > 5:  # Safety cap
                break
            rate_limit("openalex")

        log(f"    → {fetched} results")
        rate_limit("openalex")

    log(f"  OpenAlex total (pre-dedup): {len(papers)}")
    return papers


# ---------------------------------------------------------------------------
# SOURCE: PUBMED (via Entrez)
# ---------------------------------------------------------------------------

def fetch_pubmed(query: str, max_results: int = 500) -> list[Paper]:
    """
    PubMed via NCBI Entrez — supports real Boolean.
    Uses esearch → efetch pipeline.
    """
    from Bio import Entrez
    Entrez.email = CONTACT_EMAIL

    papers: list[Paper] = []

    # Step 1: search for PMIDs
    log(f"  PubMed: searching...")
    try:
        handle = Entrez.esearch(
            db="pubmed",
            term=query,
            retmax=max_results,
            mindate=f"{START_YEAR}/01/01",
            maxdate=f"{END_YEAR}/12/31",
            datetype="pdat",
        )
        search_results = Entrez.read(handle)
        handle.close()
    except Exception as e:
        log(f"    ⚠ PubMed search error: {e}")
        return papers

    id_list = search_results.get("IdList", [])
    log(f"    Found {len(id_list)} PMIDs")

    if not id_list:
        return papers

    # Step 2: fetch metadata in batches of 100
    for batch_start in range(0, len(id_list), 100):
        batch = id_list[batch_start : batch_start + 100]
        try:
            handle = Entrez.efetch(
                db="pubmed",
                id=",".join(batch),
                rettype="xml",
                retmode="xml",
            )
            records = Entrez.read(handle)
            handle.close()
        except Exception as e:
            log(f"    ⚠ PubMed fetch error (batch {batch_start}): {e}")
            continue

        for article_wrapper in records.get("PubmedArticle", []):
            medline = article_wrapper.get("MedlineCitation", {})
            article = medline.get("Article", {})
            pmid = str(medline.get("PMID", ""))

            title = str(article.get("ArticleTitle", ""))

            # Abstract
            abstract_parts = article.get("Abstract", {}).get("AbstractText", [])
            abstract = " ".join(str(part) for part in abstract_parts) if abstract_parts else None

            # Year
            pub_date = article.get("Journal", {}).get("JournalIssue", {}).get("PubDate", {})
            year = pub_date.get("Year")
            if year:
                try:
                    year = int(year)
                except ValueError:
                    year = None

            # DOI
            doi = None
            for eid in article.get("ELocationID", []):
                if str(eid.attributes.get("EIdType", "")) == "doi":
                    doi = str(eid)
                    break

            # Authors
            author_list = article.get("AuthorList", [])
            authors = ", ".join(
                f"{a.get('LastName', '')} {a.get('Initials', '')}".strip()
                for a in author_list
                if a.get("LastName")
            )

            # Venue
            venue = str(article.get("Journal", {}).get("Title", ""))

            papers.append(Paper(
                title=title,
                abstract=abstract,
                year=year,
                doi=doi,
                pmid=pmid,
                authors=authors,
                venue=venue,
                source_apis="PubMed",
                search_query="pubmed_boolean",
            ))

        rate_limit("pubmed")

    log(f"  PubMed total: {len(papers)}")
    return papers


# ---------------------------------------------------------------------------
# DEDUPLICATION
# ---------------------------------------------------------------------------

def deduplicate(papers: list[Paper], title_threshold: float = 90.0) -> list[Paper]:
    """
    Three-pass dedup:
      1. Exact DOI match
      2. Exact PMID match
      3. Fuzzy title match (rapidfuzz token_sort_ratio ≥ threshold)

    When merging, we keep the record with the most metadata and
    combine source_apis so we know which APIs found each paper.
    """
    log("Deduplicating...")

    # Index by DOI
    doi_map: dict[str, int] = {}       # doi → index in unique list
    pmid_map: dict[str, int] = {}      # pmid → index
    unique: list[Paper] = []

    def merge_into(existing: Paper, new: Paper):
        """Merge metadata from `new` into `existing`."""
        if new.source_apis and new.source_apis not in existing.source_apis:
            existing.source_apis += f", {new.source_apis}"
        if not existing.abstract and new.abstract:
            existing.abstract = new.abstract
        if not existing.doi and new.doi:
            existing.doi = new.doi
        if not existing.pmid and new.pmid:
            existing.pmid = new.pmid
        if not existing.ss_id and new.ss_id:
            existing.ss_id = new.ss_id
        if not existing.openalex_id and new.openalex_id:
            existing.openalex_id = new.openalex_id
        if not existing.authors and new.authors:
            existing.authors = new.authors
        if not existing.venue and new.venue:
            existing.venue = new.venue
        if (new.citation_count or 0) > (existing.citation_count or 0):
            existing.citation_count = new.citation_count

    for paper in papers:
        if not paper.title:
            continue

        # Pass 1: DOI
        if paper.doi and paper.doi in doi_map:
            merge_into(unique[doi_map[paper.doi]], paper)
            continue

        # Pass 2: PMID
        if paper.pmid and paper.pmid in pmid_map:
            merge_into(unique[pmid_map[paper.pmid]], paper)
            continue

        # Pass 3: Fuzzy title
        matched = False
        for idx, existing in enumerate(unique):
            score = fuzz.token_sort_ratio(paper._norm_title, existing._norm_title)
            if score >= title_threshold:
                merge_into(existing, paper)
                matched = True
                break

        if not matched:
            idx = len(unique)
            unique.append(paper)
            if paper.doi:
                doi_map[paper.doi] = idx
            if paper.pmid:
                pmid_map[paper.pmid] = idx

    log(f"  {len(papers)} → {len(unique)} after dedup")
    return unique


# ---------------------------------------------------------------------------
# RELEVANCE SCORING (lightweight pre-screen)
# ---------------------------------------------------------------------------

# Terms that signal AROMA-relevant papers (weighted)
RELEVANCE_TERMS = {
    # High signal — role/stance language
    "care role": 3, "therapeutic role": 3, "conversational role": 3,
    "relational agent": 3, "empathic agent": 3, "persona": 2,
    "stance": 2, "posture": 2,
    # Moderate — strategy language
    "reflective listening": 2, "motivational interviewing": 2,
    "socratic questioning": 2, "psychoeducation": 2,
    "emotional support": 2, "social support": 2,
    # Moderate — system names we definitely want
    "woebot": 2, "wysa": 2, "tess": 2, "eliza": 1,
    "replika": 2, "hume": 2,
    # Baseline — domain
    "mental health": 1, "wellbeing": 1, "counseling": 1,
    "chatbot": 1, "conversational agent": 1, "llm": 1,
    "empathy": 1, "therapeutic alliance": 2,
    "authority": 2, "agency": 1, "interaction design": 2,
}


def score_relevance(paper: Paper) -> int:
    """Quick keyword relevance score for sorting/flagging."""
    text = f"{paper.title or ''} {paper.abstract or ''}".lower()
    score = 0
    for term, weight in RELEVANCE_TERMS.items():
        if term in text:
            score += weight
    return score


# ---------------------------------------------------------------------------
# EXPORT
# ---------------------------------------------------------------------------

EXPORT_COLUMNS = [
    "title", "authors", "year", "venue", "doi", "pmid", "ss_id",
    "openalex_id", "citation_count", "abstract", "source_apis",
    "relevance_score",
    # Screening columns (blank — for Rayyan or manual use)
    "screen_decision", "screen_tags", "notes",
]


def export_csv(papers: list[Paper], path: Path):
    """Export to CSV with screening-ready columns."""
    rows = []
    for p in papers:
        d = asdict(p)
        d.pop("_norm_title", None)
        d.pop("search_query", None)
        d["relevance_score"] = score_relevance(p)
        d["screen_decision"] = ""
        d["screen_tags"] = ""
        d["notes"] = ""
        rows.append(d)

    df = pd.DataFrame(rows, columns=EXPORT_COLUMNS)
    df = df.sort_values(["relevance_score", "citation_count"], ascending=[False, False])
    df.to_csv(path, index=False, quoting=csv.QUOTE_ALL)
    log(f"Exported {len(df)} papers → {path}")
    return df


def export_summary(df: pd.DataFrame, path: Path):
    """Quick summary stats for the search run."""
    lines = [
        "AROMA Search Pipeline — Run Summary",
        f"Date: {datetime.now().isoformat()}",
        f"Date range: {START_YEAR}–{END_YEAR}",
        "",
        f"Total unique papers: {len(df)}",
        "",
        "Papers by source API:",
    ]
    # Count how many papers each API contributed to
    for src in ["SemanticScholar", "OpenAlex", "PubMed"]:
        count = df["source_apis"].str.contains(src, na=False).sum()
        lines.append(f"  {src}: {count}")

    multi = df["source_apis"].str.contains(",", na=False).sum()
    lines.append(f"  Found by ≥2 APIs: {multi}")

    lines += [
        "",
        "Year distribution:",
    ]
    year_counts = df["year"].value_counts().sort_index()
    for yr, cnt in year_counts.items():
        lines.append(f"  {int(yr) if pd.notna(yr) else '?'}: {cnt}")

    lines += [
        "",
        f"Relevance score: mean={df['relevance_score'].mean():.1f}, "
        f"median={df['relevance_score'].median():.0f}, "
        f"max={df['relevance_score'].max()}",
        f"Papers with relevance ≥5: {(df['relevance_score'] >= 5).sum()}",
        f"Papers with relevance ≥10: {(df['relevance_score'] >= 10).sum()}",
        "",
        "Top 20 by relevance × citations:",
    ]
    top = df.head(20)
    for _, row in top.iterrows():
        lines.append(
            f"  [{row['relevance_score']}] ({row['citation_count'] or 0} cites) "
            f"{row['title'][:90]}"
        )

    text = "\n".join(lines)
    path.write_text(text)
    log(f"Summary → {path}")
    print("\n" + text)


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    log("=" * 60)
    log("AROMA Literature Search Pipeline")
    log("=" * 60)

    # --- Fetch from all sources ---
    all_papers: list[Paper] = []

    log("\n[1/3] Semantic Scholar")
    all_papers.extend(fetch_semantic_scholar(SEMANTIC_SCHOLAR_QUERIES, per_query_limit=100))

    log("\n[2/3] OpenAlex")
    all_papers.extend(fetch_openalex(OPENALEX_QUERIES, per_query_limit=100))

    log("\n[3/3] PubMed")
    try:
        all_papers.extend(fetch_pubmed(PUBMED_QUERY, max_results=500))
    except ImportError:
        log("  ⚠ Biopython not installed — skipping PubMed. pip install biopython")

    log(f"\nTotal raw papers: {len(all_papers)}")

    # --- Deduplicate ---
    unique = deduplicate(all_papers, title_threshold=90.0)

    # --- Export ---
    csv_path = OUTPUT_DIR / "aroma_corpus_raw.csv"
    df = export_csv(unique, csv_path)

    summary_path = OUTPUT_DIR / "search_summary.txt"
    export_summary(df, summary_path)

    log("\nDone. Next steps:")
    log("  1. Import aroma_corpus_raw.csv into Rayyan for screening")
    log("  2. Use relevance_score column to prioritise title/abstract review")
    log("  3. After screening, run snowball search on top-cited included papers")


if __name__ == "__main__":
    main()
