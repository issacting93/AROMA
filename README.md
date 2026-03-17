# AROMA: Affective Role Orientation for Mental-health Assistance

**AROMA** is a five-dimensional framework designed to formalize the role structure of AI-mediated mental health support interactions. 

Existing frameworks in Human-Computer Interaction (HCI) and clinical psychology often evaluate AI systems strictly by the interventions they provide or the models they use. AROMA argues that this misses the fundamental relational dynamics at play: **What role is the AI taking in the interaction, and how does that role adapt to the user's needs?**

Our core research question is: *"What is the role structure of AI-mediated mental health support interactions?"*

## The 5 Dimensions of AROMA

1. **D1: Support Type**  
   The foundational dimension identifying the specific need a user is expressing (e.g., emotional, informational, esteem). It is grounded in established support typologies like the Social Support Behavior Code (Cutrona & Suhr, 1992).
2. **D2: Care Role**  
   The stable relational stance an AI adopts toward a user (e.g., Listener, Coach, Companion). This is the core theoretical addition of AROMA—applying Role Theory (Biddle, 1986) to conversational AI.
3. **D3: Core Function**  
   The intended psychological outcome or functional goal that a Care Role aims to produce (e.g., emotional validation, insight generation).
4. **D4: Support Strategy**  
   The concrete, observable conversational tactics the system uses to execute its role (e.g., reflective listening, providing resources). 
5. **D5: Interaction Modality**  
   The communicative medium (text, voice, embodied avatar) which acts as a structural constraint on which roles and strategies are viable. This is the AI-specific dimension — it has no equivalent in human-human care literature.

## Methodology: Hybrid Top-Down + Bottom-Up Approach

AROMA's taxonomy is built using a hybrid methodology inspired by [Shen et al. (2024)](https://doi.org/10.1145/3613904.3642703), combining top-down theoretical anchoring with bottom-up empirical extraction:

```
Phase 0: Top-Down Foundation     →  Anchor in Cutrona & Suhr, Biddle, Feng
Phase 1: PRISMA Literature Review →  Systematic extraction from 100–200 papers
Phase 2: Data Collection          →  Conversation corpora (WildChat, Reddit, etc.)
Phase 3: Qualitative Coding       →  Inductive + deductive coding (κ ≥ 0.70)
Phase 4: Expert Validation         →  Domain expert interviews + D5 formalisation
Phase 5: Classification Pipeline   →  LLM-as-judge + fine-tuned classifier
Phase 6: Evaluation & Analysis     →  Coverage gaps, failure modes, design implications
Phase 7: Writing                   →  CHI 2027 submission
```

## Project Phases

| Phase | Folder | Status | Gate |
| :--- | :--- | :--- | :--- |
| **0. Top-Down Foundation** | [`phase_0_theoretical_framework/`](phase_0_theoretical_framework/) | Complete | Framework spec signed off |
| **1. PRISMA Literature Synthesis** | [`phase_1_literature_synthesis/`](phase_1_literature_synthesis/) | Complete | 144 included candidates (203 total papers) |
| **2. Care Role Taxonomy** | [`phase_2_taxonomy/`](phase_2_taxonomy/) | Complete | 6 roles formalized and corpus-grounded |
| **3. Qualitative Coding** | [`phase_3_human_coding/`](phase_3_human_coding/) | Not Started | κ ≥ 0.70 on D2 |
| **4. Expert Validation & AI Extension** | [`phase_4_expert_validation/`](phase_4_expert_validation/) | Not Started | Codebook v1.0 signed off |
| **5. Classification Pipeline** | [`phase_5_classification_pipeline/`](phase_5_classification_pipeline/) | Not Started | F1 ≥ 0.75 on test set |
| **6. Evaluation & Analysis** | [`phase_6_evaluation/`](phase_6_evaluation/) | Not Started | Error analysis complete |
| **7. Writing** | [`phase_7_writing/`](phase_7_writing/) | Not Started | CHI 2027 submission |

## Corpus Grounding (Phase 1 Results)

AROMA's taxonomy is empirically grounded in a PRISMA-compliant systematic synthesis of the AI care literature:

- **Search Scope**: 1,289 unique papers fetched across Semantic Scholar, OpenAlex, and PubMed (2015–2025).
- **Inclusion**: 144 new candidates identified, forming a **203-paper final corpus** when merged with legacy theoretical anchors.
- **Role Consolidation**: 34 distinct literature terms were identified and mapped to **6 AROMA Care Roles** (terminological fragmentation map).
- **Key Finding**: Listener and Reflective Partner roles are frequently enacted in the literature but rarely named as distinct relational stances—supporting AROMA's role-based analytical lens.

## Interactive Tools

- **[Literature & Taxonomy Map](taxonomy-table.html)** — Interactive table mapping the 203-paper corpus across AROMA's 5 dimensions
- **[Knowledge Graph](knowledge-graph.html)** — D3 force-directed visualisation of the D3 (Core Function) keyword space (40 optimized papers)

![AROMA Cross-Reference Knowledge Graph](preview.png)

## Key Theoretical Contributions

- **Authority-Agency Paradox**: Users ascribe positions of authority to AI agents (e.g. expert, advisor) — yet AI agents lack the agency to change the user's situation *or* the user's role. Authority is claimed, but agency is absent.
- **Care role ≠ support type**: The field conflates what the AI *gives* (support type) with what the AI *is* (care role). AROMA separates these into orthogonal dimensions.

## Running Locally

```bash
npx serve .
# Open taxonomy-table.html or knowledge-graph.html in your browser
```
