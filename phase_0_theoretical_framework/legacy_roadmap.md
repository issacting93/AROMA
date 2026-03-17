This is a solid pipeline and maps cleanly onto a CHI methods section. Let me build it out in full.

---

# AROMA: Step-by-Step Research & Writing Guide

---

## Phase 0 — Theoretical Framework (now → 3 weeks)

This is the work you've already mostly done. The goal of this phase is to lock it down into a citable, stable document before touching any data, because every downstream decision depends on it.

**0.1 Finalize the 5-dimension framework**

Write a 2–3 page internal spec document defining each dimension with:
- A formal definition (one sentence, precise enough to code against)
- What it is *not* (negative definition — the hardest part)
- 2–3 worked examples
- The theoretical lineage (which prior paper anchors it)

The definition of D2 (Care Role) is the most critical because everything else is relative to it. Lock this before writing a single codebook entry. A working definition: *A care role is a stable relational stance that an AI agent adopts toward a user in distress, characterized by a distinctive core function, a dominant support type, and a characteristic set of linguistic strategies — and that invites a complementary human role in return.*

**0.2 Derive the human-role compatibility matrix**

You've sketched this already (help-seeker, witness-seeker, client, patient, peer-seeker, caregiver, advocate, self-manager). Write it up formally as a 2-column table: Care Role → Invited Human Role → Compatibility prediction → Failure mode when mismatched. This becomes Figure 1 or the theoretical framework figure in the paper.

**0.3 Write the theoretical argument**

Draft the argument that motivates the taxonomy — approximately 800 words:
- The field conflates D1 (support type) and D2 (care role)
- Existing taxonomies are either empirically ungrounded, system-level rather than interactional, or user-constructed but unformalized
- The Parsonian sick role shows why role matters: each care role presupposes different things from the provider, and AI can only viably instantiate some of them
- Therefore a multi-dimensional role ontology is needed that separates support type, care role, core function, support strategy, and modality

This draft becomes your Related Work and Introduction sections later. Writing it now forces you to identify any gaps in the theoretical structure before you commit to a data collection design.

**Deliverable:** A locked internal framework spec. If you can't write the codebook from it, the framework isn't stable enough yet.

---

## Phase 1 — Taxonomy Development (weeks 3–7)

### 1.1 Literature-Grounded Candidate Role Generation

Before touching data, generate candidate roles from literature. You already have the five (Listener, Coach, Advisor, Companion, Navigator) — but you need to stress-test them against the non-AI literature to make sure you haven't missed any.

Go through every paper in your literature matrix and ask: *does this paper imply a care role that isn't in my current five?* Specifically look at:
- Scassellati et al. (2012) — social model, facilitator, skill coach
- Fine (2010) AAT — co-therapist, handler
- Vaidyam (2019) — screener (you don't currently have an Assessment role)
- Song & Pendse (2025) — cognitive load offloader, rehearsal partner

Write a candidate role list with sources. For each candidate beyond your current five, decide explicitly: is this a distinct role, or a variant of an existing one? Document the decision.

**Likely outcome:** You'll probably add or refine one role (Assessment / Screener is the most plausible addition) and split or clarify one existing role (Advisor and Coach are conceptually close — make sure they're discriminable in practice).

### 1.2 Draft the Codebook v0.1

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

### 1.3 Codebook Review Session

Before any data collection, you and Ethan each independently code 20–30 short example turns (fabricated or from public sources) using the codebook. Then compare. 

Every disagreement is a codebook failure, not a coder failure. For each disagreement: identify which definition was ambiguous, rewrite it. Repeat until you can reach agreement without discussion on straightforward cases.

This step is often skipped and always regretted. A codebook that two coders interpret differently will produce unusable inter-rater reliability scores.

---

## Phase 2 — Data Collection (weeks 6–10, overlapping with Phase 1)

You need two datasets: a **development set** for building and refining the taxonomy, and a **test set** for evaluating the classification pipeline. Keep them strictly separate from the start.

### 2.1 Primary Dataset: Public Human-AI Conversations

**Source 1: WildChat (you already have experience here)**
- Filter for mental health adjacent conversations
- Search terms / topic classifier: anxiety, depression, stress, loneliness, grief, relationship problems, self-harm adjacent (careful with this), burnout, feeling overwhelmed, seeking support
- Target: 500–1000 conversations for development; 200–300 held out for test
- Key advantage: large scale, naturalistic, no recruitment required
- Key disadvantage: WildChat is general-purpose GPT use — care roles may be enacted inconsistently or not at all

**Source 2: Chatbot Arena / LMSYS**
- Filter for emotionally valenced or support-seeking prompts
- Useful for comparing how different LLMs enact (or fail to enact) care roles

**Source 3: Reddit mental health posts + AI response threads**
- r/ChatGPT, r/mentalhealth, r/therapy — users sharing AI interactions
- Li et al. (2025) used this approach; you have methodological precedent
- Useful for capturing user-initiated role assignment (people prompting GPT into specific roles)

**Source 4 (if you can get it): Wysa or 7 Cups public data**
- More clinically structured; roles may be more consistently enacted
- Likely requires IRB + data agreement — start this conversation early if you want it

**Practical target:**
- Development set: 400 conversations, ~2000–4000 turns
- Test set: 150 conversations, held out completely until pipeline evaluation
- Balance: at least 50 conversations per care role in the development set

### 2.2 Unit of Analysis Decision

You need to decide this now and stick to it throughout. Two options:

**Conversation-level coding:** Each conversation gets one primary care role label. Simpler, faster to code, easier to evaluate — but loses within-conversation role dynamics.

**Turn-level coding:** Each AI response turn gets a care role label. More granular, captures role switching, much richer data — but 5–10× more coding effort.

**Recommendation:** Do both, in sequence. Code at conversation level first to build intuition and inter-rater reliability quickly. Then code a subset (100 conversations, ~500 turns) at turn level to capture dynamics. The turn-level subset becomes your most valuable dataset and Ethan's pipeline training target.

### 2.3 Data Preprocessing

For each conversation in your dataset, extract and structure:
- Conversation ID
- Platform source
- Full turn sequence (user turn / AI turn / user turn...)
- Metadata: conversation length, topic tags, any available system prompt

Strip personally identifying information. If using WildChat, check their data use terms — they permit research use but have restrictions on certain categories.

---

## Phase 3 — Human Coding (Gold Standard) (weeks 9–16)

This is the core methodological contribution. The quality of everything downstream — the taxonomy's validity, the pipeline's evaluation — depends entirely on this.

### 3.1 Coding Protocol

**Setup:**
- Use a purpose-built annotation tool. Prodigy (from Explosion AI, the spaCy team) is excellent for this and handles inter-rater workflows well. Alternatively, a structured Google Sheet with explicit column definitions works fine at your scale.
- Code in two passes per conversation: first pass for primary care role (D2), second pass for support type (D1) and a brief rationale note

**Per-turn coding schema (turn-level):**

| Field | Type | Options |
|---|---|---|
| Turn ID | string | auto |
| Primary Care Role | categorical | Listener / Coach / Advisor / Companion / Navigator / Ambiguous / None |
| Confidence | 3-point | High / Medium / Low |
| Primary Support Type | categorical | Emotional / Esteem / Informational / Network / Instrumental |
| Role shift from prior turn | boolean | Yes / No |
| Failure mode present | boolean | Yes / No |
| Failure mode type | categorical | Authority-Agency gap / Role mismatch / Therapeutic misconception / Other |
| Notes | free text | |

**Ambiguous** is a legitimate label — do not force every turn into a clean category. High ambiguity rates in a region of the data tell you something theoretically important.

### 3.2 Inter-Rater Reliability Protocol

You (Issac) and Ethan code the same sample independently, then compare.

**Batching:**
- Batch 1 (calibration): 30 conversations, code independently, compare, rewrite codebook
- Batch 2 (reliability check): 50 conversations, code independently, compute IRR before discussion
- Remaining development set: split between you and Ethan, with 20% overlap for ongoing IRR monitoring

**IRR metric:**
Use Cohen's Kappa (κ) for the categorical labels. Target κ ≥ 0.70 for primary care role before proceeding to large-scale coding. κ ≥ 0.60 is acceptable with documented disagreement analysis; below 0.60 means the codebook needs revision.

For the paper, you'll report:
- κ per dimension (D1, D2 separately)
- Disagreement analysis: which role pairs were most confused, and why
- Codebook revision history (brief — shows methodological rigor)

### 3.3 Adjudication

For every disagreement, you and Ethan discuss and reach consensus. Document the resolution decision. These adjudicated cases are your gold standard — they also serve as a codebook extension, because recurring disagreement types become decision rules.

Build a living document: **"Edge Cases and Decision Rules"** — every time you resolve a hard case, add a brief entry. By the end of coding you'll have 30–50 entries. These go in the Appendix of the paper and are invaluable for reproducibility.

### 3.4 Taxonomy Validation Pass

After coding ~200 conversations, pause and look at the distribution. Ask:

- Are all five roles represented, or are some rarely occurring? If a role appears in fewer than 5% of conversations, either the data source doesn't capture it or the role definition is too narrow
- Are there consistent cluster of Ambiguous cases that suggest a missing role?
- Do any two roles have high confusion rates that suggest they should be merged?

This is where the taxonomy gets empirically grounded rather than just theoretically derived. You may need to revise role definitions, split a role, or collapse two. That's expected and scientifically appropriate — document it as iterative taxonomy refinement.

---

## Phase 4 — Expert Validation (weeks 14–18, overlapping with coding)

Human coding gives you empirical grounding from conversation data. Expert interviews give you clinical validity — do these roles make sense to practitioners?

### 4.1 Participant Recruitment

Target: 8–12 participants. Mix of:
- Licensed therapists or counselors (3–4) — clinical validity
- Peer support workers with lived experience (2–3) — user-side validity
- HCI researchers working on mental health AI (2–3) — design validity

Avoid recruiting only therapists — they will evaluate against a clinical standard that AI genuinely cannot meet, which will dominate the findings. You want a range of perspectives on what "good enough" looks like.

### 4.2 Interview Protocol

Semi-structured, 60–75 minutes, via video call.

**Section 1 — Background (10 min):** Their role, experience with mental health AI, views on AI in care contexts.

**Section 2 — Taxonomy review (25 min):** Present the five care roles with definitions and example turns. For each role ask:
- Does this role resonate with care roles you've seen or use yourself?
- Is the boundary between this role and [adjacent role] clear to you?
- What's missing from this definition?
- What would it look like for an AI to enact this role well vs. poorly?

**Section 3 — Coded examples (20 min):** Show 8–10 coded conversation excerpts (2 per role). Ask: do you agree with the coding? What would you label this instead?

**Section 4 — Authority-Agency paradox (10 min):** "We've found that users often ascribe authority to AI that it structurally can't act on — for example, treating Woebot as if it has clinical judgment. Does that match your observations? Where does it cause the most harm?"

**Analysis:** Thematic analysis of interview transcripts. Report: which role definitions were validated, which were contested, which gaps were identified, and how the taxonomy was revised in response.

### 4.3 Taxonomy Revision

After expert interviews, produce Codebook v1.0 — the version used for the remaining coding and as the pipeline training target. Document all changes from v0 with rationale.

---

## Phase 5 — Classification Pipeline (Ethan, weeks 16–22)

This phase is primarily Ethan's work, but you need to spec it carefully together.

### 5.1 What Ethan is Building

A classifier that takes an AI conversation turn (or a full conversation) as input and outputs:
- Primary Care Role (D2) label
- Confidence score
- Optionally: D1 support type, failure mode flag

### 5.2 Training Data Preparation

From your gold standard coding, produce a clean training dataset:
- Format: JSON or CSV with turn text + gold label + confidence + metadata
- Split: 70% train / 15% validation / 15% test (the test set is your held-out 150 conversations from Phase 2)
- **The test set must be completely untouched until final evaluation. No peeking.**
- Balance classes if needed — if Listener is over-represented, downsample or weight accordingly

### 5.3 Model Choice

Ethan should evaluate in this order:

**Option A: Prompt-based classification with GPT-4 / Claude**
- Provide the codebook as a system prompt, ask for classification per turn
- Surprisingly strong baseline, especially with few-shot examples
- Fast to iterate, no training required
- Weakness: expensive at scale, less controllable

**Option B: Fine-tuned smaller model (BERT / RoBERTa / DeBERTa)**
- Fine-tune on your gold standard training set
- More reproducible and cheaper at scale than Option A
- Requires ~500–1000 labeled examples per class to work well

**Option C: Two-stage (LLM for feature extraction → classifier)**
- Use an LLM to extract linguistic markers per turn, then train a lightweight classifier on those features
- More interpretable, potentially more robust

**Recommendation:** Start with Option A as baseline, then fine-tune Option B. Report both. The comparison is itself a finding — if prompt-based GPT-4 with your codebook matches human IRR, that's a strong result about codebook quality.

### 5.4 Evaluation Metrics

Report per class and macro-averaged:
- Precision, Recall, F1 against the held-out test set
- Cohen's Kappa against human gold standard
- Confusion matrix — which roles does the classifier most confuse?
- Performance breakdown by conversation length, platform source, confidence level

---

## Phase 6 — Human Evaluation of Pipeline (weeks 22–24)

This closes the loop and is what makes the paper methodologically complete.

### 6.1 Sample for Evaluation

From the classifier's output on the test set, sample 100 conversations stratified by:
- High-confidence correct predictions
- High-confidence incorrect predictions
- Low-confidence predictions
- Edge cases (Ambiguous labels)

### 6.2 Blind Human Review

You (and optionally a third coder who hasn't seen the pipeline) review the pipeline's output without knowing the gold standard label. Rate each:
- Do you agree with the label? (Yes / Partially / No)
- If no, what would you label it?
- Is the error a category error (wrong role) or a boundary error (between two adjacent roles)?

### 6.3 Error Analysis

Systematically analyze where the pipeline fails. Categories of failure:
- **Role ambiguity failures:** Cases that are genuinely ambiguous in the data (the pipeline didn't fail — the task is hard)
- **Codebook boundary failures:** The pipeline consistently confuses two roles (e.g. Listener vs. Companion) — this suggests the boundary definition needs refinement
- **Out-of-distribution failures:** Conversation types the training data didn't cover
- **Authority-Agency failures:** Cases where the AI's linguistic behavior signals one role but its actual capacity is another — the pipeline codes the surface behavior but misses the structural mismatch

Document these and include in the Discussion section — they're theoretically interesting, not just methodological limitations.

---

## Phase 7 — Writing the Paper (weeks 22–28)

### Structure

| Section | Source | Length |
|---|---|---|
| Abstract | Written last | 150 words |
| Introduction | Phase 0 theoretical argument | 600–800 words |
| Related Work | Literature matrix + cross-reference analysis | 1000–1200 words |
| Framework | Phase 0 spec + human-role matrix | 600–800 words |
| Taxonomy Development | Phase 1 + 1.3 codebook | 600 words |
| Data & Corpus | Phase 2 | 400 words |
| Human Coding | Phase 3 | 600 words |
| Expert Validation | Phase 4 | 500 words |
| Classification Pipeline | Phase 5 | 600 words |
| Evaluation | Phase 6 | 500 words |
| Discussion | Synthesis, limitations, implications | 800–1000 words |
| Conclusion | 200 words | |

Total: ~7000–8000 words for a CHI full paper.

### Writing Order

Do not write front to back. Write in this order:

1. **Method sections first** (Phases 2–4) — you know exactly what you did, these write cleanly from your protocol documents
2. **Results** — write up your findings as factual reporting
3. **Discussion** — now that you know what you found, you know what to argue
4. **Related Work** — you know what you need to establish, so you can write it precisely
5. **Introduction** — written last, frames the paper around what you actually found rather than what you expected
6. **Abstract** — last of all

### The Core Contribution Statement

Every section should be organized around this sentence, which you should write now and pin above your desk:

> *AROMA provides the first empirically-grounded, multi-dimensional care role taxonomy for AI mental health systems, derived from corpus analysis and validated by domain experts, with a care role distinction — separating relational stance from support type — that predicts which human-AI care configurations are viable and which produce therapeutic misconception.*

If a section doesn't serve that sentence, cut it or reframe it.

---

## Timeline Summary

| Phase | Weeks | Owner | Gate |
|---|---|---|---|
| 0 — Framework lock | 1–3 | Issac | Framework spec signed off by Vedant |
| 1 — Taxonomy + codebook | 3–7 | Issac | κ ≥ 0.70 on calibration batch |
| 2 — Data collection | 6–10 | Issac | 400 dev + 150 test conversations |
| 3 — Human coding | 9–16 | Issac + Ethan | Gold standard complete; κ reported |
| 4 — Expert interviews | 14–18 | Issac | Codebook v1.0 produced |
| 5 — Pipeline | 16–22 | Ethan | F1 ≥ 0.75 on test set |
| 6 — Evaluation | 22–24 | Issac | Error analysis complete |
| 7 — Writing | 22–28 | Issac | CHI 2027 submission |

The most important gate is the codebook IRR at week 7. If you can't achieve κ ≥ 0.70 at that point, everything downstream is compromised. Build in time to iterate on the codebook — this is the phase most papers underestimate.

---

## What to Do This Week

1. Write the framework spec document (Phase 0.1) — 2–3 pages, definitions only
2. Draft codebook v0.1 entries for Listener and Coach (Phase 1.2) — these are the most discriminable roles and the easiest to start with
3. Set up WildChat data access and run preliminary topic filtering to confirm mental health conversations are extractable at the volume you need

Everything else waits until the framework is stable.