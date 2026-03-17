Here are revised dimension descriptions for D1–D5, each grounded in the argument chain:

---

**D1 · Support Type**
*Theoretical anchor: Cutrona & Suhr (1992)*

The categorical vocabulary of support, drawn directly from Cutrona & Suhr's Social Support Behaviors Code: emotional, informational, esteem, tangible, and network. Support Type describes the *content* of what is being offered in a care interaction — not how it is delivered, not by whom, and not under what conditions. It is the most atomistic dimension of the taxonomy: a single utterance can be classified by support type independent of the role adopting it or the strategy enacting it. AROMA inherits this vocabulary wholesale and applies it to AI-mediated care contexts.

---

**D2 · Care Role**
*Theoretical anchors: Biddle (1986), Parsons (1951), Cutrona & Russell (1990)*

The stable relational stance the AI adopts across an interaction or interaction phase. Care Role is not a behavioral description of individual turns but an identity-level commitment that shapes which support types are foregrounded, which core functions are pursued, and which boundary conditions apply. AROMA identifies five care roles: Listener, Coach, Advisor, Companion, and Navigator.

Each role carries two theoretically grounded properties:

**Boundary conditions** (after Parsons, 1951): the scope of what a role can legitimately claim to do, derived from the **mutual obligation structure** of care relationships. A role's authority is only legitimate insofar as it operates within its sanctioned bounds. When an AI agent claims the authority of a role (like Advisor) without the corresponding capacity to fulfill its obligations, it creates an **obligation gap**—the core of the **Authority-Agency Paradox**. These are not design preferences—they are the conditions under which the role's authority is structurally coherent.

**Activation conditions** (after Cutrona & Russell's Optimal Matching Model): the user need states under which each role is most appropriate. Effective support is a function of fit between support offered and stressor characteristics and coping resources of the recipient. High agency and controllable stressors favor Advisor and Coach roles; acute distress and low controllability favor Listener and Companion roles; navigation needs (system complexity, access barriers) activate the Navigator role. A taxonomy that names roles without specifying when each role is indicated is descriptive but not prescriptive — the activation conditions are what make AROMA usable as a design tool.

---

**D3 · Core Function**
*Theoretical anchors: Rogers (1957), Feeney & Collins (2015)*

The functional goal of a discrete conversational move within a care interaction. Where Care Role (D2) describes a stable relational identity across an interaction, Core Function describes what a specific turn or exchange is *doing* — the psychological work it is performing for the user at that moment. A single Care Role can enact multiple Core Functions across a session: a Companion might validate in one turn, inquire in the next, and normalize in the third, without shifting its relational stance.

This dimension is grounded in Rogers' core therapeutic conditions — empathy, unconditional positive regard, congruence — extended beyond the single therapist role to account for the multi-role landscape AROMA maps, and in Feeney & Collins' distinction between stress-buffering and relational capitalization functions, which establishes that care is not a single undifferentiated activity but a set of functionally distinct operations that serve different psychological needs. D3 operationalizes this insight at the turn level.

The D2/D3 distinction is the central conceptual contribution of AROMA: prior taxonomies — including Vaidyam et al. (2019), Gaffney et al. (2019), and Stade et al. (2024) — collapse role and function into a single label, implying that a Coach always does coaching things and a Companion always does companion things. AROMA treats them as orthogonal: role is identity, function is action. A Coach can validate; a Listener can provide information. The taxonomy does not prohibit functional flexibility within a role — it makes that flexibility visible and designable.

---

**D4 · Support Strategy**
*Theoretical anchor: Sharma et al. (2020)*

The behavioral and linguistic mechanism through which a Core Function is enacted. If D3 describes what an utterance is doing, D4 describes how it does it — the conversational moves, rhetorical structures, and interactional patterns that constitute support in practice. Drawing on Sharma et al.'s empathy mechanisms (emotional reaction, interpretation, exploration) as the closest prior operationalization, AROMA extends this framework beyond empathic response to cover the full range of care strategies: active listening cues, reframing, psychoeducational explanation, motivational questioning, resource signposting, and so on.

D4 is the dimension most directly actionable for NLP and conversational design: it is the layer at which role commitments and functional goals are translated into actual utterance-level behavior. It is also the dimension most underspecified in existing AI mental health systems, which tend to optimize for a single default strategy (typically empathic reflection) regardless of role or user need state.

---

**D5 · Interaction Modality**
*Rationale: extending prior work; scoped to verbal communication in the present framework*

The structural and formal properties of how a care interaction is organized and delivered within the verbal channel. D5 is distinct from D4 in the following sense: D4 describes *what conversational move is made* (e.g., open-ended inquiry, normalization, reframing); D5 describes *how the interaction itself is structured* around that move — whether the exchange is open-ended dialogue, structured prompting sequences, psychoeducational delivery, check-in protocols, or reflective journaling prompts.

This distinction matters for design because the same support strategy can be instantiated in structurally different interaction formats, with meaningfully different effects on user experience and therapeutic appropriateness. An empathic probe (D4) delivered within an unstructured open dialogue (D5) feels different from the same probe embedded in a guided CBT-style protocol (D5). D5 makes this structural layer explicit.

The present framework scopes D5 to verbal communication modalities. We note that the dimension is designed to be extensible to embodied and ambient computing contexts — including social robotics, haptic interfaces, and physiologically-responsive environments — as a direction for future work.

---

Want me to now draft the bridging paragraph that connects this revised taxonomy description back to the theoretical section, closing the argument chain explicitly for a reader moving from theory to taxonomy?