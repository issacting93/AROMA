# AROMA Phase 1: Calibration & Progress Report

This report summarizes the findings from the Phase 1 Annotation Calibration (Pilot) and outlines the resulting protocol refinements for Phase 2.

---

## 📊 Summary of Initial Agreement (IRR)

The initial pilot involved **25 dual-coded conversations (50 sequences)**. While the raw agreement was "Slight," the patterns were highly systematic, indicating a need for higher "resolution" in our observation windows rather than a flaw in the taxonomy itself.

| Dimension | Cohen's κ [95% CI] | Interpretation |
| :--- | :--- | :--- |
| **Seeker Stance** | 0.349 | Fair |
| **D1 Support Type** | 0.156 | Slight |
| **D2 Care Role** | 0.114 | Slight |

---

## 🔍 Key Findings & Explanations

### 1. The Seeker Stance (Phase 1)
The foundational categorization of the seeker's relational posture shows the highest reliability but persists in **Active ↔ Passive** confusion.

![Seeker Stance Distribution](file:///Users/zac/Documents/Documents-it/AROMA/phase_3_human_coding/calibration_report_01/fig0_stance_distribution.png)

> [!NOTE]
> **Exploration Gap:** We found very few "Exploratory" stances. This suggests that crowd-sourced seekers in ESConv tend to either vent (Passive) or direct-ask (Active), rarely entering deep self-reflection within 5 turns.

### 2. Systematic Divergence: The "Role Onset" Triad
63% of all Care Role (D2) disagreements occurred within the **None/Listener/Reflective Partner** triad. 

![D2 Confusion Matrix](file:///Users/zac/Documents/Documents-it/AROMA/phase_3_human_coding/calibration_report_01/fig5_d2_confusion_matrix.png)

*   **Explanation:** Coders are identifying the same behaviors (Questioning, Validation) but disagree on where the "Support Role" begins.
*   **Resolution:** We are implementing a **"Small Talk" Threshold** rule—generic greetings are "None"; targeted welfare questions are "Listener."

### 3. The Sequence Length Effect (Crucial)
The data revealed that agreement **doubles** in later sequences compared to the start of the conversation.

![Agreement by Sequence Position](file:///Users/zac/Documents/Documents-it/AROMA/phase_3_human_coding/calibration_report_01/fig12_agreement_by_position.png)

*   **Finding:** 5-turn windows at the start of a conversation are too ambiguous.
*   **Action:** For Phase 2, we are extending the sequence window to **12 turns** to allow roles to emerge fully.

### 4. Taxonomy Flow (Sankey)
The relational flow from Seeker Stance through Support Type to Care Role shows the structural distribution of the AROMA framework.

![Team Combined Flow](file:///Users/zac/Documents/Documents-it/AROMA/phase_3_human_coding/calibration_report_01/fig15_team_combined_flow.png)

---

## 🧬 Protocol Refinements for Phase 2

Based on these results, we have updated the **Annotation Desk** and **Codebook (v0.3)**:

1.  **Window Extension**: Move from 5-turn sequences to **12-turn sequences**.
2.  **Likert Scoring**: Move from single-labels to **1-5 Likert scales** for D1 and D2 to capture intensity and mixed-role presence.
3.  **Refined Definitions**:
    *   **Emotional Support**: Must go beyond "How are you?" to include specific welfare concern.
    *   **Reflective Partner**: Triggered by any explicit restatement or paraphrasing.
4.  **Confidence Check**: Added a "Flag for Discussion" trigger for any sequence with a confidence score < 2.

---

## 🚀 Next Steps
*   **Adjudication**: Resolving the 35 priority D2 disagreements to align internal coder models.
*   **Calibration Batch 2**: Testing the 12-turn window and Likert scale on a fresh 25-sequence set.
*   **Target**: Achieve $\kappa > 0.60$ for the CHI '26 submission.
