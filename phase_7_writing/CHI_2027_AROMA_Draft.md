# AROMA: An Affective Role Ontology for Mental Health Agents

## 1. Introduction

Recent years have seen a proliferation of conversational AI systems designed to provide mental health and wellbeing support. From clinically-validated "coaches" like Woebot and Wysa to general-purpose "companions" like Replika, these agents are increasingly recruited by users as vendors of emotional, informational, and esteem support. However, current systems suffer from a fundamental interactional limitation: they are profoundly **role-locked**. 

A human care-provider fluidly transitions between distinct relational stances—shifting from a receptive *Listener* when a client is venting, to a directive *Coach* when they are ready for goal-setting, to a resource-oriented *Navigator* when a crisis emerges. In contrast, current AI agents typically operate under a single, static system-level identity. By assuming the permanent role of "The CBT Coach" or "The Virtual Friend," these agents lack the interactional flexibility necessary to match the dynamic needs of users in distress. This misalignment often results in "technological tone-deafness," where a system delivers technically accurate but relationally inappropriate support—for instance, providing cognitive reframing (Advisor) to a user who is still in the acute stage of emotional processing and requires only validation (Listener).

In this paper, we argue that this role-rigidity stems from a deeper conceptual gap in the field: the conflation of *Support Type* (what is being given) with *Care Role* (who the system is being). While existing taxonomies of social support effectively categorize the content of care, they lack a formal ontology for the relational stances that make that care effective. This conflation obscures a structural tension unique to AI caregiving, which we term the **Authority-Agency Paradox**: a phenomenon where users project clinical authority onto an agent, only for the agent to fail when it lacks the structural agency to fulfill that role’s social obligations (e.g., an "Advisor" that cannot diagnose or a "Navigator" that cannot book appointments).

To address this, we present **AROMA (Affective Role Ontology for Mental health Agents)**. Developed through a structured literature synthesis of 203 research papers (via OpenAlex and snowball searching), AROMA identifies 6 core care roles—**Listener, Reflective Partner, Coach, Advisor, Companion, and Navigator**—and maps them across three dimensions: Support Type (D1), Care Role (D2), and Support Strategy (D3). We demonstrate the necessity of this ontology by mapping diverse role-like terms from the literature onto these 6 stable relational stances, unifying a fragmented terminological landscape.

Our work is guided by three central **Research Questions**:
*   **RQ1**: What caregiving roles exist in AI-mediated mental health support interactions?
*   **RQ2**: How do AI care roles differ in the authority they claim and the obligations they can fulfill, and do these differences predict safety-critical failures?
*   **RQ3**: What design constraints does role-aware AI care require for systems to transition between roles while managing authority-obligation mismatches?

The contributions of this work are three-fold:
1.  **C1: The Authority-Agency Paradox**: A theoretical account of the paradox → obligation gap → therapeutic misconception causal chain, acting as a structural lens for evaluating AI care safety.
2.  **C2: The AROMA Taxonomy**: A three-dimension, six-role ontology for AI-mediated care, grounded in social support theory and validated through literature synthesis.
3.  **C3: A Multi-Dimensional Embedding Model**: A computational operationalization of the taxonomy that classifies conversational turns along AROMA's three dimensions simultaneously, validating the impact of role-locking empirically.

By treating the relational stance as orthogonal to the support strategy, AROMA provides the analytical leverage to move beyond role-locked agents toward truly responsive, interactional care systems.

