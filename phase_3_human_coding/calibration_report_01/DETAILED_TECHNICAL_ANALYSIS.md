# AROMA Phase 1: Detailed Technical Analysis & Adjudication Log

This report provides the full technical breakdown of the Phase 1 calibration pilot. It complements the [Executive Summary](calibration_report_01.md) with granular statistical analysis and the official adjudication log for Batch 1 disagreements.

---

## 🔬 1. Statistical Methodology & Reliability Benchmarks

### 1.1 Understanding Cohen's κ in Context
While our raw agreement on Seeker Stance was 80%, the Cohen's κ is **0.349**. This disparity occurs because κ corrects for the "base rate" of categories. Since "Passive" seekers dominate the corpus, agreement on that category is statistically likely by chance.

| Dimension | Exact % | Cohen's κ [95% CI] | Interpretation |
| :--- | :--- | :--- | :--- |
| **Seeker Stance** | 80% | 0.349 [0.028, 0.666] | Fair (Near-Chance at lower CI) |
| **D1 Support Type** | 40% | 0.156 [−0.022, 0.339] | Slight (Zero-crossing) |
| **D2 Care Role** | 30% | 0.114 [−0.028, 0.271] | Slight (Zero-crossing) |

> [!IMPORTANT]
> **Publication Gate:** For a CHI/CSCW submission, we require **κ > 0.60** for our primary dimension (D2). This analysis identifies the specific "noisy" boundaries we must resolve to hit that gate.

### 1.2 Aggregation Loss (Turn-to-Sequence)
ESConv ground-truth labels are **turn-level** (one strategy per message). AROMA annotations are **sequence-level** (one set of roles/strategies per 12-turn window). 
- **Aggregation logic:** We combine all 5-6 supporter turns within a sequence into a single "set."
- **Noise factor:** If a supporter uses *Question* in Turn 2 and *Reflection* in Turn 8, the ESConv set contains both. A human coder might only select the "dominant" one, leading to an artificial Jaccard mismatch.

---

## 🗂️ 2. The Adjudication Log: Top 10 Boundary Cases

The following sequences represented the most common disagreement "signatures" in Phase 1. They served as the basis for our [v0.3 Codebook](file:///Users/zac/Documents/Documents-it/AROMA/phase_3_human_coding/Codebook_v0.2.md) refinements.

| Sequence ID | Coder A | Coder B | Disagreement Type | Adjudication Resolution | New Rule Applied |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ESConv_0** | Advisor | None | Role Onset | Coder A saw advice; Coder B saw just intro. | **Small Talk Rule:** Greetings = None. |
| **ESConv_2** | Listener | RP | Synthesis Depth | Minimal paraphrasing is not RP. | **RP Threshold:** Requires reframing. |
| **ESConv_6** | Advisor | RP | Intent Ambiguity | "Have you tried X?" is Advisor intensity. | **Directive Questioning:** Score Advisor 3+. |
| **ESConv_9** | None | Listener | Welfare Inquiry | "How are you feeling?" counts as Support. | **Support Trigger:** Welfare = Listener. |
| **ESConv_14** | Advisor | Listener | Expertise Claim | Providing medical info = Advisor 4+. | **Paradox Flag:** Clinical info trigger. |
| **ESConv_18** | RP | None | Mirroring | Simple agreement is not RP 3+. | **Trace Rule:** Score RP as 1 (Trace). |
| **ESConv_19** | Advisor | Advisor | Agreed | High-confidence agreement on directive advice. | (Benchmark Case) |
| **ESConv_21** | Listener | RP | Summarization | Coder B over-detected "Synthesis." | **Restatement Rule:** Marker Move D4 check. |
| **ESConv_22** | None | Advisor | Hidden Directive | Suggestion buried in question. | **Latent Advisor:** Score Advisor 2+. |
| **ESConv_24** | Listener | None | Rapport Building | Basic listening before support starts. | **Listener Rule:** 1+ Question = Listener. |

---

## 📊 3. D3 Strategy Deep-Dive: Human vs. Ground-Truth

We compared our human annotations against the ESConv ground-truth strategy labels using **Cohen's κ per strategy**.

![D3 Kappa Heatmap](fig9_d3_kappa_heatmap.png)

### Key Observations:
1. **The Restatement Gap:** ESConv identifies 13 instances of "Restatement"; human coders identified only 4 (Coder A) and 2 (Coder B). 
    - **Finding:** Humans are "filtering" simple paraphrasing, while the ESConv dataset (machine-labeled) counts it as a strategy. 
    - **Correction:** We must explicitly train coders to identify *marker moves* even if they feel clinically insignificant.
2. **"Providing Suggestions" Alignment:** Coder A aligns well with the ground truth (κ=0.429), while Coder B under-detects directive advice. This confirms **Coder A's "Directive" profile**.
3. **Questioning:** This is the highest-volume category but shows only moderate agreement (κ=0.36). This is because nearly *all* turns include a question, making it a poor differentiator for roles.

---

## 🏜️ 4. Corpus Sparsity: The "Missing" Roles

Some roles were almost entirely absent (**Companion, Navigator**) or support types (**Appraisal, Network**).

### Analysis of Sparsity
- **Companion:** Requires a "shared history" or "longitudinal bond." Since ESConv is a single-session chat with a stranger, true Companion behavior is structurally impossible.
- **Navigator:** Requires referring to external professional systems (therapy, hotlines). Most ESConv supporters stay within the "friend/mentor" boundary.
- **Appraisal:** This is "Meaning Making." It requires the supporter to help the seeker see their crisis in a new light. Most crowd-workers simply validate ("I'm sorry") but don't reframe.

> [!TIP]
> **Research Strategy:** We should not remove these roles from the taxonomy. Instead, we will use a **supplementary corpus** (e.g., therapy transcripts or CBT-bot logs) to validate these "Dark Roles" in Phase 3.

---

## 🧪 5. Back-testing the Reconciled Rules

We back-tested our new v0.3 rules against the 35 Phase 1 disagreements to see how many would have been avoided:

| New Rule | Target Cluster | Resolution Rate (%) | Impact |
| :--- | :--- | :--- | :--- |
| **Small Talk Trigger** | Emotional vs None | 56% (5/9 cases) | **High**: Solves the biggest D1 noise point. |
| **Restatement → RP** | Listener vs RP | 0% (0/7 cases) | **Low**: Disagreement was about *intensity*, not label. |
| **Welfare Question** | Listener vs None | 43% (4/7 cases) | **Medium**: Stabilizes the role-onset boundary. |

**Conclusion:** Our shift to **Likert Intensity (0-5)** is more effective than "If/Then" labels because it allows coders to express the **ambiguity** of early turns without being forced into a binary "None vs Support" choice.
