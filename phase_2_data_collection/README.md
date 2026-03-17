# Phase 2 — Data Collection (weeks 6–10)

> **Prerequisite:** Phase 1 PRISMA corpus complete (100–200 papers extracted).

## Purpose

Collect two strictly separated datasets: a **development set** for building and refining the taxonomy, and a **test set** for evaluating the classification pipeline. The PRISMA extraction (Phase 1) provides the literature-derived terms; this phase provides the empirical conversation data.

---

## Steps

### 2.1 Primary Datasets
 
**Practical targets:**
- Development set: 400 conversations, ~2,000–4,000 turns
- Test set: 150 conversations, held out **completely** until Phase 5
- Balance: ≥50 conversations per care role in development set

### 2.2 Unit of Analysis

Code at **two levels**, in sequence:

1. **Conversation-level** — each conversation gets one primary care role. Faster, builds intuition.
2. **Turn-level** (subset: 100 conversations, ~500 turns) — each AI response gets a role label. Captures dynamics. This subset becomes Ethan's pipeline training target.

### 2.3 Data Preprocessing

For each conversation, extract and structure:
- Conversation ID
- Platform source
- Full turn sequence (user / AI / user / ...)
- Metadata: conversation length, topic tags, system prompt (if available)
- Initial role-term tags from Phase 1 extraction (pre-populate from PRISMA terms)

Strip PII. Check WildChat data use terms. Flag self-harm-adjacent content for sensitive handling.

### 2.4 Seed Annotation with PRISMA Terms

Use the term extraction from Phase 1 to pre-tag conversations:
- For each AI turn, auto-tag with any matching `role_terms`, `strategy_terms`, or `function_terms` from the PRISMA extraction
- This creates a warm start for human coding (Phase 3) — coders see suggested terms but are not constrained by them

---

## Deliverables

- [ ] Development set: 400 conversations, structured and preprocessed
- [ ] Test set: 150 conversations, sealed and untouched
- [ ] Pre-tagged conversational data ready for Phase 3 coding
- [ ] Data manifest: source distribution, conversation length statistics, topic distribution

## Gate Criteria

- [ ] ≥400 development conversations collected and preprocessed
- [ ] ≥150 test conversations sealed (no peeking until Phase 5)
- [ ] Balance check: each expected role represented in ≥50 conversations
