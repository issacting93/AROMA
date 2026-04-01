# AROMA Calibration Report #1: Executive Summary

**Date:** 2026-03-28  
**Scope:** Phase 1 Calibration (ESConv 0–24)  
**Method:** 2 Coders | 50 paired sequences (5 turns each) | Double-coded

---

## 🏗️ 1. Overview: Purpose of Calibration
The goal of this pilot was to test how accurately our **AROMA Taxonomy** describes real-world peer support data (ESConv). While initial reliability scores are low, the patterns are **systematic and addressable**. The low scores reflect a "threshold problem"—coders see the same thing but disagree on *when* behavior becomes support.

### Performance Summary
| Dimension | Cohen's κ | Identification | Interpretation |
| :--- | :--- | :--- | :--- |
| **Seeker Stance** | 0.349 | Good | Foundational agreement is clear |
| **D1 Support Type** | 0.156 | Slight | Threshold problem (Emotional vs None) |
| **D2 Care Role** | 0.114 | Slight | Transition problem (Listener vs RP) |

> [!TIP]
> **Key Insight:** A "Slight" kappa of 0.114 doesn't mean the taxonomy is failing; it means our 5-turn window was too narrow to capture role-emergence clearly.

---

## 🎯 2. Seeker Stance (Foundational Data)

The seeker's posture (Phase 1) is the core context for all downstream coding.

![Seeker Stance Distribution](fig0_stance_distribution.png)
**What this shows:** Most seekers in ESConv are **Passive**. They are venting or expressing distress but haven't yet formulated a request.

![Seeker Stance Confusion Matrix](fig5c_stance_confusion_matrix.png)
**So What?**: Our biggest confusion is between **Active vs Passive** (where venting ends and requests begin). **Exploratory** stances are almost entirely absent in this corpus, suggesting crowd-sourced support is less self-reflective than clinical data.

---

## 🧩 3. Care Role Divergence (The "Onboarding" Problem)

We identified a primary cluster of disagreement in D2 (Care Role).

![D2 Confusion Matrix](fig5_d2_confusion_matrix.png)

**The Failure Mode:** 63% of disagreements happen within the **None/Listener/Reflective Partner triad**. 
- Coders are "drifting" between passive listening and active mirroring.
- **Problem:** When is a question just a question, and when is it "Support"?
- **Solution:** We are adding the **"Small Talk" Threshold rule** (Greetings = None; Welfare questions = Listener).

---

## 📈 4. The 12-Turn Rationale (Crucial Finding)

This is the most actionable data point from the pilot.

![Agreement by Sequence Position](fig12_agreement_by_position.png)

**The Discovery:** Agreement roughly **doubles** in later turns (7-12) compared to early turns (2-7).
- **Explanation:** Five turns at the start of a conversation are too ambiguous. Roles take time to emerge.
- **Change:** For Phase 2, we are moving to **12-turn windows** to provide the necessary relational context.

---

## 🧬 5. Validating the Relational Logic

Despite low inter-rater scores, our internal taxonomy logic is robust.

![D2-D3 Cross-tabulation](fig14_d2_d3_crosstab.png)
**Validation:** When a coder selects "Advisor," they consistently select "Providing Suggestions" in D3. This proves that the individual coders are internally consistent—we just need to align their thresholds.

![Team Combined Flow](fig15_team_combined_flow.png)
**The Relational Signature:** This Sankey diagram shows our "Big Picture." It visualizes how seeker distress (Phase 1) is processed through support types (D1) and care roles (D2). It confirms that **Emotional Support** is our most common intervention, followed by directive **Information Giving**.

---

## 🚀 6. Phase 2 Refinements (The "Post-Adjudicated" Protocol)

Based on the reconciliation meeting, we are implementing these three shifts:

### A. The "Support Trigger" Rule
- **None** = Small talk, greetings, weather.
- **Support** = Must include a direct question on welfare or a specific actionable suggestion.
- *"How are you?"* is not yet support.

### B. Scaled Perception (Likert 0-5)
Instead of picking one "Primary" role, coders will rate all roles on a **0-5 intensity scale**:
- **0** = Not present.
- **1** = Minimal trace.
- **5** = Dominant stance.
- *This captures transitions and mixed-role behavior more accurately.*

### C. Duration Adjustment
- **New Unit of Analysis:** 12-turn sequences.
- *Starting Batch 2 with turns 1-12 to maximize the "relational signal."*

---

> [!IMPORTANT]
> **Goal:** These changes target $\kappa > 0.60$ for our CHI '26 submission by resolving the "resolution" and "threshold" problems identified in this report.

