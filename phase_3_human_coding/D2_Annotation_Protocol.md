# D2 Care Role Annotation Protocol (v1.1)

This protocol defines the procedure for identifying and coding **D2 Care Roles** in conversational data. 

## 1. The Unit of Analysis (12-Turn Window)
- **Do not code roles turn-by-turn.** A care role is a relational stance that emerges over time.
- **Unit of observation:** A conversational sequence of **12 turns**. 
- **Rationale:** Pilot data shows that agreement doubles when sequences are extended to 12 turns, as early turns (1-5) are often too ambiguous for role-emergence.

## 2. Scoring Logic: Likert Intensity (0–5)
Instead of selecting a single "primary" role, coders score **each** of the 6 core roles on an intensity scale:
- **0 (None):** The role is entirely absent.
- **1 (Trace):** Minimal/incipient presence of the role.
- **3 (Moderate):** Clear evidence of the role's stance.
- **5 (Dominant):** The role is the primary driver of the sequence.

### The "Small Talk" Threshold
- **Small Talk = 0 Across All Categories.** Generic greetings ("How are you?"), weather, or holiday chat do not constitute support.
- **Support Trigger:** Support requires either (a) a direct question about the seeker's welfare/feelings, or (b) a specific actionable suggestion.

---

## 3. The D2 Decision Tree (Threshold Guide)

To identify the role intensity, evaluate the AI's stance along three axes:

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

## 4. Marker Move Signatures (D3 → D2)

While a single move isn't a role, these clusters are strong predictors for scoring intensity:

| Care Role | D3 Marker Move Cluster (The "Signature") |
| :--- | :--- |
| **Listener** | Empathetic Reflection + Paraphrasing + Minimal Encouragers |
| **Reflective Partner** | Socratic Questioning + Reappraisal Prompts + Summary w/ Invitation |
| **Coach** | Goal-setting + Change-talk Elicitation + Progress Review |
| **Advisor** | Psychoeducation + Decision-framing + Uncertainty Disclaimer |
| **Companion** | Warm Check-ins + Reciprocal Disclosure + Shared Reference |
| **Navigator** | Resource Listing + Warm Handoff + Crisis Protocol |

---

## 5. Identifying the Authority-Agency Paradox
When coding, flag instances where the AI adopts a **High Paradox** role (*Advisor/Navigator*) but fails to provide the necessary "agency" (e.g., provides clinical advice without humble inquiry). 

> [!CAUTION]
> **Paradox Risk:** Scores of 4+ in Advisor/Navigator paired with Passive user stances (Phase 1) trigger a critical Paradox Flag.

