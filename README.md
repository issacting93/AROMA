# AROMA: Affective Role Ontology for Mental-health Agents

**AROMA** is a five-dimensional taxonomy that formalizes the role structure of AI-mediated mental health support interactions. It is the first framework to separate *what an AI gives* (Support Type) from *who the AI is being* (Care Role) — a conflation that pervades the current literature — and to treat interaction modality as a first-class structural constraint on role viability.

> **Core research question:** *"What is the role structure of AI-mediated mental health support interactions?"*

AROMA does not propose new clinical interventions. It organises existing support strategies from the literature into a cohesive, five-dimensional role taxonomy — grounded in social support theory (Cutrona & Suhr, 1992), role theory (Biddle, 1986), symbolic interactionism (Blumer, 1969), and media richness theory (Daft & Lengel, 1986) — and validated through systematic literature synthesis of a 203-paper PRISMA corpus.

Target venue: **CHI 2027**.

---

## The 5 Dimensions

| Dimension | Label | Question it answers | Theoretical anchor |
|---|---|---|---|
| **D1** | Support Type | What need is the user expressing? | Cutrona & Suhr (1992) SSBC |
| **D2** | Care Role | What relational stance is the AI adopting? | Biddle (1986) Role Theory; Blumer (1969) role-taking |
| **D3** | Core Function | What psychological outcome is being pursued? | Counseling psychology; goal-oriented dialogue |
| **D4** | Support Strategy | What conversational tactic is being used? | Feng (2009) IMA; Liu et al. (2021) ESConv |
| **D5** | Interaction Modality | What channel constrains role viability? | Daft & Lengel (1986); Bickmore & Picard (2005) |

**D1 Support Types:** Emotional, Informational, Esteem, Network, Tangible, Appraisal (extended from Lazarus & Folkman, 1984).

**D5** is AROMA's AI-specific dimension — it has no equivalent in human-human care literature. Some roles (e.g., Companion) require modalities with relational continuity; others (e.g., Advisor) work well in low-richness text.

---

## The 6 Care Roles

AROMA identifies six stable relational stances that AI systems adopt in mental health interactions. Each role is enacted turn-by-turn through role-taking (Blumer, 1969) — the process by which an actor reads the user's expressed state and calibrates its stance accordingly. A role is not declared in a single utterance; it is visible across a conversational sequence of 3-5 turns.

| Role | Relational stance | Primary D1 | Core function (D3) | Authority-Agency risk |
|---|---|---|---|---|
| **Listener** | Receptive, non-directive | Emotional | Emotional validation — user feels heard | Low |
| **Reflective Partner** | Curious, exploratory | Appraisal | Insight generation — user reaches new understanding | Low |
| **Coach** | Directive, forward-looking | Esteem | Self-efficacy — user feels capable of action | Moderate |
| **Advisor** | Authoritative, informational | Informational | Decision support — user has clarity on options | **High** |
| **Companion** | Warm, co-present | Emotional | Emotional presence — user feels less alone | Low |
| **Navigator** | Practical, resource-oriented | Network, Tangible | Resource discovery — user is connected to support | **High** |

**Inclusion criteria:** A care role is included if it (a) appears in 3+ independent papers from the PRISMA synthesis, (b) produces distinct interactional behaviours from all other roles, and (c) is viable within at least one AI interaction modality.

**Excluded:** Connector / peer-bridging (1 paper only — Gabriel et al. 2024). Peer community referral is absorbed into Navigator's scope.

---

## The Authority-Agency Paradox

AROMA's cross-cutting theoretical contribution:

> Users ascribe positions of **authority** to AI agents (e.g., expert, advisor) — yet AI agents lack the **agency** to change the user's situation *or* the user's role. Authority is claimed; agency is absent.

This creates structurally predictable failure modes, especially in high-authority roles:

```
Low risk                Moderate risk               High paradox
────────────────────────────────────────────────────────────────
Listener                Coach                       Advisor
Reflective Partner                                  Navigator
Companion
```

When a system accepts a user's projection of clinical authority but cannot exercise corresponding agency, the user may act as if receiving care from a capable actor when the structural burden of management remains entirely on them. This is conceptually analogous to the *therapeutic misconception* in clinical trial ethics (Appelbaum et al., 1982).

---

## Methodology

AROMA follows a hybrid top-down + bottom-up taxonomy development method (Nickerson, Varshney & Muntermann, 2013), combining theoretical anchoring with empirical extraction:

```
Phase 0: Top-Down Foundation       →  Anchor in Cutrona & Suhr, Biddle, Blumer, Feng, Daft & Lengel
Phase 1: PRISMA Literature Review  →  Systematic synthesis of 203 papers (2015–2025)
Phase 2: Care Role Taxonomy        →  6 roles formalized with activation/boundary conditions
         Data Collection           →  Conversation corpora (WildChat, Reddit, etc.)
Phase 3: Qualitative Coding        →  Inductive + deductive coding (κ ≥ 0.70)
Phase 4: Expert Validation         →  8–12 domain expert interviews + D5 formalisation
Phase 5: Classification Pipeline   →  LLM-as-judge + fine-tuned classifier (F1 ≥ 0.75)
Phase 6: Evaluation & Analysis     →  Coverage gaps, failure modes, design implications
Phase 7: Writing                   →  CHI 2027 submission
```

### Theoretical Anchors

| Anchor | What it provides | AROMA dimension |
|---|---|---|
| Cutrona & Suhr (1992) — SSBC | 5 support type categories + Appraisal extension | **D1** (direct inheritance) |
| Biddle (1986) — Role Theory | Roles as distinct from functions; invited complementary roles | **D2** (conceptual foundation) |
| Blumer (1969) / Mead (1934) — Symbolic Interactionism | Role-taking as enactment mechanism; defines annotation unit as conversational sequence | **D2** (annotation procedure) |
| Feng (2009) — Integrated Model of Advice-giving | Sequential communicative moves as empirical precedent for role-like behaviour | **D4**; D2 extension |
| Daft & Lengel (1986) / Bickmore & Picard (2005) | Modality richness as structural constraint on role viability | **D5** |
| Nickerson et al. (2013) | Taxonomy development method; ending conditions; empirical warrant | Methodological justification |

---

## Project Phases

| Phase | Folder | Status | Gate criteria |
|:---|:---|:---|:---|
| **0. Top-Down Foundation** | [`phase_0_theoretical_framework/`](phase_0_theoretical_framework/) | Complete | Framework spec signed off; all 5 dimensions anchored |
| **1. PRISMA Literature Synthesis** | [`phase_1_literature_synthesis/`](phase_1_literature_synthesis/) | Complete | 203-paper corpus; 34 role terms mapped to 6 roles |
| **2. Care Role Taxonomy** | [`phase_2_taxonomy/`](phase_2_taxonomy/) | Complete | 6 roles formalized with corpus grounding |
| **2. Data Collection** | [`phase_2_data_collection/`](phase_2_data_collection/) | Not Started | 400 dev + 150 test conversations |
| **3. Qualitative Coding** | [`phase_3_human_coding/`](phase_3_human_coding/) | Not Started | Cohen's κ ≥ 0.70 on D2 |
| **4. Expert Validation** | [`phase_4_expert_validation/`](phase_4_expert_validation/) | Not Started | ≥8 expert interviews; Codebook v1.0 signed off |
| **5. Classification Pipeline** | [`phase_5_classification_pipeline/`](phase_5_classification_pipeline/) | Not Started | F1 ≥ 0.75 macro-averaged on held-out test |
| **6. Evaluation & Analysis** | [`phase_6_evaluation/`](phase_6_evaluation/) | Not Started | Error analysis complete |
| **7. Writing** | [`phase_7_writing/`](phase_7_writing/) | In Progress | CHI 2027 submission |

---

## Corpus Grounding (Phase 1 Results)

AROMA's taxonomy is empirically grounded in a PRISMA-compliant systematic synthesis:

- **Search scope:** 1,289 unique papers fetched across Semantic Scholar, OpenAlex, and PubMed (2015–2025)
- **Inclusion:** 144 new candidates identified, forming a **203-paper final corpus** when merged with 59 legacy theoretical anchors
- **Multi-label dimension coverage:** 157 papers touch D5 (Modality), 138 touch D4 (Strategy), 126 touch D2 (Role), 99 touch D1 (Support Type), 40 touch D3 (Core Function)
- **Role consolidation:** 34 distinct literature terms mapped to **6 AROMA Care Roles** (terminological fragmentation map)
- **Key finding:** Listener and Reflective Partner are frequently enacted in the literature but have no established terminology — they describe relational stances the literature performs but does not name. This terminological absence is the primary evidence *for* AROMA's role-based analytical lens.

### Dimension Co-occurrence Matrix

```
         D1   D2   D3   D4   D5
D1       99   74   24   93   99
D2       74  126   32  108  116
D3       24   32   40   39   39
D4       93  108   39  138  133
D5       99  116   39  133  157
```

Most papers span multiple dimensions (validating the multi-dimensional framing) but rarely separate them analytically — the D4/D2 gap (53 papers mention strategies, only 34 mention role terms) is the empirical basis for AROMA's separation of *what AI does* from *who the AI is being*.

---

## Interactive Tools

Three web-based tools visualize the corpus and taxonomy:

- **[Literature & Taxonomy Map](taxonomy-table.html)** — Searchable, filterable table mapping the 203-paper corpus across AROMA's 5 dimensions with paper metadata and role-term alignment
- **[Knowledge Graph](knowledge-graph.html)** — D3 force-directed visualisation of the D3 (Core Function) keyword space across 40 papers
- **[Cross-Reference Explorer](cross-ref.html)** — Bidirectional mapping: roles → literature terms → papers; literature terms → AROMA dimensions

![AROMA Cross-Reference Knowledge Graph](preview.png)

---

## Project Structure

```
AROMA/
├── dashboard/
│   ├── taxonomy-table.html / .js       # Interactive literature map
│   ├── knowledge-graph.html / .js      # D3 force-directed Core Function graph
│   ├── cross-ref.html / .js            # Cross-reference explorer
│   ├── global.css                      # Tailwind CSS configuration
│   └── preview.png                     # Dashboard preview image
├── cross-ref-data.js                   # [Deprecated] - move to dashboard/ or phase_1/
├── phase_0_theoretical_framework/
│   ├── AROMA_Internal_Spec.md          # v0.3 — Definitive 5-dimension framework spec
│   ├── 0.1_Theoretical_Anchors.md      # 5 primary + 6 secondary theoretical anchors
│   ├── 0.2_Human_Role_Compatibility_Matrix.md  # Role-user fit analysis + design space
│   ├── 0.3_Theoretical_Argument.md     # Core motivating argument
│   ├── authority_agency.md             # Formalization of the paradox
│   └── legacy_roadmap.md               # Original project phases
│
├── phase_1_literature_synthesis/
│   ├── scripts/
│   │   ├── synthesize_corpus.py        # Main synthesis pipeline
│   │   ├── aroma_search_pipeline.py    # Search orchestration
│   │   └── ...
│   ├── aroma_corpus_screened.csv       # 203 included papers
│   ├── aroma_extraction_worksheet.csv  # Full extraction
│   ├── aroma_synthesis_report.md       # Generated findings
│   ├── papers-data.js                  # 203-paper dataset (used by dashboard)
│   └── roles_relationships_taxonomy_v3.xlsx/ # Raw synthesis data
│
├── phase_2_taxonomy/
│   └── 2.0_AROMA_Care_Role_Taxonomy.md # Definitive 6-role taxonomy
```

---

## Key Documents

| Document | Location | What it defines |
|---|---|---|
| AROMA Internal Spec v0.3 | `phase_0_theoretical_framework/AROMA_Internal_Spec.md` | Canonical 5-dimension definitions, D2 inclusion criteria, Authority-Agency Paradox |
| Theoretical Anchors | `phase_0_theoretical_framework/0.1_Theoretical_Anchors.md` | Why each dimension exists and what theory warrants it |
| Human-Role Compatibility Matrix | `phase_0_theoretical_framework/0.2_Human_Role_Compatibility_Matrix.md` | Role-user fit, support type design space, paradox gradient |
| Care Role Taxonomy v2.1 | `phase_2_taxonomy/2.0_AROMA_Care_Role_Taxonomy.md` | Full 6-role specifications with activation/boundary conditions |
| Synthesis Report | `phase_1_literature_synthesis/aroma_synthesis_report.md` | Auto-generated corpus findings (regenerated from `synthesize_corpus.py`) |

---

## Running Locally

The interactive tools require no build step — just a local HTTP server:

```bash
npx serve .
# Open http://localhost:3000/dashboard/taxonomy-table.html
# Open http://localhost:3000/dashboard/knowledge-graph.html
# Open http://localhost:3000/dashboard/cross-ref.html
```

To regenerate the synthesis report:

```bash
cd phase_1_literature_synthesis/scripts
python3 synthesize_corpus.py
```

This produces `aroma_synthesis_report.md`, `aroma_role_taxonomy_draft.csv`, and `aroma_cooccurrence_matrix.csv`.
