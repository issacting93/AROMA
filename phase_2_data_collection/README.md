# Phase 2 — Data Collection

> **Prerequisite:** Phase 1 corpus complete (203 papers), Phase 2 taxonomy complete (6 roles formalized).

## Purpose

Collect and preprocess conversation data for human coding (Phase 3) and classifier evaluation (Phase 5). Two strictly separated sets: **development** (build the codebook) and **test** (evaluate the pipeline).

---

## 2.1 Data Sources

| Source | Type | Why | Access |
|---|---|---|---|
| **WildChat** (Zhao et al., 2024) | Real user–LLM conversations | Naturalistic mental health disclosures; system prompts available | HuggingFace (open) |
| **Reddit** (r/mentalhealth, r/therapy, r/anxietyhelp) | User posts + peer/bot responses | High emotional range; role transitions visible in threads | Pushshift / API |
| **Chatbot Arena** | Side-by-side LLM responses | Controlled comparison of role enactment across models | LMSYS (open) |
| **SHP / HH-RLHF** (Anthropic) | Preference-ranked AI responses | Human-preferred responses may reveal implicit role expectations | HuggingFace (open) |

**Optional (if accessible):** Wysa or 7 Cups transcripts — purpose-built mental health conversations.

### Inclusion criteria (conversation-level)

- Contains ≥1 mental health–adjacent topic (distress, coping, relationships, self-worth, loneliness, clinical questions)
- ≥3 turns (minimum for role identification per Blumer annotation unit)
- AI response present (not user-only threads)

### Exclusion criteria

- Pure information lookup with no relational component
- Non-English
- Conversations where PII cannot be adequately stripped

---

## 2.2 Sampling Targets

| Set | Conversations | Turns (est.) | Use | Sealed? |
|---|---|---|---|---|
| **Development** | 400 | ~2,000–4,000 | Codebook building, calibration, full coding | No |
| **Test** | 150 | ~750–1,500 | Pipeline evaluation only | Yes — untouched until Phase 5 |

**Balance target:** ≥50 conversations per care role in the development set. Over-sample if initial distribution skews toward Companion (likely, given WildChat patterns).

### Sampling strategy

1. **Keyword filter** — surface candidates using mental health topic terms (anxiety, depression, loneliness, therapy, coping, crisis, etc.)
2. **Role diversity pass** — manually scan filtered candidates for role diversity; flag conversations likely to contain Coach, Advisor, Navigator (underrepresented roles)
3. **Random draw** — fill remaining quota from filtered pool to avoid cherry-picking

---

## 2.3 Preprocessing

For each conversation, extract:

| Field | Description |
|---|---|
| `conversation_id` | Unique ID |
| `source` | Platform (WildChat / Reddit / Arena / etc.) |
| `turns` | Ordered sequence: `[{role: user/ai, text: ...}, ...]` |
| `n_turns` | Turn count |
| `topic_tags` | Mental health topic keywords (auto-tagged) |
| `system_prompt` | If available (WildChat provides these) |
| `flagged` | Self-harm / crisis content flag for sensitive handling |

**PII:** Strip names, locations, identifying details. Check each source's data use terms.

**Format:** One JSON file per conversation, directory split by dev/test.

---

## Deliverables

- [ ] 400 development conversations, preprocessed and structured
- [ ] 150 test conversations, sealed
- [ ] Data manifest: source distribution, turn-length distribution, topic coverage, estimated role balance
- [ ] Ethics note: PII handling, sensitive content protocol, data use compliance

## Gate Criteria

- [ ] ≥400 development + ≥150 test conversations collected
- [ ] Each role represented in ≥50 development conversations (estimated from topic/keyword proxy)
- [ ] Test set sealed with no human coding applied
