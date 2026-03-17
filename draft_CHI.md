# AROMA: A Multi-Dimensional Taxonomy of Caregiving Roles in AI-Mediated Mental Health Support

## Abstract
Current AI-mediated mental health systems often conflate the *type* of support provided with the *role* the system adopts. This "role-locking" results in systems that fail to mirror the dynamic fluidity of human caregiving. We present AROMA, a theoretically grounded taxonomy that separates Support Type (D1) from Care Role (D2), linked via Core Functions (D3) and Support Strategies (D4), constrained by Interaction Modality (D5). We identify a central structural problem in AI care—the **Authority-Agency Paradox**—where systems claim authority without the commensurate agency or obligation required for legitimate care. We validate our six-role taxonomy through a synthesis of 144 research papers and a four-test robustness framework.

---

## 1. Introduction
The field of AI-mediated mental health support currently suffers from a fundamental conceptual conflation: it routinely confuses *Support Type* (what is being given) with *Care Role* (who the system is being). While established codes like Cutrona & Suhr's (1992) Social Support Behavior Code define types of support, they lack a mechanism for defining the relational stance of the provider. AI systems consequently default to static execution—Woebot is permanently a CBT Coach; Replika is permanently a Companion.

Effective caregiving is not static. Real-world supporters fluidly transition between roles—shifting from an empathic *Listener* during venting, to a *Reflective Partner* during processing, to an *Advisor* during guidance. AROMA formalizes this dynamic by extending role-taking theory (Blumer, 1969) and the Integrated Model of Advice-giving (Feng, 2009) into a unified ontology for AI design.

## 2. Theoretical Contribution: The Authority-Agency Paradox
Human care relationships are governed by a **structural binding** of mutual obligations (Parsons, 1951). The provider is bound by **competence and accountability**, while the receiver is bound by commitment to change. 

AI interactions dissolve this structure, creating an **obligation gap** where the agent receives authority without accountability, and the user receives support without commitment. This structural condition, which we term the **Authority-Agency Paradox**, leads to a *therapeutic misconception*—where users act as if they are in a governed care relationship when they are not. We argue that this paradox is not a capability failure but a structural property of conversational AI that must be addressed through relational design.

## 3. The AROMA Framework
To address the paradox, we propose AROMA, a multi-dimensional role ontology. AROMA separates the *what* (Support Type) from the *how* (Support Strategy) and the *who* (Care Role), allowing designers to calibrate system stances to avoid unearned authority.

### 3.1 Taxonomy Validation: The 4-Test Framework
We validate the AROMA taxonomy through a four-test robustness framework:
1.  **Discriminant Test**: Identifying unique "marker moves" for each role to ensure non-redundancy.
2.  **Data Coverage Test**: Testing the taxonomy against 144 papers to ensure exhaustive coverage of care archetypes.
3.  **Theoretical Alignment Test**: Verifying that roles follow the "Role-Taking" enactment mechanism (Blumer, 1969).
4.  **Paradox Stress-Test**: Validating that "High Paradox" roles (e.g., Advisor) accurately predict the safety failures observed in the literature.

## 4. Derived Roles
Our synthesis identifies 6 core roles, each mapping to a specific risk profile within the Authority-Agency Paradox:
*   **Low Paradox**: Listener, Reflective Partner, Companion.
*   **Moderate Paradox**: Coach.
*   **High Paradox**: Advisor, Navigator.

## 4. Discussion: Mitigating Unearned Authority
Taxonomizing these roles allows designers to identify and mitigate high-risk "unearned authority." By separating the stance (D2) from the strategy (D4), we can design systems that detect when a role transition is warranted and execute it fluidly, mirroring the dynamic reality of human care while attending to the ethical constraints of AI agency.

---
*Draft generated on 2026-03-17*
