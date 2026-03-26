# Phase 3 — Qualitative Coding (weeks 9–16)

> **Shen et al. parallel:** 13 researchers performing inductive + deductive qualitative coding.
> **AROMA equivalent:** Issac + Ethan coding, Vedant arbitrating. Inductive codes (what terms appear in data) merged with deductive codes (which Cutrona & Suhr category does this map to).

## Purpose

This is the core methodological contribution. Merge the top-down theoretical structure (Phase 0) with the bottom-up literature terms (Phase 1) and empirical conversation data (Phase 2) to produce a validated codebook.

---

## Steps

### 3.1 Pilot Codebook from PRISMA Terms

Before coding conversations, synthesise the extracted terms from Phase 1:

1. **Cluster role terms** — group all extracted terms (e.g. "listens," "validates," "reflects," "acknowledges") into candidate role categories
2. **Map clusters to theory** — for each cluster, identify which Cutrona & Suhr support type and which Biddle role type it aligns with
3. **Generate candidate roles** — the five current candidates (Listener, Coach, Advisor, Companion, Navigator) plus any new candidates suggested by the literature
4. **Stress-test** — for each candidate beyond the current five, decide explicitly: distinct role or variant? Document the decision with evidence from ≥3 papers

**Additional role candidates to evaluate:**
- **Screener / Assessor** — from Vaidyam (2019), structured intake and monitoring
- **Facilitator** — from Scassellati et al. (2012), social modelling and skill practice
- **Cognitive Load Offloader** — from Song & Pendse (2025), rehearsal partner

### 3.2 Draft Codebook v0.1

For each role, produce a codebook entry:

```
Role name:           [e.g. Listener]
Definition:          [one sentence, precise enough to code against]
Not this role if:    [negative definition]

Core function (D3):  [what the role aims to achieve]
Primary D1:          [support type]
Secondary D1:        [if applicable]

Characteristic D4 strategies:
  - [strategy 1 with example utterance]
  - [strategy 2 with example utterance]
  - [what you will NOT see in this role]

Invited human role:  [complementary stance]
Failure mode:        [what breaks when mismatched]

Distinguishing from [adjacent role]:  [decision rule]
Distinguishing from [other role]:     [decision rule]

Example (positive):  [user turn + AI turn]
Example (negative):  [user turn + AI turn showing NOT this role]
```

### 3.3 Calibration Coding (Batch 1)

- Isaac and Ethan independently code **40 high-fidelity sequences** using Codebook v0.2
- Compare every disagreement → **every disagreement is a codebook failure, not a coder failure**
- Revise codebook: identify which definition was ambiguous, rewrite
- Compute preliminary κ (informational only — not the reliability gate)

### 3.4 Reliability Coding (Batch 2)

- Code 50 conversations independently
- Compute Cohen's κ **before** any discussion
- Target: **κ ≥ 0.70** for primary care role (D2)
- If κ < 0.60 → codebook revision required, return to 3.2
- If 0.60 ≤ κ < 0.70 → targeted revision of confused role pairs

### 3.5 Full Development Set Coding

- Split remaining 320 conversations between Isaac and Ethan
- Maintain 20% overlap for ongoing IRR monitoring
- Code in two passes per conversation:
  - **Pass 1:** Primary care role (D2) + confidence + rationale
  - **Pass 2:** Support type (D1) + strategy markers (D4)
- Turn-level coding on the 100-conversation subset

**Per-turn coding schema:**

| Field | Type | Options |
|-------|------|---------|
| Turn ID | auto | — |
| Primary Care Role (D2) | categorical | Listener / Coach / Advisor / Companion / Navigator / [+candidates] / Ambiguous / None |
| Confidence | 3-point | High / Medium / Low |
| Primary Support Type (D1) | categorical | Emotional / Informational / Esteem / Network / Tangible / Appraisal / Ambiguous / None |
| Role shift from prior turn | boolean | Yes / No |
| Failure mode present | boolean | Yes / No |
| Failure mode type | categorical | Authority-Agency gap / Role mismatch / Therapeutic misconception / Other |
| Notes | free text | — |

> **Ambiguous** is a legitimate label. High ambiguity rates in a region of the data tell you something theoretically important.

### 3.6 Adjudication & Edge Cases

- For every disagreement, discuss and reach consensus. Document resolution.
- Build a living document: **"Edge Cases and Decision Rules"** — every resolved hard case becomes an entry (target: 30–50 entries). Goes in paper Appendix.

### 3.7 Taxonomy Validation Checkpoint

After ~200 conversations, pause and audit:

| Question | Action if yes |
|----------|---------------|
| Is any role <5% frequency? | Role definition may be too narrow, or data source doesn't capture it |
| Are there consistent Ambiguous clusters? | Possible missing role — evaluate from PRISMA data |
| Do any two roles have high confusion rates? | Consider merging or sharpening the boundary |

This is where the taxonomy gets **empirically grounded** rather than just theoretically derived.

---

## Deliverables

- [ ] Codebook v0.1 → v1.0 (with revision history)
- [ ] Gold standard labels for 400 development conversations
- [ ] Turn-level labels for 100-conversation subset (~500 turns)
- [ ] Edge Cases and Decision Rules document (30–50 entries)
- [ ] IRR report: κ per dimension, disagreement analysis, confusion pairs

## Gate Criteria

- [ ] κ ≥ 0.70 for D2 (primary care role) on Batch 2
- [ ] All roles represented in ≥5% of coded data
- [ ] Edge Cases document has ≥20 entries
- [ ] Codebook v1.0 produced and signed off by Vedant
