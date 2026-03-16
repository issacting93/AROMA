# Phase 3 — Human Coding (Gold Standard) (weeks 9–16)

This is the core methodological contribution. The quality of everything downstream — the taxonomy's validity, the pipeline's evaluation — depends entirely on this.

## 3.1 Coding Protocol

**Setup:**
- Use a purpose-built annotation tool. Prodigy (from Explosion AI, the spaCy team) is excellent for this and handles inter-rater workflows well. Alternatively, a structured Google Sheet with explicit column definitions works fine at your scale.
- Code in two passes per conversation: first pass for primary care role (D2), second pass for support type (D1) and a brief rationale note

**Per-turn coding schema (turn-level):**

| Field | Type | Options |
|---|---|---|
| Turn ID | string | auto |
| Primary Care Role | categorical | Listener / Coach / Advisor / Companion / Navigator / Ambiguous / None |
| Confidence | 3-point | High / Medium / Low |
| Primary Support Type | categorical | Emotional / Esteem / Informational / Network / Instrumental |
| Role shift from prior turn | boolean | Yes / No |
| Failure mode present | boolean | Yes / No |
| Failure mode type | categorical | Authority-Agency gap / Role mismatch / Therapeutic misconception / Other |
| Notes | free text | |

**Ambiguous** is a legitimate label — do not force every turn into a clean category. High ambiguity rates in a region of the data tell you something theoretically important.

## 3.2 Inter-Rater Reliability Protocol

You (Issac) and Ethan code the same sample independently, then compare.

**Batching:**
- Batch 1 (calibration): 30 conversations, code independently, compare, rewrite codebook
- Batch 2 (reliability check): 50 conversations, code independently, compute IRR before discussion
- Remaining development set: split between you and Ethan, with 20% overlap for ongoing IRR monitoring

**IRR metric:**
Use Cohen's Kappa (κ) for the categorical labels. Target κ ≥ 0.70 for primary care role before proceeding to large-scale coding. κ ≥ 0.60 is acceptable with documented disagreement analysis; below 0.60 means the codebook needs revision.

For the paper, you'll report:
- κ per dimension (D1, D2 separately)
- Disagreement analysis: which role pairs were most confused, and why
- Codebook revision history (brief — shows methodological rigor)

## 3.3 Adjudication

For every disagreement, you and Ethan discuss and reach consensus. Document the resolution decision. These adjudicated cases are your gold standard — they also serve as a codebook extension, because recurring disagreement types become decision rules.

Build a living document: **"Edge Cases and Decision Rules"** — every time you resolve a hard case, add a brief entry. By the end of coding you'll have 30–50 entries. These go in the Appendix of the paper and are invaluable for reproducibility.

## 3.4 Taxonomy Validation Pass

After coding ~200 conversations, pause and look at the distribution. Ask:

- Are all five roles represented, or are some rarely occurring? If a role appears in fewer than 5% of conversations, either the data source doesn't capture it or the role definition is too narrow
- Are there consistent cluster of Ambiguous cases that suggest a missing role?
- Do any two roles have high confusion rates that suggest they should be merged?

This is where the taxonomy gets empirically grounded rather than just theoretically derived. You may need to revise role definitions, split a role, or collapse two. That's expected and scientifically appropriate — document it as iterative taxonomy refinement.
