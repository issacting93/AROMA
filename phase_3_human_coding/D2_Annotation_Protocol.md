# D2 Care Role Annotation Protocol (v1.0)

This protocol defines the procedure for identifying and coding **D2 Care Roles** in conversational data. 

## 1. The Unit of Analysis (Sequence vs. Turn)
- **Do not code roles turn-by-turn.** A single utterance (D4) does not constitute a role.
- **Unit of observation:** A conversational sequence of **3–5 turns**. 
- **Coding rule:** Identify the **stable relational stance** that governs the sequence. If the stance shifts, mark a *Role Transition*.

## 2. The D2 Decision Tree

To identify the role, ask these three questions in order:

### Q1: Is the AI Following or Leading?
- **Following (Non-directive):** AI mirrors the user, validates, and remains receptive.
  - *Result:* Likely **Listener** or **Companion**.
- **Leading (Directive):** AI structures the inquiry, sets goals, or provides information.
  - *Result:* Move to Q2.

### Q2: Is the focus on the Internal State or External Action?
- **Internal State (Exploratory):** AI facilitates the user's own insight or reframing.
  - *Result:* **Reflective Partner**.
- **External Action (Goal-oriented):** AI focuses on what the user should do next.
  - *Result:* Move to Q3.

### Q3: Is the AI providing the Information or the Accountability?
- **Information/Expertise:** AI provides psychoeducation, treatment options, or clinical knowledge.
  - *Result:* **Advisor**.
- **Accountability/Motivation:** AI supports goals the user has already chosen, building self-efficacy.
  - *Result:* **Coach**.
- **System Bridge:** AI is specifically helping the user find external resources beyond the chat.
  - *Result:* **Navigator**.

---

## 3. Marker Move Signatures (D4 → D2)

While a single move isn't a role, these clusters are strong predictors:

| Care Role | D4 Marker Move Cluster (The "Signature") |
| :--- | :--- |
| **Listener** | Empathetic Reflection + Paraphrasing + Minimal Encouragers |
| **Reflective Partner** | Socratic Questioning + Reappraisal Prompts + Summary w/ Invitation |
| **Coach** | Goal-setting + Change-talk Elicitation + Progress Review |
| **Advisor** | Psychoeducation + Decision-framing + Uncertainty Disclaimer |
| **Companion** | Warm Check-ins + Reciprocal Disclosure + Shared Reference |
| **Navigator** | Resource Listing + Warm Handoff + Crisis Protocol |

---

## 4. Coding Role Transitions
A transition occurs when the AI's stance shifts (e.g., from validating to advising). 
- **Identify the Trigger:** Did the user's distress level change? Did a safety signal appear?
- **Code the Flow:** `Listener (T1-T4) -> Navigator (T5-T7)`.

## 5. Identifying the Authority-Agency Paradox
When coding, flag instances where the AI adopts a **High Paradox** role (*Advisor/Navigator*) but fails to provide the necessary "agency" (e.g., gives a cold link for a crisis or provides medical advice without caveats).
