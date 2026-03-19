# AROMA: A Multi-Dimensional Taxonomy of Caregiving Roles in AI-Mediated Mental Health Support

## Abstract
The core contribution of this work is **AROMA, a multi-dimensional role ontology for AI care** that enables designers to detect and mitigate the **Authority-Agency Paradox**—the structural failure mode in which AI systems adopt authoritative social roles without the corresponding agency or accountability. Current AI mental health systems suffer from **role-locking**: a design paradigm where agents are fixed to a single, static relational posture (e.g., Coach) regardless of shifting user needs. We present a three-part contribution: (1) we formalize the Authority-Agency Paradox as a theoretical lens for AI ethics; (2) we provide a six-role taxonomy validated against a 144-paper systematic review; and (3) we demonstrate how this framework enables concrete design decisions for stance-calibration in supportive HCI.

---

## 1. Introduction
The field of AI-mediated mental health support currently suffers from a fundamental conceptual conflation: it routinely confuses *Support Type* (what is being given) with *Care Role* (who the system is being). While established behavioral codes like Cutrona & Suhr's (1992) define *types* of support, they lack a mechanism for defining the relational *stance* of the provider. 

This leads to a pervasive problem we term **role-locking**: the structural inability of current AI agents to transition fluidly between relational identities. Woebot is permanently a CBT Coach; Replika is permanently a Companion. In contrast, effective human caregiving is dynamic. Real-world supporters fluidly calibrate their stance—shifting from an empathic *Listener* during acute venting to an *Advisor* during guidance. AROMA provides the ontological leverage to design systems that mirror this human fluidity while avoiding the ethical traps of unearned AI authority.

## 2. Theoretical Contribution: The Authority-Agency Paradox
Human care relationships are governed by a **structural binding** of mutual obligations (Parsons, 1951). In the "sick role" model, the patient is bound to seek competent help and commit to recovery, while the provider is bound by institutional accountability and the obligation to act in the patient's interest. This mutual binding is what makes the relationship *therapeutic*—it is not merely a conversational exchange but an ethical contract.

AI interactions break this contract by creating a structural **obligation gap**. The agent enacts the *behavioral surface* of a role (e.g., giving advice) without the *institutional capacity* to fulfill that role's obligations (e.g., accountability for outcomes). This creates the **Authority-Agency Paradox**: the system claims the authority of a role without the commensurate agency to honor it. 

Following the logic of the **therapeutic misconception** (Appelbaum et al., 1982)—originally defined in clinical trials where patients confuse research for treatment—we argue that "role-locked" AI induces a similar distortion. Users project relational authority onto the system, acting as if they are in a governed care relationship, while the system structurally lacks the agency to act on that projection. AROMA's core theoretical contribution is formalizing this paradox as a function of the mismatch between the AI's *interactional role* and its *systemic agency*.

## 3. The AROMA Framework
To address the paradox, we propose AROMA, a multi-dimensional role ontology. AROMA separates the *what* (Support Type) from the *how* (Support Strategy) and the *who* (Care Role), allowing designers to calibrate system stances to avoid unearned authority.

### 3.1 Taxonomy Validation: The 4-Test Framework
We validate the AROMA taxonomy through a four-test robustness framework:
1.  **Discriminant Test**: Identifying unique "marker moves" for each role to ensure non-redundancy.
2.  **Data Coverage Test**: Testing the taxonomy against 144 papers to ensure exhaustive coverage of care archetypes.
3.  **Theoretical Alignment Test**: Verifying that roles follow the "Role-Taking" enactment mechanism (Blumer, 1969).
4.  **Paradox Stress-Test**: Validating that "High Paradox" roles (e.g., Advisor) accurately predict the safety failures observed in the literature.

## 4. The 6 AROMA Roles: A Paradox Gradient
Our synthesis identifies 6 core roles, categorized by their structural risk within the Authority-Agency Paradox:

| Paradox Risk | Roles | Mechanism | Design Response |
| :--- | :--- | :--- | :--- |
| **Low** | Listener, Reflective Partner, Companion | Social/relational roles where AI agency is not expected. | Optimise for warmth and attunement. |
| **Moderate** | Coach | AI assumes directive stance but cannot enforce real-world accountability. | Add readiness detection and capacity assessment. |
| **High** | Advisor, Navigator | AI claims clinical authority (diagnosis/referral) it cannot systemically honor. | Mandate **epistemic humility** and warm-handoff protocols. |

## 5. Design Implications: From Paradox to Stance Calibration
What can a designer do with AROMA that was not possible before? Consider a system like **Woebot**, which is currently locked into a **Coach** role. When a user discloses acute grief, a Coach-locked system may prematurely push for "behavioral activation" (e.g., "Why don't you try going for a walk?"), which can feel dismissive or inducing of shame.

Using AROMA, a designer can set **Stance Calibration Rules**:
1.  **Detection**: Recognize high-negative-affect keywords and low-controllability stressors.
2.  **Transition**: Manually or automatically trigger a role-shift from **Coach** to **Listener**.
3.  **Execution**: Shift from D4 *Goal-setting* strategies to D4 *Empathetic Reflection* strategies.
4.  **Paradox Mitigation**: If the user pushes for clinical advice, the system invokes **Advisor** boundary conditions—explicitly communicating its epistemic limitations while maintaining a **Navigator** path to human help.

## 6. Conclusion
The Authority-Agency Paradox is a structural property of AI care, not a capability gap that can be "solved" with more data. AROMA provides the ontological leverage to navigate this paradox, shifting the design of AI mental health from static, "role-locked" agents to dynamic, stance-calibrated supporters. By formalizing the obligation gap and providing a validated taxonomy of care roles, we enable the next generation of supportive HCI to be both relationally fluid and ethically grounded.
