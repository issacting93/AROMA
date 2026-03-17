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
Identification  →  Records identified (target: ~800–1,500)
                    Duplicates removed
Screening       →  Title/abstract screening (target: ~300–400)
Eligibility     →  Full-text assessment (target: ~150–200)
Included        →  Final corpus for extraction (target: 100–200)
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

- [ ] PRISMA flow diagram (counts at each stage)
- [ ] Final corpus spreadsheet (100–200 papers with full extraction)
- [ ] Term frequency analysis: which role/strategy/function terms appear most often?
- [ ] Gap map: which AROMA dimensions are well-represented in the literature vs. undertheorised?

## Gate Criteria

- [ ] ≥100 papers in final corpus
- [ ] All six RQs addressable from the extracted data
- [ ] Term extraction complete for all included papers
- [ ] **≥3 papers per candidate Care Role** — if a role appears in only 1–2 papers, either search more specifically for it or reconsider whether it belongs in the taxonomy. This gives a principled basis for inclusion/exclusion of roles.
- [ ] Pilot extraction reconciled (Isaac + Ethan agree on role vs. strategy boundary)
- [ ] PRISMA diagram ready for supplementary materials
