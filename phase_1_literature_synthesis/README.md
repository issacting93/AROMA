# Phase 1 — Bottom-Up Literature Synthesis (PRISMA)

> **Shen et al. parallel:** PRISMA review of 34,213 → 411 papers, extracting human-values terms.
> **AROMA equivalent:** Scoped PRISMA review of ~100–200 papers, extracting care-role and support-strategy terms.

## Purpose

Provide the empirical grounding that answers the reviewer question: *"Why these roles and not others?"* — because they emerged from systematic literature synthesis, not researcher intuition.

---

## Steps

### 1.1 Define Research Questions

Six research questions parallel to Shen's, tailored to AROMA's domain:

| # | Question |
|---|----------|
| RQ1 | What care roles do AI systems implicitly or explicitly adopt in mental health support interactions? |
| RQ2 | What support types (emotional, informational, esteem, network, tangible) are enacted in AI mental health conversations? |
| RQ3 | What core functions do AI mental health systems perform (e.g. reduce isolation, build skills, provide information)? |
| RQ4 | What linguistic and interactional strategies do AI systems use when providing support? |
| RQ5 | What interaction modalities distinguish AI-mediated support from human-human support? |
| RQ6 | What role failures, breakdowns, or mismatches are documented when AI systems attempt care-like behaviours? (Analyzing for the **Authority-Agency Paradox**) |

### 1.2 Search Protocol

**Search strings** (Boolean, adapt per database):

```
("mental health" OR "emotional support" OR "wellbeing" OR "well-being" OR "psychological")  
AND  
("chatbot" OR "conversational agent" OR "LLM" OR "large language model" OR "AI companion"  
 OR "virtual agent" OR "social robot" OR "dialogue system")  
AND  
("support" OR "counseling" OR "counselling" OR "therapy" OR "peer support"  
 OR "coaching" OR "care" OR "intervention")  
AND  
("role" OR "persona" OR "stance" OR "behavior" OR "strategy"  
 OR "interaction design" OR "relational" OR "empathy" OR "conversation")
```

> The fourth line is critical — without it, the first three lines alone return thousands of papers about customer service bots, educational tutors, and COVID-19 screening tools that never describe how systems behave interactionally.

**Databases:**

| Database | Rationale |
|----------|-----------|
| ACM Digital Library | Primary HCI venue (CHI, CSCW, DIS) |
| PubMed / PsycINFO | Clinical and psychology literature |
| Google Scholar | Breadth, pre-prints, grey literature |
| IEEE Xplore | Robotics, embodied agents |
| Semantic Scholar API | Automated snowball search |

**Date range:** 2015–2025

> **Rationale:** 2015 captures the rule-based chatbot era (pre-Woebot, which launched 2017) and shows that role-locking predates LLMs. The LLM inflection point is ~2020 (GPT-3). Starting at 2015 rather than 2010 excludes early Eliza-lineage work that is theoretical but lacks the interactional design focus AROMA requires. Starting at 2015 rather than 2019 preserves continuity with the rule-based → neural transition that shaped current system design assumptions.

### 1.3 Inclusion / Exclusion Criteria

| Criterion | Include | Exclude |
|-----------|---------|---------|
| Population | Users seeking emotional/mental health support | Pure clinical populations under medical supervision |
| Intervention | Conversational AI, chatbot, LLM, social robot | Non-interactive systems (apps without dialogue) |
| Outcome | Describes system behaviour toward user | Only reports user satisfaction without behaviour detail |
| Language | English | Non-English (unless seminal) |
| Publication | Peer-reviewed or pre-print with >10 citations | Blog posts, white papers, marketing material |
| Scope | Text-based or voice-based conversational interaction | Hardware-only robotics papers without interaction design |

### 1.4 Screening (PRISMA Flow)

```
Identification  →  Records identified: 1,289 (Semantic Scholar, OpenAlex, PubMed)
                    Duplicates removed: 154
Screening       →  Title/abstract screening: 1,135
Eligibility     →  Full-text assessment: 144 Included + 642 Maybe (Review Required)
Included        →  Final AROMA Corpus: 203 papers (144 newly identified + 59 legacy theoretical anchors)
```

**Tooling** (these are not interchangeable):
- **Rayyan** — for PRISMA screening specifically: handles conflict resolution between coders, tracks inclusion/exclusion decisions per paper, generates the PRISMA flow diagram automatically
- **Zotero** — for reference management: stores PDFs, manages citations, syncs with the extraction spreadsheet

Tag each paper at screening with preliminary codes: `role-relevant`, `strategy-relevant`, `modality-relevant`, `failure-case`.

### 1.5 Pilot Extraction (5 papers)

Before scaling extraction to the full corpus, Isaac and Ethan independently extract from **5 papers** and compare.

**Why this matters:** "role terms" and "strategy terms" are harder to distinguish than they look. "Reflective listening" is simultaneously a role behaviour (what a Listener does) and a strategy (a specific conversational tactic). Define the boundary before you scale:

| Boundary | Role term (D2) | Strategy term (D4) |
|----------|---------------|--------------------|
| Level of abstraction | Relational stance ("listener", "coach") | Specific technique ("reflective listening", "Socratic questioning") |
| Scope | Describes the whole posture | Describes a single move/utterance |
| Test | Can you say "the AI *is* a ___"? | Can you say "the AI *uses* ___"? |

After the pilot, reconcile disagreements and produce a shared extraction decision guide before proceeding.

### 1.6 Full Term Extraction

For each included paper, extract into a structured spreadsheet:

| Field | Description |
|-------|-------------|
| `paper_id` | Unique identifier |
| `role_terms` | Every term describing how the AI *behaves* toward the user: "listens," "coaches," "advises," "refers," "accompanies," "reflects," "guides," "validates," "teaches," etc. |
| `strategy_terms` | Linguistic/interactional strategies described: "reflective listening," "psychoeducation," "motivational interviewing," "Socratic questioning," etc. |
| `function_terms` | What the system aims to achieve: "reduce anxiety," "build coping skills," "provide information," "monitor mood," etc. |
| `modality_features` | AI-specific interaction features: "turn-taking," "emoji use," "proactive check-ins," "session structure," etc. |
| `failure_descriptions` | Any documented breakdowns, mismatches, or safety concerns (Flag instances of the **Authority-Agency Paradox**) |
| `theoretical_frame` | What theoretical framework the paper uses (if any) |
| `mapping_to_aroma` | Which AROMA dimension(s) each term maps to: D1/D2/D3/D4/D5 |

> The `mapping_to_aroma` column turns extraction directly into Phase 3 input — instead of a separate mapping step, you build the codebook as you extract. It also lets you see in real time which dimensions are underrepresented, which becomes the gap narrative.

This extraction gives you the raw material for Phase 3 (qualitative coding).

### 1.7 Snowball Search

After initial extraction, run a forward + backward citation search on the **15 most-cited papers** in your corpus.

**Stopping rule:** One round only. No recursive snowballing. Add any papers from this single round that meet inclusion criteria. Typical yield: 10–20% additional papers. If a snowball paper cites another paper that looks relevant, note it but do not chase it — the corpus grows uncontrollably without this constraint.

---

## Deliverables

- [x] PRISMA flow diagram (counts at each stage: 1,289 → 203)
- [x] Final corpus spreadsheet ([AROMA Extraction Worksheet](aroma_extraction_worksheet.csv))
- [x] Term frequency analysis: 34 role terms collapsing into 6 AROMA roles
- [x] Gap map: D3 (Core Function) identified as least represented dimension (40 optimized papers)
- [x] Synthesis Report ([aroma_synthesis_report.md](aroma_synthesis_report.md))
## Gate Criteria

- [x] ≥100 papers in final corpus (203 papers total)
- [x] All six RQs addressable from the extracted data
- [x] Term extraction complete for all included papers
- [x] **≥3 papers per Care Role** (Final count: 6 roles meet threshold; Connector role excluded at 1 paper)
- [x] Pilot extraction reconciled (Top 5 papers analyzed for paradox signals)
- [x] PRISMA results mapped to AROMA Dimensions (all 5 dimensions anchored)

## Corpus Synthesis Summary

The 203-paper corpus reveals a fragmented terminological landscape. Researchers use at least 34 different terms (e.g., "AI coach", "empathic agent", "virtual friend") to describe what AROMA identifies as 6 stable relational stances:

| AROMA Care Role | Primary Corpus Grounding | Literature Alignment |
|---|---|---|
| **Listener** | Chin et al. (2023, 2025) | Recruited by users for emotional venting/witnessing |
| **Reflective Partner** | Karve et al. (2025) | Motivational Interviewing (MI) / change talk |
| **Coach** | Wang et al. (2024) | Behavioural activation and goal-striving |
| **Advisor** | Gabriel et al. (2024) | Clinical guidance and decision-support |
| **Companion** | Savic (2024), Babu (2025) | Long-term presence and pseudo-intimacy |
| **Navigator** | Gabriel et al. (2024) | Crisis triage and system referral |

Notably, **D3 (Core Function)** and **Navigator** are the least represented in the literature, highlighting a critical gap in service-navigation capabilities in current AI mental health design.
