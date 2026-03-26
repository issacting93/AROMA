# AROMA: Internal Framework Specification (v0.3) — DEPRECATED

> [!WARNING]
> **This document is deprecated and retained for historical reference only.** It describes an older 5-dimension version of the AROMA framework (D1–D5). The canonical framework has **3 dimensions**: D1 (Support Type), D2 (Care Role), D3 (Support Strategy). Old D3 (Core Function) was removed because it mapped 1:1 to D2 and failed Nickerson's conciseness criterion. Old D5 (Interaction Modality) was removed because it constrains implementation, not role structure. The Authority-Agency Paradox is now a cross-cutting finding (C1), not a dimension.
>
> **For the canonical framework, see:** `theoritical-framing.md`, `phase_7_writing/CHI_2027_AROMA_Draft.md`, or `phase_2_taxonomy/2.0_AROMA_Care_Role_Taxonomy.md`.

## Core Research Question

**"What is the role structure of AI-mediated mental health support interactions?"**

The goal is not to propose new clinical interventions, but to build a framework organising existing **Support Strategies** from the literature into a cohesive, three-dimensional role taxonomy.

*Claim:* No prior framework provides a unified, three-dimensional taxonomy (Support Type, Care Role, Support Strategy) specifically for AI-mediated mental health support interactions that accounts for the Authority-Agency Paradox.

---

## Theoretical Anchors

AROMA inherits its structural vocabulary from three cross-validated theoretical sources:

| Anchor | What it provides | AROMA dimension |
|--------|-----------------|-----------------|
| **Cutrona & Suhr (1992)** — Social Support Behavior Code | 5 support types: Emotional, Informational, Esteem, Network, Tangible | **D1 — Support Type** (direct inheritance) |
| **Biddle (1986)** — Role Theory | Theoretical warrant for distinguishing roles from functions — stable relational stance vs. discrete behavioral move | **D2 — Care Role** (conceptual foundation) |
| **Blumer (1969) / Mead (1934)** — Symbolic Interactionism | Role-taking as the enactment mechanism. Defines the annotation unit as a conversational sequence (3-5 turns), not a single utterance. | **D2 — annotation procedure** |
| **Hill (2009)** — Helping Skills | Stage-based helper response modes (Exploration, Insight, Action) providing the theoretical foundation for strategy execution | **D3 — Support Strategy** (theoretical foundation) |
| **ESConv / Liu et al. (2021)** | Computational operationalization of 8 mutually exclusive strategy categories with a pre-labeled dataset | **D3 — Support Strategy** (computational foundation) |
| **Feng (2009)** — Integrated Model of Advice-giving (IMA) | Sequential placement principle — preparatory moves create conditions for subsequent moves to land | **D3 — Support Strategy** (sequential grammar) |
| **Parsons (1951)** — The Social System | Mutual obligation / Structural Binding | **Authority-Agency Paradox** (cross-cutting) |
| **Nickerson, Varshney & Muntermann (2013)** — Taxonomy development method | Methodological warrant: ending conditions, combined top-down/bottom-up development | **Methodological justification** |


---

## D1 — Support Type (Need)

**Definition:** The foundational dimension identifying the specific need a user is expressing. It determines which Care Roles are appropriate. These are agnostic to who or what provides the care, and focus on only human needs.

**What it is not:** It is not the *role* the AI plays, nor the specific *action* (strategy) it takes. It is the underlying category of need.

**Theoretical lineage:** Cutrona & Suhr (1992) SSBC. Appraisal added from stress-and-coping literature (Lazarus & Folkman, 1984).

| Support Type | Addresses | Example utterance | Authority-Agency paradox |
|-------------|-----------|-------------------|----------------------|
| **Emotional** | Distress and the need to be heard | "That sounds really hard" | ⚠️ Moderate — expects understanding, not action |
| **Esteem** | Self-worth and perceived competence | "You've handled this before" | ⚠️ Moderate — praise without evidence undermines credibility |
| **Informational** | Knowledge gaps and uncertainty | "Here's what that medication does" | 🔴 High — Authority-Agency Paradox |
| **Network** | Isolation and connection to communities | "There are communities for this" | 🔴 High — AI cannot bridge, only point |
| **Tangible** | Practical needs and concrete help | "Here's a crisis line number" | 🔴 High — Maximum paradox; structural limit |
| **Appraisal** | Meaning-making and situational reframing | "That reaction makes sense given what happened" | ⚠️ Moderate — premature reframing before emotional processing |

> Full design space analysis per support type: see 0.2 — Support Type Design Space

---

## D2 — Care Role (Role)

**Definition:** A stable relational stance that an AI agent adopts toward a user in distress, characterised by a distinctive core function, a dominant support type, and a characteristic set of linguistic strategies — *enacted turn-by-turn through role-taking (reading the user's expressed need and calibrating stance accordingly)* — and that invites a complementary human role in return.

**Annotation unit (from Blumer/Mead):** A care role is not visible in a single utterance. It is identifiable across a **conversational sequence** (minimum 3–5 turns) as the AI reads and responds to the user's expressed state. A role transition is visible when the calibration pattern shifts. Role-locking — the failure mode AROMA documents — is the absence of this calibration.

**What it is not:** It is not the type of support given (D1) or the concrete strategy used (D3). It is the relational *stance*.

**Theoretical lineage:** Role Theory (Biddle, 1986); counseling/helping professions identity; relational agent literature.

**Inclusion criterion:** A care role is included in AROMA if it:
- (a) produces **distinct interactional behaviours** from all other included roles,
- (b) is supported by theoretical anchors and literature synthesis, and
- (c) follows Nickerson et al. (2013) ending conditions (no new dimensions, concise, robust, comprehensive).

Roles that fail any criterion are excluded or merged with the nearest neighbour. *The Connector role was evaluated and excluded: only 1 paper (Gabriel et al. 2024 peer-responder) met the archetype — below the ≥3 threshold. Peer-bridging is absorbed into Navigator's scope.*

| Role | Stance | Primary D1 | Invited human role | Authority-Agency paradox |
|------|--------|-----------|-------------------|----------------------|
| **Listener** | Receptive, non-directive | Emotional | Witness-seeker | Low |
| **Reflective Partner** | Curious, exploratory | Appraisal | Client, Explorer | Low |
| **Coach** | Directive, forward-looking | Esteem | Self-manager, Goal-seeker | Moderate |
| **Advisor** | Authoritative, informational | Informational | Patient, Student | **High** |
| **Companion** | Warm, co-present | Emotional | Peer-seeker | Low |
| **Navigator** | Practical, resource-oriented | Network, Tangible | Advocate-seeker | **High** |


---

## D3 — Support Strategy (Action)

**Definition:** The concrete, observable conversational tactics or interactions the system uses to execute its role. Coded at the turn-level.

**What it is not:** It does **not** propose new clinical interventions; it organises *existing* behavioural strategies from the literature into this role taxonomy.

**Theoretical lineage:** Hill (2009) Helping Skills model; ESConv taxonomy (Liu et al., 2021); Feng (2009) sequential placement principle.

**Categories (derived from ESConv):**
There are eight mutually exclusive strategy categories that operationalize how a role is enacted during a turn:
1. Question
2. Restatement/Paraphrasing
3. Reflection of Feelings
4. Self-disclosure
5. Affirmation and Reassurance
6. Providing Suggestions
7. Information
8. Others

---

## The Authority-Agency Paradox

A theoretical concept developed as part of AROMA that describes a structural problem in AI care relationships—not a capability gap, but an **obligation gap**.

> Drawing on Parsons (1951), AROMA argues that human care relationships are governed by **mutual obligation**: providers are bound to act competently and accountably; receivers are bound to commit to recovery. The **Authority-Agency Paradox** is the structural condition where AI care interactions dissolve these bindings on both sides—the agent receives authority without accountability, and the user receives support without reciprocal commitment. This destroys the **structural binding**—the mutual expectations—that makes human care therapeutic rather than merely comforting.

This paradox manifests differently across roles:

| Risk level | Roles | Mechanism |
|-----------|-------|-----------|
| **Low** | Listener, Reflective Partner, Companion | User does not project clinical authority; relational presence is sufficient without agency |
| **Moderate** | Coach | AI adopts directive stance but cannot enforce accountability |
| **High** | Advisor, Navigator | User projects clinical authority, expects intervention the AI structurally cannot deliver → **Authority-Agency Paradox** |

AROMA formalizes this as a structural byproduct of conversational AI: a tension between the *interactional role* performed by the AI and its *structural capacity* to act. When the behavioral surface of a care role is enacted without the obligation structure that makes that role legitimate, it leads to a **therapeutic misconception**—where users act as if they are in a governed, accountable care relationship when they are not.

---

## Scope and Limitations

AROMA taxonomises caregiving roles at the level of interaction turns, not clinical outcomes. It does not prescribe which roles a system should adopt in a given context — that is a design decision downstream of the taxonomy. It does not claim clinical validity; clinical validation would require outcome studies beyond the scope of this framework.

### What AROMA does not do
- Prescribe role selection for specific users or conditions
- Evaluate clinical outcomes or claim therapeutic efficacy
- Replace clinical judgment or professional supervision frameworks
- Address system-level architecture — only interactional behaviour

### Contributions
- **Provides the first formal account of the D1/D2 distinction** — separating support type from care role — the field's most persistent conflation — with theoretical warrant and systematic empirical grounding
- **Formalizes and extends the IMA** (Feng, 2009) beyond the advice-giving context into a full multi-role taxonomy applicable across all support types
- **Identifies structurally predictable failure modes** via the Authority-Agency Paradox, grounding AI design risk in a theoretically derived mechanism rather than anecdotal observation
- **Produces a reusable annotation pipeline** enabling systematic corpus analysis of AI mental health support interactions