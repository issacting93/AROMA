# Phase 4 — Expert Validation & AI-Specific Extension (weeks 14–18)

> **Shen et al. parallel:** Adding "Desired Values for AI Tools" as the 5th category — psychology didn't account for technology expectations.
> **AROMA equivalent:** Adding D5 (Interaction Modality) as the AI-specific dimension + validating the taxonomy with domain experts.

## Purpose

Two goals in parallel:
1. **Expert interviews** — clinical practitioners and HCI researchers validate whether the coded roles make sense
2. **AI-specific extension** — formalise D5 (Interaction Modality) as the dimension that exists only because the provider is an AI, not a human

---

## Steps

### 4.1 AI-Specific Extension: D5 Interaction Modality

This is AROMA's equivalent of Shen's "Desired Values for AI Tools" — the dimension that **cannot** be derived from human-human care literature because it only exists in human-AI interactions.

**Candidate D5 features** (from PRISMA extraction + conversation coding):

| Feature | Description | Why AI-specific |
|---------|-------------|-----------------|
| Turn-taking structure | Synchronous vs. asynchronous, proactive vs. reactive | Humans don't send "check-in" messages on schedule |
| Availability pattern | 24/7 vs. session-bounded vs. crisis-triggered | Fundamentally different from human availability |
| Memory / continuity | Stateless vs. cross-session memory vs. decay | Humans have organic memory; AI memory is designed |
| Personalisation depth | Generic vs. history-informed vs. adaptive | AI can personalise at scale in ways humans can't |
| Multimodal affordances | Text-only vs. voice vs. emoji vs. structured exercises | Interaction modalities unique to digital interfaces |
| Escalation protocol | How/whether the AI refers to human care | No human-human equivalent |

**Deliverable:** A formal D5 specification with sub-dimensions, coded examples, and a rationale for why each is AI-native (not just "also present in human care").

### 4.2 Expert Recruitment

Target: **8–12 participants**, mixed:

| Type | Count | What they validate |
|------|-------|-------------------|
| Licensed therapists / counselors | 3–4 | Clinical validity — do these roles map to known care stances? |
| Peer support workers with lived experience | 2–3 | User-side validity — do these roles match user experience? |
| HCI researchers (mental health AI) | 2–3 | Design validity — are the dimensions actionable for system design? |

> Avoid recruiting only therapists — they evaluate against a clinical standard that AI genuinely cannot meet, which will dominate findings.

### 4.3 Interview Protocol (60–75 min, semi-structured)

**Section 1 — Background (10 min)**
- Their role, experience with mental health AI, views on AI in care

**Section 2 — Taxonomy Review (25 min)**
Present the five care roles with definitions and example turns. For each:
- Does this role resonate with care roles you've seen or use yourself?
- Is the boundary between this role and [adjacent role] clear?
- What's missing from this definition?
- What would it look like for AI to enact this role well vs. poorly?

**Section 3 — Coded Examples (20 min)**
Show 8–10 coded conversation excerpts (2 per role). Ask: do you agree with the coding?

**Section 4 — Authority-Agency Paradox (10 min)**
"We've found that users often ascribe authority to AI that it structurally can't act on. Does that match your observations? Where does it cause the most harm?"

### 4.4 Expert Analysis

- Thematic analysis of interview transcripts
- Report: which role definitions validated, contested, gaps identified
- Taxonomy revision based on expert feedback

### 4.5 Produce Codebook v1.0

After expert interviews, produce the final codebook version:
- All role definitions refined based on expert feedback
- D5 (Interaction Modality) formally added with coded examples
- Decision rules updated from expert input
- Document all changes from v0 → v1.0 with rationale

---

## Deliverables

- [ ] D5 Interaction Modality specification (sub-dimensions + examples)
- [ ] Expert interview transcripts (8–12 participants)
- [ ] Thematic analysis summary
- [ ] Codebook v1.0 — the version used for remaining coding and pipeline training
- [ ] Revision log: v0 → v1.0 changes with rationale

## Gate Criteria

- [ ] ≥8 expert interviews completed
- [ ] D5 specification validated by ≥2 HCI researchers
- [ ] Codebook v1.0 signed off by Vedant
- [ ] No role definition contested by >50% of experts without resolution
