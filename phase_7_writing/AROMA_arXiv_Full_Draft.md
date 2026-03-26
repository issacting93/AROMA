# AROMA: An Affective Role Ontology for Mental Health Agents

**Abstract**  
Recent years have seen a proliferation of conversational AI systems designed for mental health support. However, these systems often suffer from "role-locking"—assuming a static identity (e.g., "The CBT Coach") that fails to meet users' dynamic relational needs. We present **AROMA (Affective Role Ontology for Mental health Agents)**, a three-dimensional taxonomy that separates *what* is given (Support Type) from *who* the AI is being (Care Role). Grounded in social support (Cutrona & Suhr, 1992) and role theory (Biddle, 1986), AROMA identifies 6 stable care roles: Listener, Reflective Partner, Coach, Advisor, Companion, and Navigator. We validate AROMA through a structured literature synthesis of 203 papers and a multitask computational operationalization on the 18,376-turn ESConv corpus. Our findings reveal a structural **Authority-Agency Paradox**: a failure mode where systems claim clinical authority but lack the agency to fulfill the role’s obligations. We demonstrate that while off-the-shelf embeddings do not capture role structure, a multitask neural classifier can learn the AROMA dimensions, providing a path toward truly responsive AI-mediated care.

---

## 1. Introduction

Conversational AI for mental health is at a crossroads. While agents like Woebot and Wysa provide evidence-based interventions, they typically operate under a single, static system-level identity. In contrast, human care-providers fluidly transition between distinct relational stances—shifting from a receptive *Listener* when a client is venting, to a directive *Coach* when they are ready for goal-setting.

Following **Blumer (1969)** and **Mead (1934)**, we argue that care is enacted through *role-taking*—the process by which an actor reads the user's expressed state and calibrates their stance accordingly. Current AI role-rigidity stems from a conceptual conflation of *Support Type* and *Care Role*. This conflation obscures the **Authority-Agency Paradox**: users project clinical authority onto an agent, but the agent lacks the structural agency (**Parsons, 1951**) to fulfill that role's social obligations.

## 2. The AROMA Taxonomy

AROMA is a 3D taxonomy designed to decouple content from stance and strategy:

### 2.1 D1: Support Type (Content)
*Grounded in Cutrona & Suhr (1992) SSBC and Lazarus & Folkman (1984).*
Describes the *what* of the interaction: Emotional, Informational, Esteem, Network, Tangible, and Appraisal support.

### 2.2 D2: Care Role (Relational Stance)
*Grounded in Biddle (1986), Blumer (1969), and Parsons (1951).*
Describes the sustained relational stance across a sequence (3–5 turns). AROMA identifies 6 roles derived from literature synthesis:

| Role | Description | Identification Markers | Paradox Risk |
|:---|:---|:---|:---|
| **Listener** | Receptive, non-directive | Minimal encouragers, follows user lead entirely. | Low |
| **Reflective Partner** | Socratic, exploratory | Cognitive reappraisal prompts, "Mirroring" patterns. | Low |
| **Coach** | Directive, motivating | Goal-setting, change-talk elicitation (MI). | Moderate |
| **Advisor** | Authoritative, expertise-led | Psychoeducation, direct advice, clinical vocabulary. | **High** |
| **Companion** | Warm, persistent presence | Reciprocal disclosure, shared longitudinal references. | Low |
| **Navigator** | Practical, resource-oriented | Triage questions, external system referrals. | **High** |

### 2.3 D3: Support Strategy (Tactics)
*Grounded in Hill (2009) and Liu et al. (2021) ESConv.*
The concrete, turn-level conversational move (e.g., Question, Reflection of Feelings, Self-disclosure).

## 3. Methodology & Dataset

### 3.1 Literature Synthesis
We synthesized 203 papers (2015–2025), consolidating 34 distinct literature terms. We found that "Listener" and "Reflective Partner" are the most common but under-termed roles in existing research.

### 3.2 Computational Pipeline
We operationalized AROMA on the **ESConv corpus** (18,376 turns) using:
1. **LLM-as-Judge**: Claude 3 Haiku for full-corpus D1/D2 annotation.
2. **Multitask Embedding Probe**: A neural network (MiniLM-L6-v2) trained on 385 gold-standard turns.

## 4. Empirical Results

### 4.1 The Shared Map: Unified Latent Space
Our multitask model organizes the 18k turns into a "Shared Map"—a 128-dimensional bottleneck where all three dimensions are encoded simultaneously.

![The AROMA Shared Map](file:///Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/figures/final/combined_shared_map.png)

### 4.2 Global Correlation & Orthogonality
Analysis of the full corpus confirms that D1, D2, and D3 capture independent interactional features.

| Support Type × Care Role (D1×D2) | Care Role × Strategy (D2×D3) |
|---|---|
| ![Full D1xD2](file:///Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/figures/final/full_d1_d2_heatmap.png) | ![Full D2xD3](file:///Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/figures/final/full_d2_d3_heatmap.png) |

**Key Finding**: Every role utilizes multiple support types. For instance, **Reflective Partners** provide Emotional, Informational, and Appraisal support, proving that D2 (Role) is not a proxy for D1 (Support Type), but a distinct interactional layer.

### 4.3 Global Interactional Flow
The Sankey diagram visualizes the aggregate flow across 18,296 turns, documenting how Support Types (D1) branch into diverse Roles (D2) and Strategies (D3).

![Full AROMA Flow](file:///Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/figures/final/full_sankey.png)

## 5. Conclusion
AROMA provides an analytical lens for evaluating the safety and efficacy of AI-mediated care. By treating relational stance (D2) as orthogonal to content (D1) and strategy (D3), we enable the design of agents that navigate the Authority-Agency Paradox safely.

---
*Target Venue: ArXiv / CHI 2027*
