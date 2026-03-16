# AROMA: Internal Framework Specification (v0.1)

## Core Research Question
**"What is the role structure of AI-mediated mental health support interactions?"**

The goal is not to propose new clinical interventions, but to build a framework organizing existing **Support Strategies** from the literature into a cohesive, five-dimensional role taxonomy. 

*Claim:* No prior framework provides a unified taxonomy of caregiving roles specifically for AI-mediated mental health support interactions that accounts for role dynamics across interaction contexts.

---

## 1. Support Type
**Definition:** The foundational dimension identifying the specific need a user is expressing (e.g., emotional, informational, esteem). It determines which Care Roles are appropriate.
- **What it is not:** It is not the *role* the AI plays, nor the specific *action* (strategy) it takes. It is the underlying category of need.
- **Theoretical Lineage:** Cutrona & Suhr's (1992) Social Support Behavior Code (SSBC). 

**Categories:**
- **Emotional:** Addressing distress and the need to be heard ("That sounds really hard").
- **Esteem:** Addressing self-worth and perceived competence ("You've handled this before").
- **Informational:** Addressing knowledge gaps and uncertainty ("Here's what that medication does").
- **Network:** Addressing isolation and connection to communities ("There are communities for this").
- **Tangible:** Addressing practical needs and concrete help ("Here's a crisis line number").
- **Appraisal:** Addressing meaning-making and reframing ("That reaction makes sense given what happened").

---

## 2. Interaction Modality
**Definition:** The communicative medium through which the AI system operates, which acts as a structural constraint on which Care Roles and Support Strategies are viable.
- **What it is not:** It is not merely a deployment preference; it is a first-class theoretical boundary on interactional capacity.
- **Theoretical Lineage:** Media Richness Theory (Daft & Lengel, 1986); Relational Agent research (Bickmore & Picard, 2005).

**Categories:**
- **Text chat (e.g., Woebot):** Affords anonymity, reflection time, low barrier. Good for Advisor/Navigator.
- **Voice (e.g., Hume AI):** Affords paralinguistic cues, emotional tone. Good for Coach/Listener.
- **Avatar:** Affords nonverbal signals and presence. Good for Listener/Companion.
- **Robot (e.g., Paro):** Affords physical presence and touch. 
- **Ambient / Wearable:** Affords passive monitoring and real-time sensing.

---

## 3. Care Role
**Definition:** A stable relational stance that an AI agent adopts toward a user in distress, characterized by a distinctive core function, a dominant support type, and a characteristic set of linguistic strategies—and that invites a complementary human role in return.
- **What it is not:** It is not the type of support given (Support Type) or the concrete sentence uttered (Support Strategy).
- **Theoretical Lineage:** Role Theory (Biddle, 1986); Counseling/helping professions identity; Relational agent literature.

**Categories (The 7 Care Roles):**
- **Listener:** Receptive, non-directive. Creates space for emotional expression without judgment.
- **Reflective Partner:** Curious, exploratory. Helps the user understand their feelings through restatement.
- **Coach:** Directive, forward-looking. Builds motivation and self-efficacy.
- **Advisor:** Authoritative, informational. Provides guidance, recommendations, structured information.
- **Companion:** Warm, co-present. Reduces isolation through consistent relational presence.
- **Navigator:** Practical, resource-oriented. Connects users to external services/tools.
- **Connector:** Network-oriented. Encourages connection to human communities.

---

## 4. Core Function
**Definition:** The intended psychological outcome or functional goal that a Care Role aims to produce in a given context.
- **What it is not:** It is not the literal action (Strategy), nor the overarching relational identity (Role). It is the bridge linking the role to the psychological outcome.
- **Theoretical Lineage:** Functional analysis in counseling psychology; Goal-oriented dialogue systems research.

**Role-to-Function Mapping & Evaluation Measures:**
- **Listener \(\rightarrow\) Emotional validation:** User feels heard. (Measure: Perceived empathy, distress reduction).
- **Reflective Partner \(\rightarrow\) Insight generation:** User reaches new understanding. (Measure: Cognitive reappraisal).
- **Coach \(\rightarrow\) Motivation and self-efficacy:** User feels capable. (Measure: Bandura's self-efficacy scales).
- **Advisor \(\rightarrow\) Decision support:** User has clarity on options. (Measure: Decisional clarity).
- **Companion \(\rightarrow\) Emotional presence:** User feels less alone. (Measure: Loneliness scales, social presence).
- **Navigator \(\rightarrow\) Resource discovery:** User is connected to support. (Measure: Referral uptake).
- **Connector \(\rightarrow\) Social network activation:** User re-engages with humans. 

---

## 5. Support Strategy (Formerly "Interventions")
**Definition:** The concrete, observable conversational tactics or interactions the system uses to execute its role and achieve its core function (e.g., a specific open question, a self-disclosure statement, or a direct piece of advice).
- **What it is not:** It does **not** propose new clinical interventions; it organizes *existing* behavioral strategies from the literature into this role taxonomy.
- **Theoretical Lineage:** HCI and NLP literature on emotional support conversation (e.g., ESConv taxonomy).
