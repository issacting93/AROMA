Here are the dimension descriptions for D1–D3, each grounded in the argument chain:

---

**D1 · Support Type**
*Theoretical anchor: Cutrona & Suhr (1992)*

The categorical vocabulary of support, drawn directly from Cutrona & Suhr's Social Support Behaviors Code: emotional, informational, esteem, tangible, network, and appraisal (the sixth type extended from Lazarus & Folkman, 1984). Support Type describes the *content* of what is being offered in a care interaction — not how it is delivered, not by whom, and not under what conditions. It is the most atomistic dimension of the taxonomy: a single utterance can be classified by support type independent of the role adopting it or the strategy enacting it. AROMA inherits this vocabulary wholesale and applies it to AI-mediated care contexts.

---

## The Authority–Agency Paradox

AI-mediated care systems routinely adopt roles that imply **institutional authority** — such as advisor, coach, or therapist — through their language, structure, and interaction patterns. However, unlike human role occupants, these systems lack the corresponding **agency, accountability, and obligation structures** that make such authority legitimate.

This creates a structural inconsistency:

> The system performs **role-based authority signals** without satisfying the **institutional conditions required to ground that authority**.

We term this the **Authority–Agency Paradox**.

In classical role theory, authority is not merely behavioral — it is **institutionally sanctioned and normatively bounded** (Parsons, 1951). Roles derive legitimacy from recognized scope of action, accountability mechanisms, and mutual expectations between role participants. AI systems violate this structure by exceeding legitimate scope (e.g., offering clinical judgment without qualification), lacking accountability for outcomes, and failing to signal the limits of their role.

AROMA addresses this paradox by encoding **boundary conditions** within D2 (Care Role), ensuring that role enactment is constrained by what the role can legitimately claim to do.

---

**D2 · Care Role**
*Theoretical anchors: Biddle (1986), Blumer (1969), Parsons (1951), Cutrona & Russell (1990)*

The stable relational stance the AI adopts across an interaction or interaction phase. Care Role is not a behavioral description of individual turns but a sustained relational stance that shapes which support types are foregrounded, which strategies are employed, and which boundary conditions apply. AROMA identifies six care roles: Listener, Reflective Partner, Coach, Advisor, Companion, and Navigator.

Each role carries two theoretically grounded properties:

**Boundary conditions** (after Parsons): the scope of what a role can legitimately claim to do, derived from the mutual obligation structure of care relationships. A role's authority is only legitimate insofar as it operates within its sanctioned bounds. A Navigator can direct users to clinical resources; it cannot provide clinical judgment. A Companion can offer sustained emotional presence; it cannot function as a therapeutic intervention. These are not design preferences — they are the conditions under which the role's authority is institutionally coherent.

**Activation conditions** (after Cutrona & Russell's Optimal Matching Model): the user need states under which each role is most appropriate. Effective support is a function of fit between support offered and stressor characteristics and coping resources of the recipient. High agency and controllable stressors favor Advisor and Coach roles; acute distress and low controllability favor Listener and Companion roles; navigation needs (system complexity, access barriers) activate the Navigator role. A taxonomy that names roles without specifying when each role is indicated is descriptive but not prescriptive — the activation conditions are what **positions AROMA as a candidate framework for prescriptive design**.

While AROMA encodes activation conditions that specify when roles are theoretically appropriate, the current work focuses on establishing **representational validity and annotation reliability**. The prescriptive application of these conditions for real-time system behavior remains an area for future work.

---

## Pre-Role Interaction and Role Onset

AROMA's theoretical framing treats Care Roles (D2) as stable relational stances sustained across an interaction segment. However, empirical calibration reveals that not all interaction turns instantiate a role immediately. In early interaction phases — particularly in the first few conversational turns — systems frequently produce **pre-support behavior**: utterances that establish context, acknowledge input, or perform conversational grounding without yet enacting a care role.

We define this phase as **pre-role interaction**, operationalized in annotation through the *None* label. Pre-role interaction serves three functions:

1. **Context establishment** — clarifying user intent and situation.
2. **Relational alignment** — acknowledging presence without yet offering support.
3. **Support readiness** — preparing the conditions under which support can be meaningfully delivered.

A Care Role is considered *activated* only when a **Support Trigger** is met: the point at which an utterance provides identifiable support (emotional, informational, or otherwise) aligned with D1. This extension refines AROMA's theoretical model:

> Roles are not assumed to be continuously active; they are **conditionally activated** based on interactional thresholds.

This distinction is critical for both annotation reliability and system design, as it separates **interaction scaffolding** from **support delivery**, preventing premature or inappropriate role assignment.

---

**D3 · Support Strategy**
*Theoretical anchors: Hill (2009), Liu et al. (2021), Feng (2009)*

The concrete, observable conversational tactic the system uses to execute its role. Coded at the turn level. Where Care Role (D2) describes a stable relational stance across a sequence, Support Strategy describes what a specific turn is *doing* — the communicative move it performs at that moment. A single Care Role can employ multiple strategies across a session: a Companion might use self-disclosure in one turn, affirmation in the next, and an open question in the third, without shifting its relational stance.

This dimension is grounded in Hill's (2009) Helping Skills model, which organizes helper response modes into three stages (Exploration, Insight, Action), and operationalized through Liu et al.'s (2021) ESConv taxonomy of 8 mutually exclusive strategy categories: Question, Restatement/Paraphrasing, Reflection of Feelings, Self-disclosure, Affirmation and Reassurance, Providing Suggestions, Information, and Others.

AROMA adopts the ESConv taxonomy because it provides a **mutually exclusive and interactionally grounded classification** of support behaviors at the turn level. Unlike broader helping frameworks, ESConv operationalizes strategies in a way that is directly compatible with annotation, enabling reliable coding and downstream computational modeling. The labels are not theory-imposed categories applied to naturalistic data — they are empirically derived from the same class of AI-mediated support interactions AROMA is designed to describe, which grounds D3's construct validity in ecological context.

Feng's (2009) sequential placement principle further establishes that strategies are not independent units but **temporally structured moves**, where earlier turns condition the interpretability and effectiveness of subsequent ones. This provides the theoretical basis for modeling strategy not just as classification, but as **ordered interactional composition** — a property that directly motivates the sequential modeling approach in Phase 5.

The D2/D3 distinction is a central conceptual contribution of AROMA: prior taxonomies — including Vaidyam et al. (2019), Gaffney et al. (2019), and Stade et al. (2024) — collapse role and strategy into a single label, implying that a Coach always does coaching things and a Companion always does companion things. AROMA treats them as independent: role is relational stance, strategy is conversational action. A Coach can validate; a Listener can provide information. The taxonomy does not prohibit strategic flexibility within a role — it makes that flexibility visible and designable.

---

Taken together, these theoretical anchors determine the taxonomy's architecture. Cutrona & Suhr's support type vocabulary establishes the categorical foundation of D1, providing a principled set of terms for what care interactions offer. The Optimal Matching Model establishes that support appropriateness is contingent on individual need states, which is why D2 encodes not just what each care role is but when it is indicated. Parsons' sick role theory establishes that care roles carry legitimate authority only within institutionally sanctioned bounds, which is why D2 encodes boundary conditions — without these, the taxonomy cannot address the Authority-Agency Paradox it is motivated by. Hill and ESConv establish that care is enacted through discrete, classifiable conversational moves, which is why D3 operationalizes strategy at the turn level.

AROMA does not assume that roles are continuously active or behaviorally fixed; rather, it models roles as **conditionally activated, strategically enacted, and institutionally constrained interactional states**.

The result is a three-dimensional taxonomy in which each layer answers a different design question: what is being offered (D1), from what relational stance and under what conditions (D2), and through what conversational mechanism (D3).

No prior taxonomy addresses all three questions simultaneously. The contribution of AROMA is not the introduction of any single dimension — each has partial precedent in the literature — but their integration into a unified framework that makes the design space of AI mental health care roles explicit, navigable, and grounded.

---

## Summary: Taxonomy Architecture at a Glance

| | **D1 · Support Type** | **D2 · Care Role** | **Pre-Role** | **D3 · Support Strategy** |
| :--- | :--- | :--- | :--- | :--- |
| **Design question** | *What* is being offered? | *Who* is the AI being? | *Has a role begun?* | *How* is it enacted? |
| **Unit of analysis** | Turn / sequence | Interaction segment | Turn (onset detection) | Turn |
| **Theoretical anchors** | Cutrona & Suhr (1992); Lazarus & Folkman (1984) | Biddle (1986); Blumer (1969); Parsons (1951); Cutrona & Russell (1990) | Role theory (onset); Annotation practice | Hill (2009); Liu et al. / ESConv (2021); Feng (2009) |
| **Labels** | Emotional, Informational, Esteem, Appraisal, Network, Tangible | Listener, Reflective Partner, Coach, Advisor, Companion, Navigator | None (pre-role) / Triggered (role active) | Question, Restatement, Reflection, Self-disclosure, Reassurance, Suggestions, Information, Other |
| **Key constraint** | Mutually exclusive per turn | Boundary conditions (Parsons): what the role can legitimately claim | Support Trigger must be met for role activation | Sequential placement (Feng): earlier moves condition later ones |
| **Activation logic** | Determined by supporter behavior | Optimal Matching: seeker need-state → role fit | First welfare-directed question or actionable suggestion | Determined by role stance + interactional position |
| **Independence from other dims** | Content is independent of role or strategy | Role is independent of strategy (a Coach can validate; a Listener can inform) | Precedes D2; does not inherit a role label | Strategy is independent of role — multiple strategies per role permitted |