# Phase 6 — Human Evaluation of Pipeline (weeks 22–24)

This closes the loop and is what makes the paper methodologically complete.

## 6.1 Sample for Evaluation

From the classifier's output on the test set, sample 100 conversations stratified by:
- High-confidence correct predictions
- High-confidence incorrect predictions
- Low-confidence predictions
- Edge cases (Ambiguous labels)

## 6.2 Blind Human Review

You (and optionally a third coder who hasn't seen the pipeline) review the pipeline's output without knowing the gold standard label. Rate each:
- Do you agree with the label? (Yes / Partially / No)
- If no, what would you label it?
- Is the error a category error (wrong role) or a boundary error (between two adjacent roles)?

## 6.3 Error Analysis

Systematically analyze where the pipeline fails. Categories of failure:
- **Role ambiguity failures:** Cases that are genuinely ambiguous in the data (the pipeline didn't fail — the task is hard)
- **Codebook boundary failures:** The pipeline consistently confuses two roles (e.g. Listener vs. Companion) — this suggests the boundary definition needs refinement
- **Out-of-distribution failures:** Conversation types the training data didn't cover
- **Authority-Agency failures:** Cases where the AI's linguistic behavior signals one role but its actual capacity is another — the pipeline codes the surface behavior but misses the structural mismatch

Document these and include in the Discussion section — they're theoretically interesting, not just methodological limitations.
