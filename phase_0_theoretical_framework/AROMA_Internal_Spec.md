# AROMA: Internal Framework Specification (v0.3)

## Core Research Question

**"What is the role structure of AI-mediated mental health support interactions?"**

The goal is not to propose new clinical interventions, but to build a framework organising existing **Support Strategies** from the literature into a cohesive, five-dimensional role taxonomy.

*Claim:* No prior framework provides a unified taxonomy of caregiving roles specifically for AI-mediated mental health support interactions that accounts for role dynamics across interaction contexts.

---

## Theoretical Anchors

AROMA inherits its structural vocabulary from three cross-validated theoretical sources:

| Anchor | What it provides | AROMA dimension |
|--------|-----------------|-----------------|
| **Cutrona & Suhr (1992)** — Social Support Behavior Code | 5 support types: Emotional, Informational, Esteem, Network, Tangible | **D1 — Support Type** (direct inheritance) |
| **Biddle (1986)** — Role Theory | Theoretical warrant for distinguishing roles from functions — stable relational stance vs. discrete behavioral move | **D2 — Care Role** (conceptual foundation) |
| **Blumer (1969) / Mead (1934)** — Symbolic Interactionism | Role-taking as the enactment mechanism: roles are performed turn-by-turn through reading the user's expressed state and calibrating stance accordingly. Defines the annotation unit as a conversational sequence, not a single utterance. | **D2 — annotation procedure** |
| **Feng (2009)** — Integrated Model of Advice-giving (IMA) | Sequential communicative moves (emotional support → problem inquiry → advice) as empirical precedent for role-like behavior in supportive interactions | **D4 — Support Strategy** (methodological precedent); **D2 — Care Role** (extension) |
| **Daft & Lengel (1986) / Bickmore & Picard (2005)** — Media richness; long-term HCI relationships | Modality as a structural constraint on role viability — some roles cannot be instantiated in low-richness channels | **D5 — Interaction Modality** |
| **Parsons (1951)** — The Social System | Mutual obligation / Structural Binding | **Authority-Agency Paradox** (cross-cutting) |
| **Nickerson, Varshney & Muntermann (2013)** — Taxonomy development method | Methodological warrant: ending conditions, combined top-down/bottom-up development, distinction from typology | **Methodological justification** |


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

**What it is not:** It is not the type of support given (D1) or the concrete sentence uttered (D4). It is the relational *posture*.

**Theoretical lineage:** Role Theory (Biddle, 1986); counseling/helping professions identity; relational agent literature.

**Inclusion criterion:** A care role is included in AROMA if it:
- (a) appears in **≥3 independent papers** from the PRISMA synthesis (Phase 1),
- (b) produces **distinct interactional behaviours** from all other included roles, and
- (c) is **viable within at least one AI interaction modality**.

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

## D3 — Core Function (Goal)

**Definition:** The intended psychological outcome or functional goal that a Care Role aims to produce in a given context.

**What it is not:** It is not the literal action (D4), nor the overarching relational identity (D2). It is the bridge linking the role to the psychological outcome.

**Theoretical lineage:** Functional analysis in counseling psychology; goal-oriented dialogue systems research.

**On measurement:** The evaluation measures below are indicative self-report instruments drawn from the psychology literature. They are intended to guide future evaluation design, not to claim that AROMA itself produces clinical outcomes. All measures would require user-facing study protocols; they are outside the scope of the taxonomy itself.

| Role | Core function | Indicative evaluation measure |
|------|--------------|-------------------------------|
| **Listener** | Emotional validation — user feels heard | Perceived empathy scale; distress reduction (SUDS) |
| **Reflective Partner** | Insight generation — user reaches new understanding | Cognitive reappraisal inventory (Garnefski et al.) |
| **Coach** | Motivation and self-efficacy — user feels capable | Bandura's self-efficacy scales |
| **Advisor** | Decision support — user has clarity on options | Decisional Conflict Scale (O'Connor) |
| **Companion** | Emotional presence — user feels less alone | UCLA Loneliness Scale; social presence measures |
| **Navigator** | Resource discovery — user is connected to support | Referral uptake; service engagement rate |


---

## D4 — Support Strategy (Action)

**Definition:** The concrete, observable conversational tactics or interactions the system uses to execute its role and achieve its core function — for example, a specific open question, a self-disclosure statement, or a direct piece of advice.

**What it is not:** It does **not** propose new clinical interventions; it organises *existing* behavioural strategies from the literature into this role taxonomy.

**Theoretical lineage:** Feng (2009) IMA; ESConv taxonomy (Liu et al., 2021); HCI and NLP literature on emotional support conversations.

**Discrimination test:** *Can you say "the AI **uses** ___"?* If yes, it is a strategy. If you would say "the AI **is** a ___," it is a role (D2).

| Strategy category | Example tactics | Typical role |
|-------------------|----------------|-------------|
| Reflective listening | "It sounds like you're feeling..." | Listener |
| Open emotional questions | "What's that been like for you?" | Listener, Reflective Partner |
| Socratic questioning | "What would happen if you tried...?" | Reflective Partner |
| Goal-setting | "What's one small step you could take?" | Coach |
| Psychoeducation | "Anxiety often manifests as..." | Advisor |
| Resource signposting | "Here's a link to..." | Navigator |
| Encouragement / affirmation | "You've already shown real strength here..." | Coach, Companion |
| Reframing | "Another way to look at this might be..." | Reflective Partner |

---

## D5 — Interaction Modality (Channel)

**Definition:** The communicative medium through which the AI system operates, which acts as a structural constraint on which Care Roles and Support Strategies are viable.

**What it is not:** It is not merely a deployment preference; it is a first-class theoretical boundary on interactional capacity.

**Theoretical lineage:** Media Richness Theory (Daft & Lengel, 1986); Relational Agent research (Bickmore & Picard, 2005).

**Note on position in the framework:** D5 is not a terminal step in a linear sequence. It is a cross-cutting constraint that operates on all other dimensions — a given modality limits which support types can be fully delivered (D1), which roles are structurally viable (D2), which outcomes are achievable (D3), and which strategies can be executed (D4). It is listed last because it is the dimension most specific to AI systems and has no equivalent in human-human care literature.

**This is AROMA's AI-specific dimension** — the parallel of Shen et al.'s "Desired Values for AI Tools" category.

| Modality | Affordances | Best-suited roles | Limitations |
|----------|------------|-------------------|------------|
| **Text chat** (e.g., Woebot) | Anonymity, reflection time, re-readability, low barrier | Advisor, Navigator | Lacks paralinguistic cues; reduces Listener/Companion viability |
| **Voice** (e.g., Hume AI) | Paralinguistic cues, emotional tone, turn-taking dynamics | Coach, Listener | No visual presence; less re-readable |
| **Avatar** | Nonverbal signals, gaze, facial expressions, embodied presence | Listener, Companion | Uncanny valley risk; high production cost |
| **Robot** (e.g., Paro) | Physical presence, touch, spatial co-location | Companion | Limited linguistic capacity |
| **Ambient / Wearable** | Passive monitoring, real-time physiological sensing | Listener (detection), Navigator (alerts) | No conversational depth; cannot enact most strategies |

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
- **Establishes interaction modality as a first-class design constraint**, providing the first role-modality fit analysis for AI mental health systems
- **Produces a reusable annotation pipeline** enabling systematic corpus analysis of AI mental health support interactions