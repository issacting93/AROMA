# AROMA Code Refinement Report — Phase 3/4 IRR Analysis

**Date**: 2026-03-27 | **Data**: `aroma_annotations_2026-03-26.csv` (78 annotations, 28 paired calibration sequences)

---

## 1. Inter-Rater Reliability Summary

| Metric | D1 (Support Type) | D2 (Care Role) | Target (Acceptable) |
|--------|-------------------|-----------------|---------------------|
| **% Agreement** | 46.4% (13/28) | 35.7% (10/28) | 70% |
| **Cohen's Kappa** | 0.239 (Fair) | 0.153 (Slight) | 0.61+ (Substantial) |

**Interpretation**: Both dimensions fall well below acceptable thresholds. D2 kappa of 0.153 indicates agreement barely above chance. The taxonomy requires targeted codebook revisions before proceeding to production coding.

---

## 2. Coder Tendency Profiles

Understanding systematic differences between coders helps distinguish *codebook ambiguity* from *coder drift*.

| Dimension | Coder A (bf32f9) | Coder B (41f829) |
|-----------|------------------|------------------|
| **D2 top codes** | Listener (10), Advisor (8), RP (4), None (4) | Listener (10), RP (7), Advisor (6), None (3) |
| **D1 top codes** | Emotional (13), Informational (7), None (4) | Emotional (14), None (6), Informational (3) |

Key differences:
- Coder A assigns **Informational** 2.3x more than Coder B (7 vs 3) — suggests a lower threshold for labeling support as informational
- Coder B assigns **None** 1.5x more on D1 (6 vs 4) — suggests a higher threshold for any support being "active"
- Coder B leans toward **Reflective Partner** where Coder A chooses **Listener** — the primary D2 boundary problem

---

## 3. D2 (Care Role) Clashing Pairs — Ranked by Frequency

### 3.1 Listener vs. Reflective Partner (5 clashes — 28% of D2 disagreements)

**The problem**: The boundary between passive acknowledgment and active mirroring is undefined. Any sequence with questions + light paraphrasing triggers this disagreement.

| Sequence | Coder A | Coder B | Notes |
|----------|---------|---------|-------|
| ESConv_0 [2,7) | Listener | Reflective Partner | B: "only inquires about the user" |
| ESConv_1 [7,12) | Listener | Reflective Partner | B: "asking user to confirm the problem" |
| ESConv_4 [2,7) | Reflective Partner | Listener | A: "affirmation + clarifying questions" |
| ESConv_8 [7,12) | Listener | Reflective Partner | B: "just giving feedback and asking questions" |
| ESConv_10 [7,12) | Reflective Partner | Listener | (no notes) |

**Root cause**: "Asking clarifying questions" is ambiguous — it can be Listener (information-gathering) or RP (reflective probing). The codebook doesn't specify which.

**Recommendation**: Add a **Question Intent Rule**:
- Questions that gather new facts → **Listener** (e.g., "What happened?", "How long has this been going on?")
- Questions that mirror/reframe the seeker's own words → **Reflective Partner** (e.g., "So you're saying it feels like X?", "It sounds like that made you feel Y?")
- Any explicit paraphrasing or emotional labeling elevates to RP regardless of question presence.

---

### 3.2 Listener vs. None (4 clashes — 22% of D2 disagreements)

| Sequence | Coder A | Coder B | Notes |
|----------|---------|---------|-------|
| ESConv_1 [2,7) | None | Listener | |
| ESConv_7 [2,7) | None | Listener | A: "no support given at this point" |
| ESConv_12 [2,7) | Listener | None | |
| ESConv_13 [2,7) | Listener | None | |

**Root cause**: Early-sequence turns (all are [2,7)) often contain only greetings and initial problem elicitation. Coders disagree on whether "asking about the problem" = active listening or no support role yet.

**Recommendation**: Add an **Opening Sequence Rule**:
- If turns [2,7) contain only greetings, problem statement elicitation, or open-ended "tell me more" → **Listener** (not None)
- **None** should be reserved for truly empty/off-topic turns or system messages
- Rationale: Even initial elicitation is a form of attentive listening in the therapeutic context

---

### 3.3 Advisor vs. Reflective Partner (2 clashes)

| Sequence | Coder A | Coder B | Notes |
|----------|---------|---------|-------|
| ESConv_2 [2,7) | Advisor | Reflective Partner | A: "trying to provide advice"; B coded Question + Reflection |
| ESConv_6 [2,7) | Reflective Partner | Advisor | B coded Question + Self-disclosure + Affirmation |

**Root cause**: Sequences containing questions alongside gentle suggestions blur the Advisor/RP boundary. Coder A infers "intent to advise" even before explicit advice is given; Coder B codes the observable behavior.

**Recommendation**: Add a **Behavioral Evidence Rule** — code the *observed* role, not the inferred trajectory. Advisor requires at least one explicit suggestion or directive in the sequence. Questions + reflections without concrete suggestions = Reflective Partner.

---

### 3.4 Advisor vs. Listener (2 clashes)

| Sequence | Coder A | Coder B |
|----------|---------|---------|
| ESConv_2 [7,12) | Advisor | Listener |
| ESConv_5 [2,7) | Advisor | Listener |

**Root cause**: Coder A sees the overall conversation trajectory (heading toward advice-giving) and codes proactively. Coder B codes the local sequence only.

**Recommendation**: Reinforce the **Sequence-Local Coding Rule** — D2 is coded per-sequence, not per-conversation. If the current 5-turn window contains no advice, don't code Advisor based on what comes later.

---

### 3.5 Other D2 Clashes (1 each)

| Pair | Sequence | Notes |
|------|----------|-------|
| Advisor vs. Navigator | ESConv_3 [2,7) | A: "advice on isolation"; B: "navigating to other resources" |
| Navigator vs. RP | ESConv_5 [7,12) | A: "finding right solutions"; B coded Question only |
| None vs. RP | ESConv_9 [2,7) | Threshold disagreement again |
| Advisor vs. Coach | ESConv_11 [7,12) | A: "coaching/building self-esteem"; B: coded as Advisor |
| Listener vs. Ambiguous | ESConv_0 [7,12) | B explicitly flagged multi-type uncertainty |

**Navigator/Advisor recommendation**: Navigator = referral to external resources or process ("Let's try X resource", "Have you considered talking to Y?"). Advisor = direct behavioral suggestion ("You should do X"). If the suggestion points *outward*, it's Navigator; if it prescribes *action*, it's Advisor.

**Coach/Advisor recommendation**: Coach = builds the seeker's own capacity (Socratic, empowerment-oriented). Advisor = provides the answer directly. Test: does the turn give a fish (Advisor) or teach fishing (Coach)?

---

## 4. D1 (Support Type) Clashing Pairs — Ranked by Frequency

### 4.1 Emotional vs. None (5 clashes — 33% of D1 disagreements)

**The problem**: The zero-point threshold is undefined. Coder B assigns None more liberally (6 vs 4), especially in early turns where support is implicit rather than explicit.

**Recommendation**: Lower the threshold for Emotional — any warmth, empathy marker, or validation phrase (even "I understand", "That must be hard") counts as Emotional. None = purely transactional, empty, or system turns only.

### 4.2 Emotional vs. Informational (5 clashes — 33% of D1 disagreements)

| Sequence | Coder A | Coder B |
|----------|---------|---------|
| ESConv_2 [2,7) | Informational | Emotional |
| ESConv_2 [7,12) | Informational | Emotional |
| ESConv_5 [2,7) | Informational | Emotional |
| ESConv_6 [2,7) | Emotional | Informational |
| ESConv_6 [7,12) | Informational | Emotional |

**The problem**: This is the single most damaging pair. Turns frequently blend emotional validation with informational content. The codebook has no tiebreaker.

**Recommendation**: Add a **Primary Intent Rule**:
- If the turn's therapeutic function is to validate/comfort → **Emotional**, even if information is present
- If the turn's therapeutic function is to educate/inform → **Informational**, even if warmth wraps the delivery
- Heuristic: "Remove the information — does the turn still provide support?" If yes → Emotional. If the turn becomes empty → Informational.

### 4.3 Remaining D1 Clashes

| Pair | Count | Recommendation |
|------|-------|---------------|
| Emotional vs. Network | 1 | Network should only be coded when the *primary* intent is connecting to others, not when community is mentioned in passing |
| Emotional vs. Esteem | 1 | Esteem = explicit competence/worth affirmation ("You're capable of X"). General warmth = Emotional |
| Esteem vs. None | 1 | Same zero-point threshold issue |
| Ambiguous vs. Informational | 1 | Discourage "Ambiguous" as a code — force a primary-intent choice |
| Ambiguous vs. Emotional | 1 | Same — reserve Ambiguous for genuinely uncodeable turns only |

---

## 5. Double-Disagreement Sequences (Both D1 and D2 Wrong)

These 12 sequences (43% of all paired) had disagreements on *both* dimensions simultaneously — they represent the most ambiguous items and should be prioritized in the reconciliation meeting.

| Sequence | D1 Clash | D2 Clash |
|----------|----------|----------|
| ESConv_0 [2,7) | Emotional vs None | Listener vs RP |
| ESConv_1 [7,12) | None vs Emotional | RP vs Listener |
| ESConv_2 [2,7) | Informational vs Emotional | Advisor vs RP |
| ESConv_2 [7,12) | Emotional vs Informational | Listener vs Advisor |
| ESConv_3 [2,7) | Emotional vs Network | Advisor vs Navigator |
| ESConv_5 [2,7) | Informational vs Emotional | Advisor vs Listener |
| ESConv_6 [2,7) | Emotional vs Informational | RP vs Advisor |
| ESConv_7 [2,7) | None vs Emotional | None vs Listener |
| ESConv_9 [2,7) | None vs Emotional | None vs RP |
| ESConv_10 [7,12) | Esteem vs Emotional | RP vs Listener |
| ESConv_11 [7,12) | Esteem vs None | Coach vs Advisor |
| ESConv_12 [2,7) | Emotional vs None | Listener vs None |

---

## 6. Confidence & Stance Mismatch Patterns

**Confidence** (all 78 annotations): Mean ≈ 2.2. Only 3 annotations at confidence 1 (very unsure). Low confidence doesn't correlate obviously with disagreement — coders are confidently wrong, suggesting codebook ambiguity rather than self-aware uncertainty.

**Stance Mismatch** distribution:
- misfit: 23 (29%) — role doesn't fit well
- aligned: 22 (28%) — role fits the interaction
- misaligned_paradox_risk: 17 (22%) — authority-agency paradox risk
- N/A: 10 (13%)
- mild_misfit: 4 (5%)
- misaligned: 2 (3%)

Notably, 51% of all annotations flag some degree of misfit/misalignment, which may indicate that the ESConv data itself creates ambiguous role presentations (supportive peers rather than clear clinical roles).

---

## 7. Consolidated Codebook Revision Checklist

Priority-ordered changes for Codebook v0.6:

| # | Rule | Dimension | Expected Impact |
|---|------|-----------|-----------------|
| 1 | **Primary Intent Rule** — tiebreaker for mixed Emotional/Informational | D1 | Resolves 5 clashes (33% of D1 disagreements) |
| 2 | **Question Intent Rule** — fact-gathering vs reflective probing | D2 | Resolves 5 clashes (28% of D2 disagreements) |
| 3 | **Opening Sequence Rule** — elicitation = Listener, not None | D2 | Resolves 4 clashes (22% of D2 disagreements) |
| 4 | **Lower None Threshold** — any warmth = Emotional | D1 | Resolves 5 clashes (33% of D1 disagreements) |
| 5 | **Behavioral Evidence Rule** — code observed behavior, not inferred intent | D2 | Resolves 2 Advisor/RP clashes |
| 6 | **Sequence-Local Rule** — code the 5-turn window, not the conversation arc | D2 | Resolves 2 Advisor/Listener clashes |
| 7 | **Navigator vs. Advisor** — outward referral vs direct prescription | D2 | Resolves 1 clash, adds clarity |
| 8 | **Coach vs. Advisor** — "teach fishing" vs "give fish" | D2 | Resolves 1 clash, adds clarity |
| 9 | **Discourage Ambiguous** — force primary-intent choice | D1, D2 | Reduces uncodeable annotations |

---

## 8. Next Steps (Protocol Step 5 → 6 → 7)

1. **Reconciliation meeting**: Walk through the 12 double-disagreement sequences above. Reach consensus and document rationale.
2. **Codebook v0.6**: Implement the 9 rules above. Add 3-5 worked examples from the clashing sequences as Edge Cases (EC-13 through EC-17).
3. **Calibration Batch 2**: Code a fresh set of 25-30 sequences independently with the revised codebook.
4. **Target**: D1 kappa > 0.60, D2 kappa > 0.50 (moderate). If not met, iterate (Step 7).
5. **Production coding**: Only proceed once kappa targets are met on Batch 2.
