# AROMA: A Multi-Dimensional Taxonomy of Caregiving Roles in AI-Mediated Mental Health Support

## Abstract

AI mental health systems routinely conflate *what* support they provide with *who* they are being relationally — collapsing support type, care role, and conversational strategy into a single design label. This conflation produces **role-locked** systems: agents fixed to a single relational stance regardless of shifting user needs. We present AROMA, a three-dimensional role taxonomy for AI care consisting of Support Type (D1), Care Role (D2), and Support Strategy (D3). Drawing on a 203-paper structured literature synthesis and grounded in Parsons' (1951) mutual obligation theory, Blumer's (1969) role-taking mechanism, and Nickerson et al.'s (2013) taxonomy development method, we offer three core contributions: (C1) The Authority-Agency Paradox, acting as a structural lens for evaluating AI care safety; (C2) The AROMA Taxonomy, a three-dimension, six-role ontology; and (C3) A Multi-Dimensional Embedding Model operationalizing the taxonomy computationally to validate the impact of role-locking empirically.

---

## 1. Introduction

The field of AI-mediated mental health support has a structural problem that no amount of better language models will solve. Current systems routinely conflate two analytically distinct phenomena: *Support Type* — the category of need being addressed (emotional, informational, esteem) — and *Care Role* — the relational stance adopted by the system toward the user (listener, advisor, coach). Cutrona and Suhr's (1992) Social Support Behavior Code, the field's dominant framework, provides a rigorous vocabulary for support types but contains no mechanism for specifying the relational stance of the provider. When applied to AI, this framework produces systems that execute support categories — typically informational or cognitive-behavioural — without accounting for the relational stance required to deliver that support effectively.

The consequence is what we term **role-locking**: a design paradigm in which AI agents are fixed to a single, static relational stance regardless of shifting user needs. Woebot is permanently a CBT coach. Replika is permanently a companion. When a user discloses acute grief to a coach-locked system, the system responds with behavioural activation ("Why don't you try going for a walk?") because its relational repertoire admits no alternative. Effective human caregiving operates differently. A skilled supporter fluidly calibrates their stance — adopting a receptive, non-directive posture during acute distress, shifting to Socratic inquiry as the user begins processing, and transitioning to directive coaching when the user signals readiness to act. Cutrona and Russell's (1990) Optimal Matching Model provides the empirical warrant for this claim: support effectiveness depends on the fit between support type and stressor characteristics, which means provider stance must shift as the user's expressed needs shift.

The mechanism underlying this fluidity is what Blumer (1969), building on Mead (1934), terms **role-taking**: the process by which an actor reads the other's expressed state, takes their perspective, and calibrates their own stance accordingly. A care role is not declared in a single utterance — it is enacted across a sequence of turns through this read-and-respond cycle. Role-locking, in these terms, is the absence of role-taking: the system maintains a fixed stance regardless of what the user expresses.

When AI systems adopt authoritative relational stances — giving medical advice, recommending treatment options, providing diagnostic information — they create a structural problem that extends beyond interaction quality into ethical territory. Drawing on Parsons' (1951) theory of the sick role, we formalize this as the **Authority-Agency Paradox**: the structural condition in which AI performs the behavioural surface of authoritative care roles without the institutional capacity, accountability, or follow-through that makes those roles legitimate. This paradox produces a specific relational consequence — an **obligation gap** in which neither party is bound by the mutual expectations that structure human care relationships. The provider has no accountability for outcomes; the receiver has no reciprocal commitment to recovery. And this obligation gap, in turn, produces a specific experiential failure: a **therapeutic misconception** (cf. Appelbaum et al., 1982) in which users act as if they are in a governed, accountable care relationship when they structurally are not.

This causal chain — paradox (structural condition) producing obligation gap (relational consequence) producing therapeutic misconception (experiential failure) — is not a capability limitation that better models will resolve. It is a structural property of AI care that requires a design-level response.

AROMA provides that response. It is a three-dimensional role taxonomy consisting of Support Type (D1), Care Role (D2), and Support Strategy (D3). This dimensional separation gives designers the analytical leverage to detect when a role transition is warranted, execute it fluidly, and calibrate the system's relational stance to avoid unearned authority.

This paper makes three primary contributions:

1. **C1: The Authority-Agency Paradox** — A theoretical account of the paradox → obligation gap → therapeutic misconception causal chain.
2. **C2: The AROMA Taxonomy** — A three-dimension, six-role ontology for AI-mediated care.
3. **C3: An Embedding Model** — A computational operationalization that classifies conversational turns along AROMA's three dimensions simultaneously.

---

## 2. Related Work

### 2.1 Support Type Taxonomies

The dominant framework for categorizing supportive behaviour is Cutrona and Suhr's (1992) Social Support Behavior Code (SSBC), which identifies five types of support: emotional, informational, esteem, network, and tangible. Each type addresses a distinct category of human need — distress, knowledge gaps, self-worth, isolation, and practical resource deficits, respectively. The SSBC has been extended by Lazarus and Folkman's (1984) stress-and-coping literature, which adds appraisal support (meaning-making and situational reframing) as a sixth type. These frameworks have proven durable because they are agnostic to the provider: the same support types apply whether the provider is a therapist, a peer, a family member, or a chatbot.

What these frameworks lack, however, is a mechanism for specifying the *relational stance* of the provider. Emotional support can be delivered by a receptive listener, by an authoritative clinician, or by a warm companion — and the relational context fundamentally changes what that support means to the recipient. Cutrona and Russell's (1990) Optimal Matching Model addresses this partially by proposing that support effectiveness depends on the fit between support type and stressor characteristics (controllability, severity, duration). But it stops short of identifying provider roles as a variable. The provider is assumed, not theorized.

This omission becomes consequential in AI contexts. When a chatbot delivers informational support, the user's experience depends critically on whether the system is adopting an authoritative stance (implying expertise and clinical accountability) or a facilitative one (offering resources without claiming authority). The SSBC provides no vocabulary for this distinction. AROMA fills this gap by treating Support Type (D1) and Care Role (D2) as orthogonal dimensions: any support type can be delivered from any relational stance, but the combination determines both the user experience and the ethical risk profile.

### 2.2 AI Role Frameworks

Several frameworks have proposed role-like categorizations for AI mental health systems. Vaidyam et al. (2019) surveyed conversational agents for psychiatry and categorized them by clinical function: screening, assessment, therapy delivery, and monitoring. Gaffney et al. (2019) proposed a similar system-level taxonomy for digital mental health interventions. More recently, Stade et al. (2024) evaluated LLMs against clinical benchmarks, implicitly assigning roles by clinical task (diagnosis support, treatment recommendation, psychoeducation).

These frameworks share a critical limitation: they operate at the *system level*, not the *interactional level*. They classify entire applications — Woebot is a therapy-delivery agent; Wysa is a screening tool — rather than characterizing the relational dynamics within individual conversations. This system-level assignment is what produces role-locking: if the system *is* a coach, every turn must be coaching. The possibility that a user's needs might shift within a single conversation — from needing to vent, to needing to understand, to needing a plan — is structurally invisible.

Furthermore, these frameworks collapse what AROMA treats as three distinct dimensions. A "therapy-delivery agent" simultaneously occupies a role (Coach or Advisor), pursues a function (self-efficacy building or decision support), and deploys specific strategies (CBT-based restructuring or psychoeducation). Without dimensional separation, it is impossible to ask: could this system adopt a different role while pursuing the same function? Could it use the same strategy from a different relational stance? These design questions — which are precisely the questions that would address role-locking — cannot be formulated within a collapsed framework.

### 2.3 Conversational Support Research

A parallel stream of work has studied supportive communication at the utterance and strategy level, providing empirical foundations for what AROMA formalizes as D4 (Support Strategy). Feng's (2009) Integrated Model of Advice-giving (IMA) identifies a sequential structure in supportive conversations: emotional support precedes problem inquiry, which precedes advice. This model provides empirical evidence that supportive communication has a role-like sequential structure, but it operates within a single role context (the advice-giver) rather than across a multi-role repertoire.

Sharma et al. (2020) operationalized empathy in text-based peer support into three mechanisms — emotional reaction, interpretation, and exploration — enabling computational detection of empathic communication. Liu et al. (2021) extended this work with ESConv, a dataset and taxonomy of emotional support strategies including self-disclosure, affirmation, suggestion, and restatement. These contributions provide robust operationalizations of individual strategies but do not address the relational stance that organizes strategy deployment. A strategy of "restatement" has different meaning and effect depending on whether it occurs within a listener stance (mirroring for validation) or a reflective partner stance (summarizing to prompt reappraisal). The strategy is the same; the relational context changes its function.

### 2.4 The Gap

No existing framework simultaneously satisfies three requirements that AROMA addresses. First, no framework separates support type (D1) from care role (D2) — the distinction that makes role transitions formally describable. Second, no framework accounts for role dynamics *within* AI care conversations — the interactional fluidity that Blumer's role-taking mechanism makes theoretically tractable. Third, no framework provides a structural account of *why* certain AI care roles are ethically riskier than others — the predictive leverage that the Authority-Agency Paradox supplies.

The result is a field that designs AI mental health systems by assigning a static role at the system level, implementing strategies without relational context, and discovering ethical problems reactively. The Tessa eating disorder chatbot's provision of calorie-restriction advice (an Advisor boundary violation), the documented empathy gaps in LLM responses across demographics (Gabriel et al., 2024), and the pseudo-intimacy dynamics in companion chatbots (Savic, 2024; Babu et al., 2025) are all instances of the same structural deficit: systems that perform care roles without the framework to calibrate, transition, or constrain them.

---

## 3. The AROMA Framework

AROMA is a three-dimensional role taxonomy that organizes AI caregiving along orthogonal dimensions. Each dimension has a distinct theoretical anchor and performs specific analytical work.

**D1 — Support Type** (Cutrona & Suhr, 1992; Lazarus & Folkman, 1984): the category of need being addressed — emotional, informational, esteem, network, tangible, or appraisal. D1 is agnostic to who provides support and how.

**D2 — Care Role** (Biddle, 1986; Blumer, 1969): the stable relational stance the AI adopts across an interaction sequence (3-5 turn windows), enacted turn-by-turn through role-taking. D2 determines which support types are foregrounded and where the boundaries of legitimate action lie.

**D3 — Support Strategy** (Hill, 2009; Feng, 2009; Liu et al., 2021 [ESConv]): the concrete conversational tactic deployed — questions, restatement, reflection of feelings, self-disclosure, affirmation, suggestions, information. D3 is the utterance-level behavior that enacts the overarching relational stance.

### 3.1 The Six Care Roles

AROMA identifies six care roles, each meeting three inclusion criteria: (a) appears in three or more independent papers from the PRISMA synthesis, (b) produces distinct interactional behaviours from all other roles, and (c) is viable within at least one AI interaction modality. One candidate role (Connector — peer community bridging) was evaluated and excluded: only one paper met the archetype threshold. Peer-bridging is absorbed into Navigator's scope.

| Role | Stance | Primary D1 | Core D3 | Paradox Level | Invited Human Role |
|---|---|---|---|---|---|
| **Listener** | Receptive, non-directive | Emotional | Validation | Low | Witness-seeker |
| **Reflective Partner** | Curious, exploratory | Appraisal | Insight generation | Low | Client, Explorer |
| **Coach** | Directive, forward-looking | Esteem | Self-efficacy building | Moderate | Self-manager, Goal-seeker |
| **Advisor** | Authoritative, informational | Informational | Decision support | **High** | Patient, Student |
| **Companion** | Warm, co-present | Emotional | Sustained presence | Low | Peer-seeker |
| **Navigator** | Practical, resource-oriented | Network, Tangible | Resource connection | **High** | Advocate-seeker |

*Table 1. The six AROMA care roles with dimensional profiles and paradox gradient.*

The central conceptual claim is that role (D2) and function (D3) are orthogonal. Prior frameworks treat them as identical — a Coach always coaches, a Companion always companions. AROMA treats them as separable: a Coach can validate (D3: validation) without ceasing to be a Coach (D2). A Listener can occasionally provide information (D3: decision support) without becoming an Advisor (D2). What distinguishes roles is not the individual turn but the stable relational stance that gives turns their meaning.

### 3.2 The Authority-Agency Paradox

Human care relationships are governed by what Parsons (1951) terms **structural binding**: a system of mutual obligations in which the provider is bound to act competently and accountably, and the receiver is bound to commit to recovery and cooperate with treatment. This binding is not merely contractual — it is what makes the relationship *therapeutic* rather than merely comforting.

AI care interactions dissolve this binding on both sides. The system receives relational authority — users treat it as a knowledgeable, caring provider — without the institutional capacity, accountability, or follow-through that legitimizes that authority. The user receives support without reciprocal commitment. The result is an **obligation gap**: neither party is bound by the expectations that structure human care.

This gap has predictable experiential consequences. Users who interact with authoritative AI care systems — those adopting Advisor or Navigator stances — are vulnerable to a **therapeutic misconception**: they act as if they are in a governed, accountable care relationship (seeking diagnosis, expecting follow-up, trusting clinical recommendations) when they structurally are not. This term adapts Appelbaum et al.'s (1982) concept from clinical trial ethics, where participants confuse research procedures for personalized treatment.

The causal chain is: **Authority-Agency Paradox** (structural condition: AI performs authority without agency) → **obligation gap** (relational consequence: neither party bound by care obligations) → **therapeutic misconception** (experiential failure: user acts as if in governed care). These are not synonyms but causally linked phenomena at different levels of analysis. The paradox level is role-dependent:

- **Low** (Listener, Reflective Partner, Companion): Users do not project clinical authority. Relational presence is sufficient without institutional agency. Primary risk is hollow empathy (Listener), premature closure (Reflective Partner), or pseudo-intimacy (Companion) — quality failures, not structural ones.
- **Moderate** (Coach): The AI adopts a directive stance but cannot enforce accountability, observe user behaviour, or adjust the user's environment. Risk: inducing shame through goal-setting without capacity assessment.
- **High** (Advisor, Navigator): Users project clinical authority and expect intervention the AI structurally cannot deliver. Risk: the full paradox–gap–misconception chain. Documented failure cases cluster here: the Tessa chatbot's calorie-restriction advice, LLM demographic empathy gaps, cold-link crisis referrals.

This gradient provides designers with a predictive tool: the higher the paradox level, the more constraint design the role requires — epistemic humility framing, warm-handoff protocols, crisis detection pipelines, and explicit capacity communication.

### 3.3 Taxonomy Construction and Falsifiability

AROMA follows Nickerson et al.'s (2013) taxonomy development method, combining conceptual-to-empirical (top-down from theory, Phase 0) and empirical-to-conceptual (bottom-up from corpus, Phase 1) development cycles. The ending conditions are: (a) every AI care interaction in the corpus can be classified by all five dimensions, (b) no new dimensions or role categories emerged from the final iteration of corpus coding, and (c) each dimension non-trivially discriminates — removing any dimension collapses distinctions that the remaining dimensions cannot recover.

Conditions (a) and (b) are met by the Phase 1 synthesis. Condition (c) is partially met: the D1/D2 separation is demonstrated by the orthogonality evidence (a Coach can validate; a Listener can inform), and D5 discriminates by constraining role viability across modalities. Full condition (c) validation requires the inter-rater reliability study (Phase 3, in progress), which will test whether independent coders can reliably distinguish all six roles using the codebook.

The taxonomy is falsifiable on three fronts. First, if human coders cannot reliably distinguish the six roles (Cohen's kappa < 0.60 on D2), the role boundaries require revision — either through sharpening definitions or merging confusable roles. Second, if the paradox gradient does not predict where safety failures cluster in empirical data (i.e., failures distribute uniformly across paradox levels rather than concentrating in High roles), the gradient loses its predictive value. Third, if a seventh role meeting all three inclusion criteria (≥3 papers, distinct behaviours, modality viability) emerges from expanded corpus analysis, the taxonomy must accommodate it — as it did when absorbing the Connector candidate into Navigator.

---

## 4. Literature Synthesis: Methods and Results

### 4.1 Corpus Construction

We conducted a structured literature synthesis through an OpenAlex search (2015-2025) plus snowball citation chasing, yielding an initial pool of candidate papers. After title/abstract screening, full-text review, and application of inclusion criteria, the final corpus comprised 203 papers.

Each paper was coded for engagement with AROMA's three dimensions. Multi-label coding was applied: a single paper could engage with multiple dimensions. D2 (Care Role) emerged as a critical point of terminological fragmentation, confirming the field's need for a standardized relational ontology.

### 4.2 Terminological Fragmentation

Automated role-term extraction identified 34 distinct role-like terms across the corpus. These terms collapse, when mapped by relational stance rather than surface label, into the six AROMA care roles plus a set of system descriptors (chatbot, virtual agent, social robot) that refer to platform types rather than relational stances.

The fragmentation is itself a finding. The Coach role appears under labels including "coach," "virtual coach," "AI coach," "wellness coach," and "health coach" — five labels for a single relational stance defined by directing a capable user toward self-identified goals. The Advisor role absorbs 11 distinct terms, from "therapist" and "counselor" to "sim-physician" and "therapist-lite." The Companion role absorbs 9, from "companion" and "virtual friend" to "pseudo-intimate partner" and "nurturer."

Two roles — Listener and Reflective Partner — had **no terms mined** from the automated extraction pipeline. These relational stances are enacted pervasively in the literature (active listening appears in 26.9% of coded AI responses in Chin et al., 2025) but are not *named* as roles. The literature describes listening and reflecting as strategies or behaviours, not as relational identities. This finding provides direct evidence for AROMA's core claim: the field lacks a vocabulary for the relational stance dimension of AI care. The terminological gap is not an absence of the phenomenon but an absence of the concept.

### 4.3 Authority-Agency Paradox Signals

Ten papers in the corpus contain direct evidence of the Authority-Agency Paradox, clustering into three failure themes: pseudo-intimacy and dependency dynamics (Companion-role failures), reliability and safety gaps (Advisor-role failures), and authority-agency tension (cross-role structural concerns). The low count (10 of 203) reflects not the rarity of the phenomenon but its recent emergence as an explicit research concern — the majority of paradox-signal papers are from 2024–2025, suggesting the field is beginning to recognize the structural problem AROMA formalizes.

---

## 5. Computational Operationalization

To empirically validate the AROMA taxonomy and provide a computational mechanism for detecting role-locking, we operationalized the framework on the ESConv dataset (Liu et al., 2021) — a corpus of 1,300 peer-support conversations comprising over 18,376 supporter turns.

Our operationalization strategy employs a staggered, three-model architecture designed to isolate the conversational dimensions before scaling:

### 5.1 Annotator Baselines: Heuristic vs. LLM

We developed two independent annotators to establish ground-truth labels across a stratified 400-sequence sample:

1. **Heuristic Classifier (Annotator 1):** A deterministic, rules-based engine that maps pre-existing D3 Strategy labels and keyword patterns to D1 Support Types. While fast and highly scalable to the full corpus, it struggles with nuanced boundary conditions (e.g., distinguishing Esteem from Emotional support).
2. **LLM-as-Judge (Annotator 2):** A non-deterministic classifier utilizing a large language model prompted with the AROMA taxonomy codebook. Because Care Roles (D2) are enacted across conversational sequences rather than isolated utterances, the LLM processes 5-turn sliding context windows to accurately judge the overarching relational stance.

This dual-annotator approach validates the codebook's reliability. By extracting the sequences where the Heuristic and LLM classifiers agree, we filter out noisy labels, leaving a high-quality ground-truth dataset required for the final embedding model.

### 5.2 Initial D2 Distribution Findings

Application of the LLM pipeline to the 400-sequence sample revealed a distinct distribution of Care Roles within the ESConv dataset. Consistent with the dataset's peer-support, non-clinical design, the roles heavily skewed toward **Reflective Partner** (30.5%) and **Companion** (25.3%), with directive roles like Advisor (10.2%) and Coach (8.9%) appearing significantly less frequently.

Furthermore, cross-referencing D1 Support Types with D2 Care Roles affirmed the taxonomy's theoretical predictions: Emotional Support was heavily clustered under Reflective Partner and Companion roles, while Informational Support remained the primary domain of Advisor and Coach roles.

### 5.3 Multi-Dimensional Embedding Model (C3)

*In progress.* The final stage of operationalization replaces the costly LLM pipeline with a trained multi-task vector embedding model. By training a single `sentence-transformers` encoder with three independent classification heads to natively predict D1, D2, and D3 simultaneously, we aim to empirically validate AROMA's core theoretical claim: that these three dimensions capture distinct, non-redundant communication patterns.
