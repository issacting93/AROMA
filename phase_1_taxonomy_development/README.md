# Phase 1 — Taxonomy Development (weeks 3–7)

## 1.1 Literature-Grounded Candidate Role Generation

Before touching data, generate candidate roles from literature. You already have the five (Listener, Coach, Advisor, Companion, Navigator) — but you need to stress-test them against the non-AI literature to make sure you haven't missed any.

Go through every paper in your literature matrix and ask: *does this paper imply a care role that isn't in my current five?* Specifically look at:
- Scassellati et al. (2012) — social model, facilitator, skill coach
- Fine (2010) AAT — co-therapist, handler
- Vaidyam (2019) — screener (you don't currently have an Assessment role)
- Song & Pendse (2025) — cognitive load offloader, rehearsal partner

Write a candidate role list with sources. For each candidate beyond your current five, decide explicitly: is this a distinct role, or a variant of an existing one? Document the decision.

**Likely outcome:** You'll probably add or refine one role (Assessment / Screener is the most plausible addition) and split or clarify one existing role (Advisor and Coach are conceptually close — make sure they're discriminable in practice).

## 1.2 Draft the Codebook v0.1

For each of the five (or six) roles, produce a codebook entry with:

```
Role name: Listener
Definition: The AI adopts a non-directive witnessing stance, 
            prioritizing acknowledgment and validation over guidance.

Core function (D3): Reduce felt isolation; validate emotional experience

Primary support type (D1): Emotional, Esteem
Secondary support type: Network (occasionally)
Not this role if: AI provides advice, directs behavior, or 
                  introduces new cognitive frames

Characteristic linguistic markers (D4):
  - Reflective listening: "It sounds like you're feeling..."
  - Open emotional questions: "What's that been like for you?"
  - Validation: "That makes complete sense given..."
  - No advice, directives, or information provision

Invited human role: Witness-seeker, Help-seeker
Failure mode if mismatched: User seeking guidance gets 
                              validation only → frustration

Distinguishing from Coach: Coach introduces behavioral 
goals; Listener does not.
Distinguishing from Companion: Companion implies ongoing 
relationship and mutual presence; Listener is 
session-contained.

Example turn (positive):
User: "I've been feeling so overwhelmed lately."
AI: "That sounds really heavy. What's been weighing on 
    you most?"

Example turn (negative — not Listener):
User: "I've been feeling so overwhelmed lately."
AI: "Here are three strategies for managing overwhelm..."
```

Do this for all roles. This is your most important document — everything downstream derives from it.

## 1.3 Codebook Review Session

Before any data collection, you and Ethan each independently code 20–30 short example turns (fabricated or from public sources) using the codebook. Then compare. 

Every disagreement is a codebook failure, not a coder failure. For each disagreement: identify which definition was ambiguous, rewrite it. Repeat until you can reach agreement without discussion on straightforward cases.

This step is often skipped and always regretted. A codebook that two coders interpret differently will produce unusable inter-rater reliability scores.
