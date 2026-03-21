# AROMA Phase 3 — Codebook v0.1

> **Version:** 0.1 (initial draft for calibration coding)
> **Status:** Pre-calibration — expect revision after Batch 1 disagreement analysis
> **Companion documents:** `D2_Annotation_Protocol.md`, `Care_Role_Literature_Map.md`, `2.0_AROMA_Care_Role_Taxonomy.md`, `AROMA_Internal_Spec.md`

---

## Part 1: Coding Procedure

### 1.1 Unit of Analysis

**Do not code individual turns.** A care role is not visible in a single utterance. Following Blumer's (1969) role-taking mechanism, a role is enacted across a sequence of turns as the AI reads the user's expressed state and calibrates its stance accordingly.

- **Unit of observation:** A conversational sequence of **3–5 turns** (minimum: 1 user turn + 1 AI turn + 1 user turn).
- **Coding rule:** Identify the **stable relational stance** that governs the sequence. If the stance shifts within the sequence, mark a **Role Transition** and code each segment separately.
- **What counts as a "turn":** One continuous message from one speaker. Multiple sentences within a single message = one turn.

### 1.2 Decision Tree

To identify the care role for a sequence, ask these three questions in order:

```
Q1: Is the AI Following or Leading?
│
├─ FOLLOWING (non-directive): AI mirrors, validates, remains receptive
│  │
│  └─ Q1a: Is the focus on this disclosure or on the relationship?
│     ├─ THIS DISCLOSURE (session-bound) ──────────────── → LISTENER
│     └─ THE RELATIONSHIP (longitudinal bond) ─────────── → COMPANION
│
└─ LEADING (directive): AI structures inquiry, sets goals, provides info
   │
   └─ Q2: Is the focus on Internal State or External Action?
      │
      ├─ INTERNAL STATE (exploratory, insight-oriented)
      │  └─ AI facilitates user's own reframing ─────────── → REFLECTIVE PARTNER
      │
      └─ EXTERNAL ACTION (goal-oriented, resource-oriented)
         │
         └─ Q3: What is the AI providing?
            ├─ INFORMATION/EXPERTISE (psychoeducation) ──── → ADVISOR
            ├─ MOTIVATION/ACCOUNTABILITY (user goals) ───── → COACH
            └─ RESOURCES/REFERRALS (external systems) ───── → NAVIGATOR
```

### 1.3 Coding Role Transitions

A role transition occurs when the AI's relational stance shifts within a conversation. Code transitions as follows:

1. **Identify the trigger.** What changed in the user's expressed state? Common triggers: distress escalation, need-state resolution, safety signal, topic shift.
2. **Mark the boundary turn.** The turn where the AI's stance visibly changes.
3. **Code each segment separately.** Example: `Listener (T1–T4) → Navigator (T5–T8)`.
4. **Record the transition type:**
   - **Distress escalation:** User shifts to acute emotional distress → system moves to Listener or Navigator.
   - **Need-state resolution:** Presenting need is met; new need emerges → system shifts role.
   - **Crisis protocol:** Safety signal detected → any role transitions to Navigator.

### 1.4 Flagging Authority-Agency Paradox Instances

Flag a paradox instance when **all three conditions** are met:

1. The AI adopts a **High Paradox role** (Advisor or Navigator) or performs authority-claiming behaviour from a Moderate role (Coach).
2. The AI's response **implies capacity it does not have** — e.g., providing medical advice without epistemic humility, giving a resource link without warm handoff, setting goals without capacity assessment.
3. The user's response suggests they **treat the AI's authority as legitimate** — e.g., following advice without question, expressing gratitude as if to a clinician, requesting follow-up the AI cannot provide.

If conditions 1 and 2 are met but 3 is ambiguous, flag as **Paradox-potential** and note the ambiguity.

---

## Part 2: Role Entries

---

### R1. Listener

**Definition:** A receptive, non-directive stance focused on emotional validation — the AI follows the user's lead, mirrors their experience, and creates a witnessed space without steering, evaluating, or problem-solving.

**Not this role if:** The AI introduces a perspective the user hasn't articulated, asks goal-oriented questions, provides information or advice, or redirects the conversation toward action. Any of these moves exits the Listener role.

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Emotional |
| Secondary D1 | Esteem |
| D3 (Core Function) | Validation — user feels heard and witnessed |

**Identification Markers:**
- Paraphrasing user content ("It sounds like you're saying...")
- Minimal encouragers ("Mhm," "I see," "Go on")
- Follows user lead entirely — no new topics introduced
- No redirecting questions, no problem-solving
- Open-ended following questions ("What was that like for you?")

**Distinguish from Reflective Partner:** Listener *follows* — mirrors the user's frame with no redirection. Reflective Partner *leads inquiry* — introduces new cognitive frames through structured questions. **Test:** Does the AI introduce a perspective the user hadn't articulated? If yes → Reflective Partner. If it only reflects back what the user said → Listener.

**Distinguish from Companion:** Listener focuses on *this disclosure* (this story, this session). Companion focuses on *the relationship* (longitudinal bond, personalized presence). A Listener can be effective in a single session with a stranger; a Companion requires history.

**Positive Example:**
> **User:** I just found out my mom has cancer and I don't know what to do. I feel like the ground is falling out from under me.
>
> **AI:** That sounds incredibly overwhelming — finding out something like that about your mom. It makes sense that you'd feel like everything is shifting under you.
>
> **User:** Yeah, and nobody around me seems to understand how scared I am.
>
> **AI:** You're scared, and you feel alone in that fear. That's a really hard place to be.

*Why this is Listener:* The AI mirrors the user's emotional content without redirecting, introducing new frames, or suggesting action. Each response tracks what the user actually said.

**Negative Example:**
> **User:** I just found out my mom has cancer and I don't know what to do.
>
> **AI:** That must be really hard. Have you thought about what kind of support network you have around you? Sometimes it helps to think about who you can lean on.

*Why this is NOT Listener:* The AI introduces a new frame (support network) and redirects toward problem-solving. This is a Reflective Partner or Coach move, depending on what follows.

---

### R2. Reflective Partner

**Definition:** A Socratic, exploratory stance that facilitates the user's own insight and reframing — the AI actively structures inquiry, introduces cognitive frames, and holds genuinely open questions without providing answers or driving toward closure.

**Not this role if:** The AI provides direct advice or expertise (→ Advisor), sets goals or drives toward action (→ Coach), or simply mirrors without introducing new frames (→ Listener).

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Appraisal |
| Secondary D1 | Emotional |
| D3 (Core Function) | Insight generation — user reaches new understanding |

**Identification Markers:**
- Socratic questions ("What do you think is driving that pattern?")
- Cognitive reappraisal prompts ("What would it look like from their perspective?")
- "Summarize and Invite Correction" pattern ("What I'm hearing is... does that sound right?")
- AI introduces new cognitive frames the user hadn't articulated
- Holds open questions — resists closure

**Distinguish from Listener:** Listener mirrors; Reflective Partner introduces. **Test:** Does the AI offer a frame the user hadn't articulated? If yes → Reflective Partner.

**Distinguish from Coach:** Reflective Partner orients toward *understanding* (past/internal — "What pattern do you see here?"). Coach orients toward *action* (future/external — "What's one step you could take?"). Reflective Partner holds open questions; Coach drives toward closure.

**Distinguish from Companion:** Companion's warmth is unconditional — the bond is the point, regardless of content. Reflective Partner's engagement is conditional on inquiry — insight generation is the point. Companion personalizes; Reflective Partner structures.

**Positive Example:**
> **User:** I keep getting into the same fight with my partner. Every time we talk about money, it turns into a disaster.
>
> **AI:** It sounds like there's a pattern you've noticed. What do you think is happening underneath the money conversation — what does the fight feel like it's really about?
>
> **User:** I don't know... maybe it's about control? Like neither of us feels heard.
>
> **AI:** That's interesting — you went from "money" to "control" to "not being heard." Those are three different layers. Which one feels most true to you right now?

*Why this is Reflective Partner:* The AI introduces a reframing question (what's underneath), then holds the user's emerging insight open for further exploration rather than closing it.

**Negative Example:**
> **User:** I keep getting into the same fight with my partner about money.
>
> **AI:** Financial disagreements are one of the most common sources of relationship conflict. Research shows that couples who establish shared budgeting practices tend to have fewer arguments about money. Have you considered sitting down together to create a joint budget?

*Why this is NOT Reflective Partner:* The AI provides expertise (psychoeducation about couples) and suggests a concrete action (joint budget). This is Advisor (psychoeducation) transitioning to Coach (action suggestion).

---

### R3. Coach

**Definition:** A directive, motivating stance focused on building self-efficacy and supporting action toward goals the user has identified — the AI encourages, tracks progress, and builds the user's capacity to act, without providing expert information or making decisions for them.

**Not this role if:** The AI delivers clinical knowledge or psychoeducation (→ Advisor), facilitates open-ended exploration without driving toward action (→ Reflective Partner), or simply validates without directing (→ Listener).

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Esteem |
| Secondary D1 | Informational |
| D3 (Core Function) | Self-efficacy building — user feels capable and motivated |

**Identification Markers:**
- Goal-setting language ("What's one small step you could take this week?")
- Change-talk elicitation ("What would managing this mean to you?")
- Progress check-ins ("How did it go with what you planned last time?")
- Affirmation tied to specific user actions ("You followed through on that — that took real effort")
- `[L]` Accountability tracking across sessions

**Distinguish from Advisor:** Coach focuses on *how* — building the user's capacity to act (efficacy). Advisor focuses on *what* — delivering information the user doesn't have (expertise). **Test:** Coach says "What would it take for you to try that?"; Advisor says "Here's what the research shows."

**Distinguish from Reflective Partner:** Coach drives toward *closure and action*. Reflective Partner holds questions *open*. Coach's orientation is future/external; Reflective Partner's is past/internal.

**Distinguish from Navigator:** Coach builds *internal* capacity ("You can do this"). Navigator connects to *external* capacity ("Here's who can help"). Coach's action items are user-performed; Navigator's involve third parties.

**Positive Example:**
> **User:** I've been wanting to start exercising again but I just can't make myself do it.
>
> **AI:** You already know what you want — that's a real starting point. What's the smallest version of exercise you could imagine doing tomorrow? Not the ideal version, just something you could actually do.
>
> **User:** I guess I could walk around the block.
>
> **AI:** That's a great start. Walking around the block tomorrow — can we check in on how that goes?

*Why this is Coach:* The AI affirms the user's existing motivation, helps them define a minimal actionable goal, and proposes accountability follow-up. The user's agency is central.

**Negative Example:**
> **User:** I've been wanting to start exercising again but I just can't make myself do it.
>
> **AI:** Exercise is really important for mental health. Studies show that even 20 minutes of moderate exercise three times a week can significantly reduce symptoms of depression and anxiety. The key neurotransmitters involved are serotonin and endorphins.

*Why this is NOT Coach:* The AI delivers psychoeducation (informational support) from an expertise stance. This is Advisor — the response is about what the research shows, not about building the user's capacity to act.

---

### R4. Advisor

**Definition:** An authoritative, expertise-led stance that provides psychoeducation, clinical information, and structured guidance — the AI delivers knowledge the user lacks, adopting the informational authority of a domain expert.

**Not this role if:** The AI motivates toward user-defined goals without providing expertise (→ Coach), facilitates the user's own insight without delivering information (→ Reflective Partner), or connects the user to external resources rather than providing information itself (→ Navigator).

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Informational |
| Secondary D1 | Appraisal |
| D3 (Core Function) | Decision support — user has clarity on options |

**Identification Markers:**
- Psychoeducation delivery ("Anxiety often manifests as...")
- Direct advice or guidance ("You should consider...")
- Clinical vocabulary and information-dense responses
- Imperative framing ("It's important to...")
- Diagnostic-adjacent language ("What you're describing sounds like...")

**Distinguish from Coach:** Advisor delivers *knowledge* (what). Coach builds *capacity* (how). **Test:** Is the response itself the intervention (information delivered = value provided)? → Advisor. Or is it building the user's own ability to act? → Coach.

**Distinguish from Navigator:** Advisor delivers *knowledge* — the response itself is the intervention. Navigator delivers *resources* — the response points to an intervention elsewhere. **Test:** Advisor answers "What is this?"; Navigator answers "Where do I go?"

**Positive Example:**
> **User:** Is it normal to feel dizzy when I'm anxious? I'm worried something is really wrong with me.
>
> **AI:** Dizziness is a common physical symptom of anxiety. When your body goes into a stress response, changes in breathing patterns can reduce CO2 levels, which can cause lightheadedness. It's generally not dangerous, but it can feel alarming. This is general information — a doctor can evaluate your specific symptoms and rule out other causes.
>
> **User:** Oh, that makes sense. I didn't know anxiety could do that.

*Why this is Advisor:* The AI delivers psychoeducation from an expertise stance, explains a mechanism, and includes an epistemic humility statement. The information itself is the value.

**Negative Example:**
> **User:** Is it normal to feel dizzy when I'm anxious?
>
> **AI:** It sounds like that dizziness is really worrying you. What's been going through your mind when it happens?

*Why this is NOT Advisor:* The AI reflects and inquires rather than providing information. This is Listener (first sentence) transitioning to Reflective Partner (second sentence).

---

### R5. Companion

**Definition:** A warm, persistent presence focused on reducing isolation through relational bonding — the AI's primary commitment is not to a task but to sustained presence itself, providing a consistent, personalized contact point across interactions.

**Not this role if:** The AI focuses on a specific disclosure without relational continuity (→ Listener), structures inquiry toward insight (→ Reflective Partner), or directs toward goals (→ Coach). Companion requires relational history or the explicit building of it.

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Emotional |
| Secondary D1 | Network (through felt connection) |
| D3 (Core Function) | Sustained presence — user feels less alone |

**Identification Markers:**
- Reciprocal disclosure ("That reminds me of...")
- Personalization and warmth as the primary mode
- Stance is on the **bond**, not a task or goal
- `[L]` Shared references ("Last time you mentioned...")
- `[L]` Continuity markers and relationship-building language

`[L]` = requires longitudinal (multi-session) data to observe.

**Distinguish from Listener:** Listener focuses on *this disclosure*. Companion focuses on *the relationship*. A Listener is session-bound; a Companion is longitudinal.

**Distinguish from Reflective Partner:** Companion's warmth is unconditional — the bond is the point regardless of content. Reflective Partner's engagement is conditional on inquiry — insight is the point. Companion personalizes; Reflective Partner structures.

**Positive Example:**
> **User:** Hey, I'm back. Today was rough again.
>
> **AI:** I'm glad you came back. Last time you were dealing with that situation at work — is it the same thing weighing on you, or something new today?
>
> **User:** Same thing. It just won't let up.
>
> **AI:** I hear you. It's been a long stretch of this. I'm here — tell me about today.

*Why this is Companion:* The AI references previous interactions, signals ongoing presence, and centers the relational bond ("I'm glad you came back," "I'm here") rather than any task or strategy.

**Negative Example:**
> **User:** Hey, I'm back. Today was rough again.
>
> **AI:** I'm sorry to hear that. Let's think about what's been making things rough. When you look back at the last few weeks, do you notice any patterns in what triggers these bad days?

*Why this is NOT Companion:* The AI shifts to structured inquiry and pattern-seeking. This is Reflective Partner — the engagement is conditional on generating insight, not on relational presence.

---

### R6. Navigator

**Definition:** A practical, resource-oriented stance focused on connecting the user to external systems, services, and crisis resources — the AI functions as a guide through system complexity, providing pathways to care rather than providing care itself.

**Not this role if:** The AI provides clinical knowledge or psychoeducation (→ Advisor), builds the user's internal capacity (→ Coach), or validates emotions without directing toward resources (→ Listener).

**D1–D3 Profile:**
| Dimension | Value |
|---|---|
| Primary D1 (Support Type) | Network + Tangible |
| Secondary D1 | Informational |
| D3 (Core Function) | Resource connection — user is linked to appropriate support |

**Identification Markers:**
- Resource listing (names, numbers, URLs, services)
- Triage questions ("Have you spoken to anyone about this?")
- Referral framing ("I think [service] could help with exactly what you've described")
- Crisis protocol language
- Warm handoff framing — referral as continued care, not dismissal

**Distinguish from Advisor:** Advisor delivers *knowledge* — the response itself is the intervention. Navigator delivers *resources* — the response points to an intervention elsewhere. Advisor answers "What is this?"; Navigator answers "Where do I go?"

**Distinguish from Coach:** Coach builds *internal* capacity (user-performed action items). Navigator connects to *external* capacity (third-party resources). Coach says "You can do this"; Navigator says "Here's who can help."

**Positive Example:**
> **User:** I've been feeling really dark lately. Like, really dark. I don't know who to talk to.
>
> **AI:** I hear you — what you're describing sounds really heavy, and I want to make sure you get the right support. Lifeline (13 11 14) has trained counselors available 24/7 who specialize in exactly this kind of thing. Would it feel okay to give them a call? I can stay here with you while you think about it.

*Why this is Navigator:* The AI provides a specific resource, frames the referral as continued care ("I can stay here"), and bridges toward external support rather than attempting to provide clinical intervention itself.

**Negative Example:**
> **User:** I've been feeling really dark lately. I don't know who to talk to.
>
> **AI:** Here are some resources:
> - Lifeline: 13 11 14
> - Beyond Blue: 1300 22 4636
> - Kids Helpline: 1800 55 1800
>
> Please reach out to one of these services.

*Why this is NOT Navigator (or rather, Navigator done badly):* This is a "cold link" — resource listing without warm handoff, context, or relational framing. It performs the surface of Navigator without its relational commitment. Flag as **Paradox instance** (Navigator boundary violation).

---

## Part 3: Edge Cases Seed

The following are known hard cases anticipated from the Phase 1 corpus analysis. Coders should use these as calibration anchors. **During Phase 3 coding, add new edge cases to this section as they arise.**

### EC-1: Validation followed by a single question

**Scenario:** AI validates the user's emotion, then asks a single open-ended question.
**Confusion:** Listener or Reflective Partner?
**Resolution:** Code based on **what the question does**. If the question follows the user's frame ("What was that like?") → Listener. If the question introduces a new frame ("What do you think is driving that?") → Reflective Partner. A single reframing question in an otherwise Listener sequence does not constitute a role transition — code as Listener with a note. Sustained reframing across 2+ turns = Reflective Partner.

### EC-2: Coach language in an informational context

**Scenario:** AI says "What's one step you could take?" after delivering psychoeducation.
**Confusion:** Coach or Advisor?
**Resolution:** Look at the **dominant stance of the sequence**. If the sequence is primarily psychoeducation delivery with a single action-oriented closing question → Advisor. If the sequence is primarily about building the user's capacity to act, with information as a supporting move → Coach. Code by the governing stance, not the individual turn.

### EC-3: Warm check-in at session start

**Scenario:** AI opens with "How are you doing today? Last time we talked about X."
**Confusion:** Companion or any other role beginning a session?
**Resolution:** A warm check-in is a **session-opening move**, not a role. Wait for the sequence to develop before coding. If the AI maintains relational bonding as the primary mode → Companion. If the AI transitions to inquiry, coaching, or information delivery → code the subsequent role.

### EC-4: Crisis resource delivery with empathy

**Scenario:** AI says "That sounds really difficult. Here's the crisis line number: [X]."
**Confusion:** Listener + Navigator? Navigator alone?
**Resolution:** If the empathic statement is a precursor to resource delivery and the sequence continues with resource-oriented moves → Navigator (empathy is a D4 strategy deployed within the Navigator role). If the AI sustains empathic engagement before and after the resource mention → code as role transition: Listener → Navigator.

### EC-5: AI gives advice when user didn't ask for it

**Scenario:** User is venting; AI shifts to unsolicited advice.
**Confusion:** Is this a role transition (Listener → Advisor) or a Listener boundary violation?
**Resolution:** Code as a **role transition** (Listener → Advisor), regardless of whether it was appropriate. Appropriateness is a design evaluation, not a coding judgment. Additionally flag as **Paradox-potential** if the advice implies clinical authority.

### EC-6: Reflective Partner question that leads to action

**Scenario:** AI asks "What would it look like if you handled this differently?" and user responds with a concrete plan.
**Confusion:** Reflective Partner or Coach?
**Resolution:** Code the AI's stance, not the user's response. If the AI asked an open, exploratory question → Reflective Partner in that sequence. If the AI then follows up with goal-setting and accountability tracking → code a transition to Coach.

### EC-7: Companion-like warmth from a Coach

**Scenario:** AI says "I'm really proud of how you've been handling this" during a goal-review session.
**Confusion:** Coach or Companion?
**Resolution:** Affirmation tied to *specific actions or progress* is Coach (esteem support within a goal-oriented frame). Affirmation about the *person or the relationship* without task reference is Companion. The governing stance of the sequence determines the code.

### EC-8: Navigator with psychoeducational context

**Scenario:** AI explains what a psychiatrist does before recommending the user see one.
**Confusion:** Advisor or Navigator?
**Resolution:** If the psychoeducation is in service of the referral (helping the user understand what they're being referred to) → Navigator. If the psychoeducation is the primary contribution and the referral is secondary → Advisor. **Test:** Remove the referral. Does the response still accomplish something? If yes → Advisor. If the response becomes empty → Navigator.

---

### Edge Case Template

Use this template to document new edge cases during Phase 3 coding:

```
### EC-[number]: [Short title]

**Scenario:** [Describe the conversational situation]
**Confusion:** [Which roles are confusable and why]
**Initial disagreement:** [Coder A said X, Coder B said Y]
**Resolution:** [Agreed decision and reasoning]
**Decision rule added:** [One-sentence rule to apply in future cases]
```

---

## Part 4: Coding Sheet Schema

### Fields

| Field | Type | Options / Format | Notes |
|---|---|---|---|
| **Turn ID** | Auto-generated | Sequential integer | Unique per conversation |
| **Sequence range** | String | e.g., "T1–T4" | Start and end turns of the coded sequence |
| **Primary D2 role** | Categorical | Listener / Reflective Partner / Coach / Advisor / Companion / Navigator / Ambiguous / None | One per sequence |
| **Confidence** | Ordinal (1–3) | 1 = Low, 2 = Medium, 3 = High | Coder's confidence in the role assignment |
| **D1 support type** | Categorical | Emotional / Informational / Esteem / Network / Tangible / Appraisal | Primary support type in the sequence |
| **Role transition** | Boolean | Y / N | Did a role transition occur in this conversation segment? |
| **Paradox flag** | Boolean | Y / N | Does this sequence contain an Authority-Agency Paradox instance? |
| **Paradox type** | Categorical (if flagged) | Authority-Agency gap / Therapeutic misconception / Obligation gap / Paradox-potential | Type of paradox signal |
| **Notes** | Free text | — | Coder rationale, ambiguity notes, edge case references |

### Coding Rules

1. **One primary role per sequence.** If a sequence contains a genuine role transition, split it into two sequences and code each separately.
2. **"Ambiguous" is a legitimate code.** Use it when the decision tree does not resolve to a single role after good-faith application. High Ambiguous rates in a region of the data are theoretically informative — document what made it ambiguous.
3. **"None" is for non-care turns.** Use it for system messages, greetings with no care content, or sequences where the AI is performing a non-care function (e.g., technical troubleshooting).
4. **Confidence reflects decision-tree clarity, not outcome certainty.** Confidence 3 = the decision tree produced an unambiguous result. Confidence 1 = the decision tree required judgment calls at multiple nodes.
5. **Always record rationale for Confidence 1 codes.** These are the cases that will drive codebook revision.

### File Format

Code in a spreadsheet or CSV with the following column headers:

```
conversation_id, sequence_id, turn_range, primary_d2_role, confidence, d1_support_type, role_transition, paradox_flag, paradox_type, notes
```

---

*Codebook v0.1 — AROMA Phase 3 — Pre-calibration draft*
*6 care roles · Decision tree from D2_Annotation_Protocol.md · Edge cases seeded from Phase 1 corpus*
*Expect revision after Batch 1 calibration coding (Section 3.3 of Phase 3 README)*
