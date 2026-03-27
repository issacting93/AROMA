# AROMA Annotation Desk — Coder Guide

> **Keep this open while you code.** It walks through every screen in the tool and tells you exactly what to do at each step. When in doubt, check the decision trees below before picking a label.

---

## The AROMA Annotation Protocol

To ensure high-reliability scientific results, we follow a 9-step top-down coding protocol:

1.  **Establish Codes**: Fixed definitions from the v0.5 codebook.
2.  **Agree on Rules**: Single-select D2 roles, multi-select D3 strategies.
3.  **Independent Calibration**: Group coding of shared sequences to find edge cases.
4.  **Measure IRR**: Inter-Rater Reliability statistics are run on the calibration batch.
5.  **Reconcile**: Disagreements are discussed until consensus is reached.
6.  **Revise**: Codebook definitions are refined based on reconciliation.
7.  **Repeat**: Steps 3-6 continue until satisfactory agreement (e.g., Cohen's Kappa > 0.7).
8.  **Production**: Non-overlapping batches assigned to individuals for full coding.
9.  **Complete**: Data is finalized for analysis and model training.

---

## Before You Start

1. **Log in** with the email and password you were given. If you don't have credentials, ask the lead researcher.
2. You will see three tabs at the top: **Annotate**, **Batch**, and **Insights**. Start on **Annotate**.
3. If no conversation is loaded, click **Browse Calibration Batch** on the Batch tab to pick one.

---

## The Two Phases

Every conversation goes through two phases, always in this order. **Do not skip Phase 1.**

### Phase 1: Seeker Stance (conversation-level)

When you open a conversation, the left panel shows **only the seeker's turns**. The AI's responses are hidden. This is intentional — you need to judge the seeker's relational posture *before* seeing how the AI responded.

**Read all the seeker turns, then ask yourself:**

```
Q1: Does the seeker make explicit requests for information, advice, or resources?
│
├─ YES → ACTIVE
│
└─ NO
   │
   └─ Q2: Does the seeker engage substantively with prompts?
      │      (elaborates, asks "why" about own experience, works toward understanding)
      │
      ├─ YES → EXPLORATORY
      │
      └─ NO  → PASSIVE
              (discloses, vents, minimal engagement, shuts down)
```

**Quick reference:**

| Stance | The seeker is... | Sounds like... |
|---|---|---|
| **Passive** | Disclosing, venting, not requesting anything. Low readiness for structure. | *"I just don't know anymore." "Everything feels hopeless."* |
| **Exploratory** | Reflecting, asking "why" about themselves, engaging with reframes. Not yet action-oriented. | *"I'm not sure what I want." "Why do I keep doing this?"* |
| **Active** | Asking direct questions, seeking information, setting goals, requesting resources. | *"What should I do?" "Can you recommend a therapist?"* |

**Watch out for:**
- **Rhetorical questions are not Active.** "Why does this keep happening to me?" said in anguish = Passive, not Active. Code the stance the seeker is *in*, not the grammatical form (EC-9).
- **"You tell me" is Passive, not Active.** Deferral signals low agency, even though it sounds like a request (EC-11).
- **"Is this normal?" can go either way.** If the seeker engages with the answer as information → Active. If they use it as reassurance ("Oh thank god") → Passive. When coding before you see the response, use surrounding context (EC-12).

**In the sidebar**, select the stance and write a brief note if there's anything non-obvious (a shift, oscillation, ambiguity). Then click **Lock Stance & Reveal AI**.

**One stance per conversation.** If the seeker shifts mid-conversation, code the *dominant* stance (the one that occupies more turns) and note the shift. If roughly equal, prefer the stance the seeker ends in.

---

### Phase 2: Sequence Annotation

After you lock the stance, the left panel reveals the full transcript (seeker + AI). The coding sidebar unlocks. You now code each sequence on five dimensions.

---

#### Step 1: D1 — Support Type

*What kind of support is the AI providing in this sequence?*

| Type | Definition | Example AI move |
|---|---|---|
| **Emotional** | Empathy, sympathy, concern | *"That sounds really hard."* |
| **Informational** | Advice, facts, guidance | *"Anxiety often causes dizziness."* |
| **Esteem** | Affirming worth, strengths | *"You handled that really well."* |
| **Network** | Connecting to others, community | *"Have you talked to your sister about this?"* |
| **Tangible** | Concrete assistance, crisis resources | *"Here's the crisis line: 13 11 14."* |
| **Appraisal** | Reframing, meaning-making | *"What would it look like from their perspective?"* |

Pick the **primary** type for the sequence. If mixed, pick whichever governs the overall stance.

---

#### Step 2: D2 — Care Role

*What relational stance is the AI enacting across this sequence?*

**Use the decision tree:**

```
Q1: Is the AI Following or Leading?
│
├─ FOLLOWING (mirrors, validates, stays receptive)
│  │
│  └─ Q1a: Focus on this disclosure, or on the relationship?
│     ├─ THIS DISCLOSURE ───────────── → LISTENER
│     └─ THE RELATIONSHIP ──────────── → COMPANION
│
└─ LEADING (structures inquiry, sets goals, provides info)
   │
   └─ Q2: Focus on Internal State or External Action?
      │
      ├─ INTERNAL STATE (exploratory)
      │  └─ Facilitates user's own reframing → REFLECTIVE PARTNER
      │
      └─ EXTERNAL ACTION (goal/resource oriented)
         │
         └─ Q3: What is the AI providing?
            ├─ INFORMATION / EXPERTISE ──── → ADVISOR
            ├─ MOTIVATION / ACCOUNTABILITY → COACH
            └─ RESOURCES / REFERRALS ────── → NAVIGATOR
```

**The hard boundaries — use these tests when stuck:**

| Confusion | Test |
|---|---|
| Listener vs Reflective Partner | Does the AI introduce a perspective the seeker hadn't articulated? **Yes → Reflective Partner.** Only mirrors back → Listener. |
| Reflective Partner vs Coach | Is the AI holding the question *open* (understanding) or driving toward *closure* (action)? Open → RP. Closure → Coach. |
| Coach vs Advisor | Is the response building the seeker's capacity to act (*how*), or delivering information they don't have (*what*)? Capacity → Coach. Information → Advisor. |
| Advisor vs Navigator | Remove the referral — does the response still accomplish something? **Yes → Advisor.** Empty without it → Navigator. |
| Listener vs Companion | Listener is session-bound. Companion requires relational history or is building one. In single-session ESConv data, default to Listener. |
| Coach vs Companion | Affirmation tied to *specific actions/progress* → Coach. Affirmation about *the person or the bond* → Companion. |

**Ambiguous** is a legitimate code. Use it when the decision tree doesn't resolve after a good-faith attempt. Document what made it ambiguous in notes.

**None** is for non-care sequences: greetings with no care content, system messages, technical troubleshooting.

---

#### Step 3: D3 — Support Strategies

*What specific strategies does the AI use in this sequence?* Select all that apply.

| Strategy | What to look for |
|---|---|
| **Question** | Any question directed at the seeker |
| **Restatement/Paraphrasing** | Rephrasing what the seeker said (*"It sounds like you're saying..."*) |
| **Reflection of Feelings** | Naming or mirroring the seeker's emotions (*"You seem frustrated."*) |
| **Self-disclosure** | AI shares something about itself or its "experience" (*"That reminds me of..."*) |
| **Affirmation and Reassurance** | Validating, normalizing, encouraging (*"That's a completely normal reaction."*) |
| **Providing Suggestions** | Recommending a course of action (*"You might try..."*) |
| **Information** | Delivering factual or psychoeducational content |
| **Others** | Anything that doesn't fit the above |

---

#### Step 4: Confidence

How cleanly did the decision tree resolve?

| Level | Meaning | When to use |
|---|---|---|
| **3 — High** | Decision tree produced an unambiguous result | Most sequences |
| **2 — Medium** | Some ambiguity, but one role clearly dominates | Borderline cases where you're >70% sure |
| **1 — Low** | Multiple judgment calls needed | Hard edge cases — **notes are required** |

---

#### Step 5: Notes

Write your coding rationale here. **Required for Confidence 1.** Helpful for calibration even at higher confidence.

Good things to note:
- Which edge case applies (e.g., "EC-2: Coach language in informational context — coded Advisor because psychoeducation was the governing stance")
- What made you hesitate between two roles
- Whether the mismatch alert seems clinically meaningful or is a false positive

Click **Finalize Sequence** to save and move to the next sequence.

---

## Quick Reference Card

### Stance Decision Tree
```
Explicit request for info/advice/resources?  → ACTIVE
Engages substantively with reframes?          → EXPLORATORY
Discloses, vents, minimal engagement?         → PASSIVE
```

### Role Decision Tree
```
Following?
  This disclosure → LISTENER
  The relationship → COMPANION
Leading?
  Internal state → REFLECTIVE PARTNER
  External action:
    Information → ADVISOR
    Motivation  → COACH
    Resources   → NAVIGATOR
```

### Alignment Matrix

|  | Passive | Exploratory | Active |
|---|---|---|---|
| **Listener** | Aligned | Mild misfit | Misfit |
| **Reflective Partner** | Misfit | Aligned | Mild misfit |
| **Coach** | Misaligned | Mild misfit | Aligned |
| **Advisor** | Misaligned + Paradox risk | Mild misfit | Aligned |
| **Companion** | Aligned | Aligned | Misfit |
| **Navigator** | Misaligned + Paradox risk | Misfit | Aligned |

Paradox risk is auto-derived from this matrix — cells marked "Paradox risk" indicate high-authority roles with low-agency seekers. You don't need to flag paradox manually.

---

## Common Mistakes

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Coding the seeker's response, not the AI's stance | The seeker might respond with action to a Reflective Partner question — that doesn't make it Coach | Code what the AI *did*, not what the seeker did with it (EC-6) |
| Calling every validation "Listener" | Validation is a D3 strategy, not a role. Advisor can validate before giving advice. Navigator can validate before a referral. | Check what governs the *sequence*, not the opening sentence |

| Coding a warm opener as Companion | A check-in is a session-opening move, not a role. Wait for the sequence to develop. (EC-3) | Code based on what follows the opener |
| Treating "Why me?" as an Active question | Rhetorical questions in venting are emotional expression, not information requests (EC-9) | Code the stance the seeker is *in*, not the speech act |
| Splitting on every small shift | A single reframing question in a Listener sequence is not a role transition (EC-1) | Only split when the *governing stance* of the sequence changes for 2+ turns |

---

## When You're Done

After coding all sequences in a conversation, the tool will load the next one. If you need to switch conversations manually, use the **Batch** tab.

If you encounter a situation not covered by the edge cases (EC-1 through EC-12), write a detailed note and flag it for discussion. Use the edge case template in the codebook to draft a new entry:

```
EC-[number]: [Short title]
Scenario: [What happened]
Confusion: [Which roles and why]
Resolution: [What you decided and why]
```

These will be reviewed during calibration meetings to update the codebook.
