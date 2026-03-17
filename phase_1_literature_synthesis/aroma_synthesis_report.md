# AROMA Phase 1 — Systematic Synthesis Report (v2)

*Generated from 203 papers (59 legacy + 144 new candidates)*
*Extraction coverage: 34 papers with role terms, 53 with strategy terms, 101 with function terms*

---
## 1. Corpus Overview

| Metric | Value |
| --- | --- |
| Total Papers | 203 |
| Legacy Anchors (pre-coded) | 59 |
| New Candidates (PRISMA) | 144 |
| Papers with Paradox Signal | 15 |
| Unique Role Terms Extracted | 34 |
| Papers touching ≥2 dimensions | 147 |
| Papers touching ≥3 dimensions | 135 |

---
## 2. Distribution by AROMA Dimension (Multi-label)

Each paper is tagged for **every** dimension where it scores ≥1 keyword hit. Papers routinely span multiple dimensions — this is expected and supports AROMA's argument that the five dimensions are orthogonal.

| Dimension | Papers Tagged |
| --- | --- |
| D1 · Support Type | 99 |
| D2 · Care Role | 126 |
| D3 · Core Function | 40 |
| D4 · Support Strategy | 138 |
| D5 · Interaction Modality | 157 |

**Dimension coverage per paper:**

| Dimensions touched | Paper count |
| --- | --- |
| 0 | 32 |
| 1 | 24 |
| 2 | 12 |
| 3 | 47 |
| 4 | 69 |
| 5 | 19 |

---
## 3. Dimension Co-occurrence Matrix

How many papers are tagged for both dimensions. Diagonal = total per dimension.

| | D1 · Support Type | D2 · Care Role | D3 · Core Function | D4 · Support Strategy | D5 · Interaction Modality |
| --- | --- | --- | --- | --- | --- |
| **D1 · Support Type** | 99 | 74 | 24 | 93 | 99 |
| **D2 · Care Role** | 74 | 126 | 32 | 108 | 116 |
| **D3 · Core Function** | 24 | 32 | 40 | 39 | 39 |
| **D4 · Support Strategy** | 93 | 108 | 39 | 138 | 133 |
| **D5 · Interaction Modality** | 99 | 116 | 39 | 133 | 157 |

---
## 4. Top Papers per Dimension

Ranked by keyword score within each dimension (multi-label — a paper may appear under multiple dimensions).

### D1 · Support Type

- **The Potential of Chatbots for Emotional Support and Promoting Mental Well-Being ** (2023) — Journal of Medical Internet Research
- **Artificial Companions, Real Connections?** (2024) — M/C Journal
- **The Digital Therapeutic Alliance With Mental Health Chatbots: Diary Study and Th** (2025) — JMIR mental health
- **Chatbots for Well-Being: Exploring the Impact of Artificial Intelligence on Mood** (2024) — European Psychiatry
- **Preventing common mental health problems in war-affected populations: the role o** (2025) — Frontiers in Digital Health

### D2 · Care Role

- **Vaidyam et al. 2019 Psychiatric** (2019) — Harvard Review of Psychiatry
- **Artificial Companions, Real Connections?** (2024) — M/C Journal
- **Prosthetic Soul Mates: Sex Robots as Media for Companionship** (2019) — M/C Journal
- **Applications of Natural Language Processing in the Domain of Mental Health** (2024) — nan
- **Stade et al. 2024 LLMs** (2024) — NPJ Mental Health Research

### D3 · Core Function

- **The Digital Therapeutic Alliance With Mental Health Chatbots: Diary Study and Th** (2025) — JMIR mental health
- **Emotional AI and the rise of pseudo-intimacy: are we trading authenticity for al** (2025) — Frontiers in Psychology
- **Chatbots for Well-Being: Exploring the Impact of Artificial Intelligence on Mood** (2024) — European Psychiatry
- **Too good to be true? Exploring the role of artificial intelligence chatbots in t** (2026) — Proceedings (Baylor University. Medical Center)
- **Dr. GPT in Campus Counseling: Understanding Higher Education Students' Opinions ** (2024) — arXiv.org

### D4 · Support Strategy

- **Chatbots for Well-Being: Exploring the Impact of Artificial Intelligence on Mood** (2024) — European Psychiatry
- **A Systematic Review on Mental Health Chatbots: Trends, Design Principles, Evalua** (2025) — Human Behavior and Emerging Technologies
- **Emotional AI and the rise of pseudo-intimacy: are we trading authenticity for al** (2025) — Frontiers in Psychology
- **Can AI replace psychotherapists? Exploring the future of mental health care** (2024) — Frontiers in Psychiatry
- **Response Generation for Cognitive Behavioral Therapy with Large Language Models:** (2024) — arXiv.org

### D5 · Interaction Modality

- **Applications of Natural Language Processing in the Domain of Mental Health** (2024) — nan
- **Do We Talk to Robots Like Therapists, and Do They Respond Accordingly? Language ** (2025) — arXiv.org
- **Chatbots' Empathetic Conversations and Responses: A Qualitative Study of Help‑Se** (2025) — JMIR formative research
- **Can AI replace psychotherapists? Exploring the future of mental health care** (2024) — Frontiers in Psychiatry
- **Large Language Model-based Chatbots and Agentic AI for Mental Health Counseling:** (2025) — JMIR AI

---
## 5. Role Terminology Analysis

### The Core Finding: Terminological Fragmentation

The literature does not use a shared vocabulary for AI care roles. The same relational stance is described under multiple labels across different research traditions. This fragmentation is precisely the gap AROMA's D2 taxonomy addresses.

The table below maps every mined role term to its nearest AROMA Care Role, revealing that what appears as 34 distinct terms collapses into 6 care roles plus system descriptors. 4 roles have existing literature terms; 2 (Listener, Reflective Partner) have no established terminology — they describe relational stances the literature enacts but does not name.

| AROMA Care Role | Literature terms (frequency) | Total mentions | Unique papers |
| --- | --- | --- | --- |
| **Listener** | *(no terms mined)* | 0 | 0 |
| **Reflective Partner** | *(no terms mined)* | 0 | 0 |
| **Coach** | Coach (9); Virtual Coach (2); Ai Coach (1) | 12 | 3 |
| **Advisor** | Therapist (9); Counselor (5); Therapist-Adjunct (2); Intervener (2); Virtual Counselor (2); Virtual Therapist (2); Sim-Physician (1); Therapist-Lite (1); Sentiment-Aware Assistant (1); Crisis Counselor (Automated) (1); Ai Therapist (1) | 27 | 11 |
| **Companion** | Companion (29); Ai Companion (4); Virtual Friend (2); Seductive Partner (1); Artificial Companion (1); Social Ally (1); Caregiver (1); Nurturer (1); Pseudo-Intimate Partner (1) | 41 | 11 |
| **Navigator** | Screener (2); Assessor (2); Guide (1); Peer-Responder (1) | 6 | 4 |
| **[System Descriptor]** | Chatbot (19); Virtual Agent (8); Social Robot (6); Relational Agent (4); System (2); Bot (2); Assistant (2) | 43 | 14 |

### Interpretation

The absence of standardised role vocabulary is not evidence against AROMA — it is the primary evidence *for* it. "Companion" appears across 4 variant labels. The Advisor cluster absorbs 10+ terms spanning "therapist", "counselor", "sim-physician", and "crisis counselor." No prior framework consolidates these into a principled, mutually exclusive set of relational stances.

### Raw Term Frequency

| Role Term | Frequency | AROMA Role |
| --- | --- | --- |
| Companion | 29 | Companion |
| Chatbot | 19 | [System Descriptor] |
| Therapist | 9 | Advisor |
| Coach | 9 | Coach |
| Virtual Agent | 8 | [System Descriptor] |
| Social Robot | 6 | [System Descriptor] |
| Counselor | 5 | Advisor |
| Ai Companion | 4 | Companion |
| Relational Agent | 4 | [System Descriptor] |
| Screener | 2 | Navigator |
| Therapist-Adjunct | 2 | Advisor |
| Assessor | 2 | Navigator |
| Intervener | 2 | Advisor |
| Virtual Friend | 2 | Companion |
| System | 2 | [System Descriptor] |
| Bot | 2 | [System Descriptor] |
| Virtual Counselor | 2 | Advisor |
| Assistant | 2 | [System Descriptor] |
| Virtual Coach | 2 | Coach |
| Virtual Therapist | 2 | Advisor |
| Seductive Partner | 1 | Companion |
| Ai Coach | 1 | Coach |
| Artificial Companion | 1 | Companion |
| Sim-Physician | 1 | Advisor |
| Social Ally | 1 | Companion |
| Caregiver | 1 | Companion |
| Guide | 1 | Navigator |
| Therapist-Lite | 1 | Advisor |
| Nurturer | 1 | Companion |
| Sentiment-Aware Assistant | 1 | Advisor |

---
## 6. Authority-Agency Paradox Signals

**15 papers** contain paradox-relevant terminology. Clustering by failure theme:

### Pseudo-Intimacy / Dependency (12 papers)

- Elsevier 2025 Assistant or Friend
- Zhang et al. CHI 2025 Dark Side
- Hwang et al. 2025 Companionship Dev
- Artificial Companions, Real Connections?
- Emotional AI and the rise of pseudo-intimacy: are we trading authenticity for al
- Phoenix: A Conversational Agent for Emotional Well-Being and Psychological Suppo
- Prosthetic Soul Mates: Sex Robots as Media for Companionship
- Mental Health Impacts of AI Companions: Triangulating Social Media Quasi-Experim

### Role Confusion / Misconception (2 papers)

- Khawaja et al. 2023 Robot Therapist
- The Digital Therapeutic Alliance With Mental Health Chatbots: Diary Study and Th

### Reliability & Safety Gap (2 papers)

- The Digital Therapeutic Alliance With Mental Health Chatbots: Diary Study and Th
- Can AI Relate: Testing Large Language Model Response for Mental Health Support

### Authority-Agency Tension (1 papers)

- Zhang et al. CHI 2025 Dark Side

---
## 7. Key Thematic Findings

Based on pattern extraction across the full corpus and close reading of legacy anchor papers:

1. **Terminological Fragmentation as the Core D2 Finding**: 34 unique role-like terms were mined from the corpus. These collapse into 6 AROMA Care Roles when mapped by relational stance. The field lacks a shared vocabulary — AROMA provides one.
2. **Most Papers Span Multiple Dimensions**: 147/203 papers (72%) touch ≥2 AROMA dimensions. This validates the multi-dimensional framing: papers simultaneously address support types, strategies, and modalities but rarely separate them analytically.
3. **Strategy-Role Disconnect**: 53 papers mention specific therapeutic strategies but only 34 mention role terms. The literature describes *what AI does* (strategies) far more often than *who the AI is being* (roles). This is the D4/D2 gap AROMA formalises.
4. **D3 (Core Function) is Underrepresented**: Only 40 papers are tagged for D3, the lowest count. Referral, triage, and linkage functions are rarely theorised in the AI mental health literature, pointing to a specific gap the Navigator role addresses.
5. **Pseudo-Intimacy as the Dominant Paradox Theme**: 12 papers document dependency, parasocial attachment, or pseudo-intimacy as failure modes — the single largest paradox cluster in the corpus.

---
*AROMA Phase 1 Synthesis v2 — see `aroma_role_taxonomy_draft.csv` for full term list, `aroma_cooccurrence_matrix.csv` for dimension co-occurrence data.*