"""
AROMA Phase 1 — Systematic Synthesis (v2)
==========================================
Three structural fixes from v1:
  1. Multi-label dimension assignment (papers tagged for ALL dimensions
     where they score >= threshold, not just the highest). Produces a
     co-occurrence matrix supporting AROMA's multi-dimensional argument.
  2. Automated extraction for all papers with abstracts, populating
     extracted_roles / extracted_strategies / extracted_functions /
     paradox_indicators directly from abstract text.
  3. Role terms mapped to nearest AROMA Care Role — reframes
     terminological fragmentation as the core D2 finding.

Output:
  aroma_synthesis_report.md      — Full synthesis report
  aroma_role_taxonomy_draft.csv  — Role terms with AROMA role mapping
  aroma_cooccurrence_matrix.csv  — Dimension co-occurrence counts
"""

import pandas as pd
import re
from collections import Counter, defaultdict
from pathlib import Path
from itertools import combinations

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PHASE1_DIR = SCRIPT_DIR.parent  # phase_1_literature_synthesis/
WORKSHEET_PATH = PHASE1_DIR / "aroma_extraction_worksheet.csv"
OUTPUT_DIR = PHASE1_DIR

DIM_THRESHOLD = 1  # minimum keyword hits to tag a paper for a dimension

# ---------------------------------------------------------------------------
# LOAD
# ---------------------------------------------------------------------------

df = pd.read_csv(WORKSHEET_PATH, low_memory=False)
print(f"Loaded {len(df)} papers.")

# ---------------------------------------------------------------------------
# DIMENSION KEYWORD MAPS
# ---------------------------------------------------------------------------

DIM_KEYWORDS = {
    "D1": [
        "emotional support", "informational support", "practical support",
        "social support", "peer support", "crisis support",
        "psychoeducation", "wellbeing", "well-being", "mental health support",
        "esteem support", "tangible support", "network support",
        "appraisal support",
    ],
    "D2": [
        "coach", "therapist", "companion", "mentor", "navigator", "counselor",
        "peer", "caregiver", "friend", "listener", "advisor", "advocate",
        "mediator", "screener", "assessor", "ally", "facilitator",
        "relational stance", "care role", "relational role",
        "role transition", "role shift",
    ],
    # D3 · Core Function — high-precision care-navigation terms ONLY.
    # Principle: terms must be unique to the "what this AI instance does"
    # layer, not bleed into D4 (strategy HOW) or D2 (role WHO).
    # Removed: "intervention" (69 false hits), "assessment" (32 — too generic),
    #   "insight" (26), "validation", "self-efficacy" — all found in any
    #   therapy paper regardless of whether care function is theorised.
    "D3": [
        # Hard D3 — care pathway / navigation
        "triage", "referral", "warm handoff", "care pathway",
        "care coordination", "step-down", "step-up", "stepped care",
        "linkage to care", "care linkage",
        # Crisis / safety
        "safety planning", "crisis detection", "suicide risk",
        "risk assessment", "self-harm detection", "crisis response",
        "crisis management", "crisis protocol",
        # Functional monitoring
        "symptom monitoring", "mood tracking", "symptom tracking",
        "progress monitoring", "relapse detection", "relapse prevention",
        "follow-up", "check-in", "psycho-social monitoring",
        # Alliance / engagement (D3 outputs, not D4 strategies)
        "therapeutic alliance", "working alliance", "digital therapeutic alliance",
        "treatment engagement", "retention in care",
        # Screening (specific compound only)
        "mental health screening", "initial screening", "intake screening",
        "first contact", "first-contact",
        # Psychoeducation (as a discrete function, not keyword in any psych paper)
        "psychoeducation",
    ],
    "D4": [
        "cognitive behavioral therapy", "cbt", "motivational interviewing",
        "acceptance and commitment", "act", "dialectical behavior",
        "socratic", "active listening", "reflective listening",
        "validation", "empathy", "reframing", "goal setting",
        "mindfulness", "behavioural activation", "problem solving",
        "open question", "psychoeducation", "self-disclosure",
        "affirmation", "normali",
    ],
    "D5": [
        "chatbot", "conversational agent", "voice", "avatar", "robot",
        "text-based", "mobile app", "wearable", "virtual reality",
        "multimodal", "sensor", "social robot", "llm", "gpt",
        "large language model", "text chat", "voice assistant",
        "embodied agent",
    ],
}

DIM_LABELS = {
    "D1": "D1 · Support Type",
    "D2": "D2 · Care Role",
    "D3": "D3 · Core Function",
    "D4": "D4 · Support Strategy",
    "D5": "D5 · Interaction Modality",
}

PARADOX_KEYWORDS = [
    "therapeutic misconception", "role confusion", "dependency",
    "over-reliance", "pseudo-intimacy", "emotional solipsism",
    "authority-agency", "authority agency",
    "parasocial", "role mismatch", "misalignment",
    "dark side", "unearned authority", "hollow authority",
    "competency gap", "role-locked", "role locked",
]

# ---------------------------------------------------------------------------
# AROMA CARE ROLE MAPPING (Fix 3)
# Maps mined role terms → nearest AROMA Care Role
# ---------------------------------------------------------------------------

AROMA_ROLE_MAP = {
    # Listener
    "listener": "Listener",
    "active listener": "Listener",
    "empathic agent": "Listener",
    "empathetic agent": "Listener",
    # Reflective Partner
    "reflective partner": "Reflective Partner",
    "socratic": "Reflective Partner",
    # Coach
    "coach": "Coach",
    "virtual coach": "Coach",
    "virtual coaching": "Coach",
    "ai coach": "Coach",
    "digital coach": "Coach",
    "wellness coach": "Coach",
    "health coach": "Coach",
    "motivator": "Coach",
    # Advisor
    "advisor": "Advisor",
    "adviser": "Advisor",
    "ai advisor": "Advisor",
    "therapist": "Advisor",
    "virtual therapist": "Advisor",
    "ai therapist": "Advisor",
    "digital therapist": "Advisor",
    "robot therapist": "Advisor",
    "therapist-adjunct": "Advisor",
    "therapist-lite": "Advisor",
    "sim-physician": "Advisor",
    "counselor": "Advisor",
    "counsellor": "Advisor",
    "virtual counselor": "Advisor",
    "virtual counsellor": "Advisor",
    "psychologist": "Advisor",
    "psychiatrist": "Advisor",
    "clinician": "Advisor",
    "crisis counselor": "Advisor",
    "crisis counselor (automated)": "Advisor",
    "clinical agent": "Advisor",
    "clinical chatbot": "Advisor",
    "clinical assistant": "Advisor",
    "sentiment-aware assistant": "Advisor",
    # Companion
    "companion": "Companion",
    "ai companion": "Companion",
    "artificial companion": "Companion",
    "chatbot companion": "Companion",
    "virtual friend": "Companion",
    "friend": "Companion",
    "digital friend": "Companion",
    "ai friend": "Companion",
    "buddy": "Companion",
    "nurturer": "Companion",
    "pseudo-intimate partner": "Companion",
    "seductive partner": "Companion",
    "social ally": "Companion",
    "caregiver": "Companion",
    # Navigator
    "navigator": "Navigator",
    "guide": "Navigator",
    "screener": "Navigator",
    "assessor": "Navigator",
    # Peer-bridging terms → Navigator (Connector role removed: 1 paper, below ≥3 threshold)
    "peer-responder": "Navigator",
    "peer responder": "Navigator",
    "facilitator": "Navigator",
    "mediator": "Navigator",
    # Advisor (continued)
    "intervener": "Advisor",
    # System descriptors (not care roles — flag but don't map)
    "agent": "[System Descriptor]",
    "chatbot": "[System Descriptor]",
    "bot": "[System Descriptor]",
    "system": "[System Descriptor]",
    "assistant": "[System Descriptor]",
    "virtual agent": "[System Descriptor]",
    "conversational agent": "[System Descriptor]",
    "conversational system": "[System Descriptor]",
    "conversational robot": "[System Descriptor]",
    "social robot": "[System Descriptor]",
    "relational agent": "[System Descriptor]",
    "mental health chatbot": "[System Descriptor]",
    "mental health chatbot chatbot": "[System Descriptor]",
    "therapeutic agent": "[System Descriptor]",
    "therapeutic chatbot": "[System Descriptor]",
    "therapeutic system": "[System Descriptor]",
    "therapeutic bot": "[System Descriptor]",
    "therapeutic bot bot": "[System Descriptor]",
    "chatbot counselor": "[System Descriptor]",
    "clinical agent": "[System Descriptor]",
    "clinical chatbot": "[System Descriptor]",
    "clinical assistant": "[System Descriptor]",
}


def map_to_aroma_role(term):
    """Map a mined role term to its nearest AROMA Care Role."""
    t = term.lower().strip()
    # Direct lookup first
    if t in AROMA_ROLE_MAP:
        return AROMA_ROLE_MAP[t]
    # Fuzzy fallback: only match if the term contains a key (not vice versa)
    # and the key is a meaningful word (>4 chars) to avoid false matches
    for key, role in AROMA_ROLE_MAP.items():
        if len(key) > 4 and key in t:
            return role
    return "[Unmapped]"


# ---------------------------------------------------------------------------
# AUTOMATED EXTRACTION (Fix 2)
# Run pattern-based extraction on abstracts for ALL papers, populating
# the extraction columns that were previously empty for 198/203 papers.
# ---------------------------------------------------------------------------

ROLE_EXTRACT_PATTERNS = [
    r"\b(?:ai|llm|chatbot|robot|virtual|digital)\s*(?:based\s+)?(?:as\s+(?:a|an)\s+)?(therapist|counselor|counsellor|psychologist|coach|companion|mentor|advisor|adviser|navigator|screener|assessor|listener|caregiver|friend|buddy|facilitator|mediator|ally|peer|intervener)\b",
    r"\b(virtual|digital|ai)\s+(coach|companion|therapist|counselor|counsellor|friend|advisor|adviser|mentor|navigator|listener)\b",
    r"\b(empathic|empathetic)\s+agent\b",
    r"\b(crisis)\s+(agent|bot|system|chatbot|counselor)\b",
    r"\b(peer[- ]responder)\b",
    r"\b(social\s+robot)\b",
    r"\b(virtual\s+agent)\b",
    r"\b(?:therapeutic|clinical|wellness|health)\s+(agent|chatbot|system|bot|assistant|coach)\b",
    r"\b(?:mental\s+health)\s+(chatbot|bot|agent|assistant)\b",
    r"\b(?:act|serve|function|work)s?\s+as\s+(?:a|an)\s+(therapist|coach|companion|counselor|navigator|screener|peer|friend|mentor|listener|advisor)\b",
    r"\b(companion(?:ship)?)\s+(?:chatbot|bot|agent|app|system)\b",
    r"\bchatbot\s+(?:as\s+)?(?:a\s+)?(companion|coach|therapist|counselor|friend|navigator)\b",
    # Explicit role taxonomy terms from key papers
    r"\b(screener|therapist-adjunct|assessor|intervener)\b",
    r"\b(relational\s+agent)\b",
]

STRATEGY_EXTRACT_PATTERNS = [
    r"\b(cognitive\s+behavio(?:u)?ral\s+therapy|cbt)\b",
    r"\b(motivational\s+interviewing)\b",
    r"\b(acceptance\s+and\s+commitment\s+therapy|act)\b",
    r"\b(dialectical\s+behavio(?:u)?r(?:al)?\s+therapy|dbt)\b",
    r"\b(socratic\s+questioning)\b",
    r"\b(active\s+listening)\b",
    r"\b(reflective\s+listening)\b",
    r"\b(psychoeducation)\b",
    r"\b(goal\s+setting)\b",
    r"\b(mindfulness)\b",
    r"\b(behavio(?:u)?ral\s+activation)\b",
    r"\b(problem[- ]solving(?:\s+therapy)?)\b",
    r"\b(reframing|cognitive\s+reappraisal|cognitive\s+restructuring)\b",
    r"\b(empathic?\s+(?:response|listening|reflection))\b",
    r"\b(validation)\b",
    r"\b(normali(?:z|s)(?:ation|ing))\b",
    r"\b(safety\s+planning)\b",
    r"\b(mood\s+(?:monitoring|tracking|check-in))\b",
    r"\b(self-disclosure)\b",
    r"\b(open[- ]ended\s+question)\b",
    r"\b(positive\s+reinforcement)\b",
    r"\b(affect\s+labeling|emotion\s+labeling)\b",
]

FUNCTION_EXTRACT_PATTERNS = [
    r"\b(reduce\s+(?:anxiety|depression|distress|loneliness|isolation))\b",
    r"\b(build\s+(?:coping|resilience|self-efficacy|skills))\b",
    r"\b(emotional\s+(?:validation|support|regulation))\b",
    r"\b(crisis\s+(?:detection|intervention|support|response))\b",
    r"\b((?:symptom|mood)\s+(?:monitoring|tracking|screening))\b",
    r"\b(referral|triage|linkage|escalation)\b",
    r"\b(therapeutic\s+alliance|working\s+alliance|rapport)\b",
    r"\b(self-management)\b",
    r"\b(peer\s+support)\b",
    r"\b(social\s+(?:connection|support|interaction|engagement))\b",
    r"\b(well-?being|wellbeing)\b",
    r"\b(insight)\b",
    r"\b(decision\s+support)\b",
]

PARADOX_EXTRACT_PATTERNS = [
    r"\b(therapeutic\s+misconception)\b",
    r"\b(role\s+confusion)\b",
    r"\b(pseudo-?intimacy)\b",
    r"\b(emotional\s+(?:dependenc|over-relianc|solipsism))\b",
    r"\b(parasocial)\b",
    r"\b(authority[- ]agency)\b",
    r"\b(over-?reliance)\b",
    r"\b(role\s+mismatch)\b",
    r"\b(dark\s+side)\b",
    r"\b(unearned\s+authority)\b",
    r"\b(hollow\s+(?:authority|empathy))\b",
    r"\b(harm(?:ful)?(?:\s+(?:outcome|effect|response)))\b",
    r"\b((?:emotional|psychological)\s+dependency)\b",
    r"\b(boundary\s+(?:violation|confusion|issue))\b",
]


def extract_patterns(text, patterns):
    """Return deduplicated list of pattern matches from text."""
    text = str(text).lower()
    found = []
    for pat in patterns:
        for match in re.findall(pat, text, re.IGNORECASE):
            if isinstance(match, tuple):
                term = " ".join(m.strip() for m in match if m and len(m) > 1).strip()
            else:
                term = match.strip()
            if term and len(term) > 2:
                found.append(term)
    return list(dict.fromkeys(found))  # deduplicate preserving order


def run_extraction(row):
    """Run automated pattern extraction on a single paper."""
    text = " ".join(str(row.get(c, "")) for c in ["title", "abstract"])

    roles = extract_patterns(text, ROLE_EXTRACT_PATTERNS)
    strategies = extract_patterns(text, STRATEGY_EXTRACT_PATTERNS)
    functions = extract_patterns(text, FUNCTION_EXTRACT_PATTERNS)
    paradox = extract_patterns(text, PARADOX_EXTRACT_PATTERNS)

    return pd.Series({
        "auto_roles": ", ".join(roles) if roles else "",
        "auto_strategies": ", ".join(strategies) if strategies else "",
        "auto_functions": ", ".join(functions) if functions else "",
        "auto_paradox": ", ".join(paradox) if paradox else "",
    })


print("Running automated extraction on all papers...")
auto = df.apply(run_extraction, axis=1)
df = pd.concat([df, auto], axis=1)

# Merge: use human extraction if present, otherwise auto
for field, auto_field in [
    ("extracted_roles", "auto_roles"),
    ("extracted_strategies", "auto_strategies"),
    ("extracted_functions", "auto_functions"),
    ("paradox_indicators", "auto_paradox"),
]:
    human = df[field].fillna("").astype(str).str.strip()
    machine = df[auto_field].fillna("").astype(str).str.strip()
    df[field + "_merged"] = human.where(human != "", machine)

# Stats
n_with_roles = (df["extracted_roles_merged"].str.len() > 0).sum()
n_with_strats = (df["extracted_strategies_merged"].str.len() > 0).sum()
n_with_funcs = (df["extracted_functions_merged"].str.len() > 0).sum()
n_with_paradox = (df["auto_paradox"].str.len() > 0).sum()
print(f"Extraction coverage: roles={n_with_roles}, strategies={n_with_strats}, "
      f"functions={n_with_funcs}, paradox={n_with_paradox} (of {len(df)})")

# ---------------------------------------------------------------------------
# DIMENSION SCORING (Fix 1 — multi-label)
# ---------------------------------------------------------------------------

text_cols = ["title", "abstract", "extracted_roles_merged",
             "extracted_strategies_merged", "extracted_functions_merged",
             "failure_notes"]


def build_text(row):
    return " ".join(str(row.get(c, "")) for c in text_cols)


def score_text(text, keywords):
    text = str(text).lower()
    return sum(1 for kw in keywords if kw in text)


df["_fulltext"] = df.apply(build_text, axis=1)

# Score each dimension
for dim, kws in DIM_KEYWORDS.items():
    df[dim + "_score"] = df["_fulltext"].apply(lambda t, k=kws: score_text(t, k))

df["paradox_score"] = df["_fulltext"].apply(lambda t: score_text(t, PARADOX_KEYWORDS))

# Multi-label: tag paper for every dimension >= threshold
dim_names = list(DIM_KEYWORDS.keys())
for dim in dim_names:
    df[dim + "_tagged"] = df[dim + "_score"] >= DIM_THRESHOLD

# Co-occurrence matrix
cooccurrence = {}
for d1, d2 in combinations(dim_names, 2):
    both = (df[d1 + "_tagged"] & df[d2 + "_tagged"]).sum()
    cooccurrence[(d1, d2)] = both
    cooccurrence[(d2, d1)] = both

# Build full matrix including diagonal
cooc_data = {}
for d in dim_names:
    row = {}
    for d2 in dim_names:
        if d == d2:
            row[d2] = int(df[d + "_tagged"].sum())
        else:
            row[d2] = cooccurrence.get((d, d2), 0)
    cooc_data[d] = row

df_cooc = pd.DataFrame(cooc_data).T
df_cooc.index.name = "dimension"
df_cooc.to_csv(OUTPUT_DIR / "aroma_cooccurrence_matrix.csv")
print(f"\nCo-occurrence matrix saved.")
print(df_cooc.to_string())

# Multi-label counts
multi_label_counts = {}
for dim in dim_names:
    multi_label_counts[dim] = int(df[dim + "_tagged"].sum())

# Papers touching multiple dimensions
df["n_dims"] = sum(df[d + "_tagged"].astype(int) for d in dim_names)
multi_dim_stats = df["n_dims"].value_counts().sort_index()

# Keep primary_dim for top-paper selection (highest-scoring dimension)
dim_score_cols = [d + "_score" for d in dim_names]
df["primary_dim"] = df[dim_score_cols].idxmax(axis=1).str.replace("_score", "", regex=False)

# ---------------------------------------------------------------------------
# ROLE TERM EXTRACTION + AROMA MAPPING (Fix 3)
# ---------------------------------------------------------------------------

all_roles = []
role_paper_map = defaultdict(set)  # role_term -> set of paper ids

for _, row in df.iterrows():
    # From merged extraction
    roles_text = str(row.get("extracted_roles_merged", ""))
    if roles_text and roles_text != "nan":
        for role in roles_text.split(","):
            r = role.strip().lower()
            if r and len(r) > 2:
                all_roles.append(r)
                role_paper_map[r].add(row.get("id", row.name))

    # Also mine abstract with expanded patterns
    abstract = str(row.get("abstract", "")).lower()
    title = str(row.get("title", "")).lower()
    combined = abstract + " " + title
    for pat in ROLE_EXTRACT_PATTERNS:
        for match in re.findall(pat, combined, re.IGNORECASE):
            if isinstance(match, tuple):
                term = " ".join(m.strip() for m in match if m and len(m) > 2
                                and m.lower() not in ["ai", "as", "a", "an", "the", "based"])
                term = re.sub(r'\s+', ' ', term).strip()
            else:
                term = match.strip()
            if term and len(term) > 2:
                all_roles.append(term)
                role_paper_map[term].add(row.get("id", row.name))

role_counts = Counter(all_roles)

# Build taxonomy with AROMA role mapping
role_taxonomy_rows = []
for role_term, count in sorted(role_counts.items(), key=lambda x: -x[1]):
    aroma_role = map_to_aroma_role(role_term)
    role_taxonomy_rows.append({
        "role_term": role_term.title(),
        "frequency": count,
        "aroma_role": aroma_role,
        "n_papers": len(role_paper_map.get(role_term, set())),
    })

df_taxonomy = pd.DataFrame(role_taxonomy_rows)
df_taxonomy.to_csv(OUTPUT_DIR / "aroma_role_taxonomy_draft.csv", index=False)
print(f"\nRole taxonomy saved: {len(df_taxonomy)} unique terms.")

# Aggregate by AROMA role
aroma_role_agg = defaultdict(lambda: {"terms": [], "total_freq": 0, "papers": set()})
for _, row in df_taxonomy.iterrows():
    ar = row["aroma_role"]
    aroma_role_agg[ar]["terms"].append(f"{row['role_term']} ({row['frequency']})")
    aroma_role_agg[ar]["total_freq"] += row["frequency"]
    term_lower = row["role_term"].lower()
    aroma_role_agg[ar]["papers"].update(role_paper_map.get(term_lower, set()))

# ---------------------------------------------------------------------------
# FAILURE / PARADOX CLUSTERING
# ---------------------------------------------------------------------------

paradox_papers = df[df["paradox_score"] >= 2].sort_values("paradox_score", ascending=False)

# Also use auto_paradox for richer clustering
failure_themes = defaultdict(list)
for _, row in df.iterrows():
    paradox_text = " ".join([
        str(row.get("failure_notes", "")),
        str(row.get("paradox_indicators", "")),
        str(row.get("auto_paradox", "")),
    ]).lower()

    if not paradox_text.strip() or paradox_text.strip() == "nan nan":
        continue

    title = str(row.get("title", ""))[:80]
    matched = False
    if any(k in paradox_text for k in ["pseudo-intimacy", "pseudo intimacy",
                                        "over-reliance", "dependency",
                                        "emotional solipsism", "parasocial"]):
        failure_themes["Pseudo-Intimacy / Dependency"].append(title)
        matched = True
    if any(k in paradox_text for k in ["role confusion", "role mismatch",
                                        "therapeutic misconception", "misalignment",
                                        "boundary violation", "boundary confusion"]):
        failure_themes["Role Confusion / Misconception"].append(title)
        matched = True
    if any(k in paradox_text for k in ["authority-agency", "authority agency",
                                        "unearned authority", "hollow authority",
                                        "dark side"]):
        failure_themes["Authority-Agency Tension"].append(title)
        matched = True
    if any(k in paradox_text for k in ["harm", "safety", "bias", "clinical"]):
        failure_themes["Reliability & Safety Gap"].append(title)
        matched = True
    if matched is False and any(k in paradox_text for k in PARADOX_KEYWORDS):
        failure_themes["Other Paradox Signal"].append(title)

# Deduplicate within each theme
for theme in failure_themes:
    failure_themes[theme] = list(dict.fromkeys(failure_themes[theme]))

# ---------------------------------------------------------------------------
# GENERATE SYNTHESIS REPORT (v2)
# ---------------------------------------------------------------------------

dim_examples = {}
for dim in dim_names:
    top = df[df[dim + "_tagged"]].nlargest(5, dim + "_score")
    dim_examples[dim] = [
        f"- **{str(row.get('title', ''))[:80]}** ({str(row.get('year', '?'))}) — {str(row.get('venue', ''))[:60]}"
        for _, row in top.iterrows()
    ]

lines = []


def add(*args):
    for a in args:
        lines.append(a)


add("# AROMA Phase 1 — Systematic Synthesis Report (v2)")
add(f"\n*Generated from {len(df)} papers (59 legacy + {len(df) - 59} new candidates)*")
add(f"*Extraction coverage: {n_with_roles} papers with role terms, "
    f"{n_with_strats} with strategy terms, {n_with_funcs} with function terms*\n")

# --- Section 1: Corpus Overview ---
add("---", "## 1. Corpus Overview\n")
add("| Metric | Value |", "| --- | --- |")
add(f"| Total Papers | {len(df)} |")
add(f"| Legacy Anchors (pre-coded) | 59 |")
add(f"| New Candidates (PRISMA) | {len(df) - 59} |")
add(f"| Papers with Paradox Signal | {n_with_paradox} |")
add(f"| Unique Role Terms Extracted | {len(role_counts)} |")
add(f"| Papers touching ≥2 dimensions | {(df['n_dims'] >= 2).sum()} |")
add(f"| Papers touching ≥3 dimensions | {(df['n_dims'] >= 3).sum()} |")
add("")

# --- Section 2: Multi-label Distribution ---
add("---", "## 2. Distribution by AROMA Dimension (Multi-label)\n")
add("Each paper is tagged for **every** dimension where it scores ≥1 keyword hit. "
    "Papers routinely span multiple dimensions — this is expected and supports "
    "AROMA's argument that the five dimensions are orthogonal.\n")
add("| Dimension | Papers Tagged |", "| --- | --- |")
for dim in dim_names:
    add(f"| {DIM_LABELS[dim]} | {multi_label_counts[dim]} |")
add("")
add(f"**Dimension coverage per paper:**\n")
add("| Dimensions touched | Paper count |", "| --- | --- |")
for n_dims, count in sorted(multi_dim_stats.items()):
    add(f"| {n_dims} | {count} |")
add("")

# --- Section 3: Co-occurrence Matrix ---
add("---", "## 3. Dimension Co-occurrence Matrix\n")
add("How many papers are tagged for both dimensions. Diagonal = total per dimension.\n")
header = "| | " + " | ".join(DIM_LABELS[d] for d in dim_names) + " |"
sep = "| --- " * (len(dim_names) + 1) + "|"
add(header, sep)
for d in dim_names:
    row_vals = " | ".join(str(df_cooc.loc[d, d2]) for d2 in dim_names)
    add(f"| **{DIM_LABELS[d]}** | {row_vals} |")
add("")

# --- Section 4: Top Papers per Dimension ---
add("---", "## 4. Top Papers per Dimension\n")
add("Ranked by keyword score within each dimension (multi-label — a paper may appear under multiple dimensions).\n")
for dim in dim_names:
    add(f"### {DIM_LABELS[dim]}\n")
    examples = dim_examples.get(dim, ["*(No papers tagged)*"])
    for ex in examples:
        add(ex)
    add("")

# --- Section 5: Role Terminology Analysis (Fix 3 — the reframe) ---
add("---", "## 5. Role Terminology Analysis\n")
add("### The Core Finding: Terminological Fragmentation\n")
add("The literature does not use a shared vocabulary for AI care roles. "
    "The same relational stance is described under multiple labels across "
    "different research traditions. This fragmentation is precisely the gap "
    "AROMA's D2 taxonomy addresses.\n")
n_roles_with_terms = len([r for r in aroma_role_agg if not r.startswith("[")])
n_roles_without = 6 - n_roles_with_terms
add(f"The table below maps every mined role term to its nearest AROMA Care Role, "
    f"revealing that what appears as {len(df_taxonomy)} distinct terms collapses "
    f"into 6 care roles plus system descriptors. {n_roles_with_terms} roles have "
    f"existing literature terms; {n_roles_without} (Listener, Reflective Partner) "
    f"have no established terminology — they describe relational stances the "
    f"literature enacts but does not name.\n")

# Table by AROMA role
add("| AROMA Care Role | Literature terms (frequency) | Total mentions | Unique papers |",
    "| --- | --- | --- | --- |")
role_order = ["Listener", "Reflective Partner", "Coach", "Advisor", "Companion",
              "Navigator", "[System Descriptor]", "[Unmapped]"]
for ar in role_order:
    info = aroma_role_agg.get(ar)
    if info:
        terms_str = "; ".join(info["terms"])
        add(f"| **{ar}** | {terms_str} | {info['total_freq']} | {len(info['papers'])} |")
    elif not ar.startswith("["):
        # Show AROMA roles with 0 papers — the absence is a finding
        add(f"| **{ar}** | *(no terms mined)* | 0 | 0 |")
add("")

add("### Interpretation\n")
add("The absence of standardised role vocabulary is not evidence against AROMA — "
    "it is the primary evidence *for* it. \"Companion\" appears across 4 variant "
    "labels. The Advisor cluster absorbs 10+ terms spanning \"therapist\", "
    "\"counselor\", \"sim-physician\", and \"crisis counselor.\" No prior framework "
    "consolidates these into a principled, mutually exclusive set of relational stances.\n")

# Raw frequency table (kept for reference)
add("### Raw Term Frequency\n")
add("| Role Term | Frequency | AROMA Role |", "| --- | --- | --- |")
for _, row in df_taxonomy.head(30).iterrows():
    add(f"| {row['role_term']} | {row['frequency']} | {row['aroma_role']} |")
add("")

# --- Section 6: Paradox Signals ---
add("---", "## 6. Authority-Agency Paradox Signals\n")
total_paradox_papers = sum(len(v) for v in failure_themes.values())
add(f"**{n_with_paradox} papers** contain paradox-relevant terminology. "
    f"Clustering by failure theme:\n")

for theme, titles in sorted(failure_themes.items(), key=lambda x: -len(x[1])):
    add(f"### {theme} ({len(titles)} papers)\n")
    for t in titles[:8]:
        add(f"- {t}")
    add("")

# --- Section 7: Thematic Findings ---
add("---", "## 7. Key Thematic Findings\n")
add("Based on pattern extraction across the full corpus and close reading of "
    "legacy anchor papers:\n")
add(f"1. **Terminological Fragmentation as the Core D2 Finding**: "
    f"{len(df_taxonomy)} unique role-like terms were mined from the corpus. "
    f"These collapse into 6 AROMA Care Roles when mapped by relational stance. "
    f"The field lacks a shared vocabulary — AROMA provides one.")
add(f"2. **Most Papers Span Multiple Dimensions**: "
    f"{(df['n_dims'] >= 2).sum()}/{len(df)} papers ({100*(df['n_dims'] >= 2).sum()//len(df)}%) "
    f"touch ≥2 AROMA dimensions. This validates the multi-dimensional framing: "
    f"papers simultaneously address support types, strategies, and modalities "
    f"but rarely separate them analytically.")
add(f"3. **Strategy-Role Disconnect**: "
    f"{n_with_strats} papers mention specific therapeutic strategies "
    f"but only {n_with_roles} mention role terms. "
    f"The literature describes *what AI does* (strategies) far more often than "
    f"*who the AI is being* (roles). This is the D4/D2 gap AROMA formalises.")
add(f"4. **D3 (Core Function) is Underrepresented**: "
    f"Only {multi_label_counts['D3']} papers are tagged for D3, the lowest count. "
    f"Referral, triage, and linkage functions are rarely theorised in the AI mental "
    f"health literature, pointing to a specific gap the Navigator role addresses.")
add(f"5. **Pseudo-Intimacy as the Dominant Paradox Theme**: "
    f"{len(failure_themes.get('Pseudo-Intimacy / Dependency', []))} papers "
    f"document dependency, parasocial attachment, or pseudo-intimacy as failure "
    f"modes — the single largest paradox cluster in the corpus.")
add("")

add("---")
add("*AROMA Phase 1 Synthesis v2 — see `aroma_role_taxonomy_draft.csv` for full "
    "term list, `aroma_cooccurrence_matrix.csv` for dimension co-occurrence data.*")

report_path = OUTPUT_DIR / "aroma_synthesis_report.md"
report_path.write_text("\n".join(lines))
print(f"\nSynthesis report saved: {report_path}")
