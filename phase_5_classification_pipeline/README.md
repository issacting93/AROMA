# Phase 5 — Classification Pipeline & Validation (weeks 16–24)

> **Shen et al. parallel:** κ = 0.7073 as their IRR benchmark.
> **AROMA equivalent:** Human annotation gold set → κ per dimension → LLM-as-judge scaling → human audit of LLM outputs.

## Purpose

Build and validate an automated classification pipeline that replicates human coding quality. This closes the methodological loop: theory → literature → coding → automation → evaluation.

---

## Steps

### 5.1 Pipeline Architecture

A classifier that takes an AI conversation turn (or full conversation) as input and outputs:
- **Primary Care Role (D2)** label + confidence score
- **Support Type (D1)** label
- **Failure mode flag** (Authority-Agency gap / role mismatch / therapeutic misconception)
- Optionally: D3–D5 labels

### 5.2 Training Data Preparation

From Phase 3 gold standard coding:
- Format: JSON with turn text + gold label + confidence + metadata
- Split: **70% train / 15% validation / 15% test**
- The **test set** is the sealed 150 conversations from Phase 2 — **completely untouched until final evaluation**
- Balance classes: if Listener is over-represented, downsample or weight

### 5.3 Model Evaluation (ordered by effort)

| Option | Approach | Training | Pros | Cons |
|--------|----------|----------|------|------|
| **A: LLM-as-judge** | GPT-4 / Claude with codebook as system prompt + few-shot examples | None | Fast iteration, strong baseline | Expensive at scale, less controllable |
| **B: Fine-tuned classifier** | BERT / RoBERTa / DeBERTa fine-tuned on gold set | ~500–1000 examples/class | Reproducible, cheaper at scale | Needs sufficient labelled data |
| **C: Two-stage** | LLM extracts linguistic markers → lightweight classifier | Hybrid | More interpretable, potentially robust | Complex pipeline |

**Start with Option A as baseline, then fine-tune Option B. Report both.** If prompt-based GPT-4 with the codebook matches human IRR, that itself is a finding about codebook quality.

### 5.4 LLM-as-Judge Protocol

For Option A:
1. System prompt = full Codebook v1.0 (from Phase 4)
2. Few-shot examples = 3 per role from the Edge Cases document
3. Input = full conversation or individual turn
4. Output = structured JSON: `{role, confidence, rationale}`

Run on validation set first. Compute agreement with gold standard. Iterate prompt until κ ≥ 0.65 on validation set.

### 5.5 Evaluation Metrics

Report per class and macro-averaged:

| Metric | Target |
|--------|--------|
| Precision, Recall, F1 | F1 ≥ 0.75 on test set |
| Cohen's κ vs. human gold | κ ≥ 0.70 (matching human IRR) |
| Confusion matrix | Which roles most confused? |
| Performance by conversation length | Degradation on long conversations? |
| Performance by platform source | Transfer across WildChat vs. Reddit? |

### 5.6 Human Audit of Pipeline Output

From the test set classifier output, sample 100 conversations stratified by:
- High-confidence correct predictions
- High-confidence incorrect predictions
- Low-confidence predictions
- Ambiguous gold labels

**Blind review:** Code without knowing gold label or pipeline output.

| Rating | Meaning |
|--------|---------|
| Agree  | Pipeline label matches human judgment |
| Partially | Close but boundary case |
| Disagree | Wrong role category |

### 5.7 Error Analysis

Systematically categorise failures:

| Failure type | Meaning | Implication |
|-------------|---------|-------------|
| **Role ambiguity** | Genuinely ambiguous in data | Task is hard, not pipeline failure |
| **Codebook boundary** | Pipeline consistently confuses two roles | Boundary definition needs sharpening |
| **Out-of-distribution** | Conversation types not in training data | Data coverage gap |
| **Authority-Agency** | Surface behaviour signals one role, structural capacity is another | Theoretically interesting — include in Discussion |

Document these for the Discussion section — they're findings, not just limitations.

---

## Deliverables

- [ ] LLM-as-judge pipeline (Option A) with system prompt
- [ ] Fine-tuned classifier (Option B) with training logs
- [ ] Evaluation report: F1, κ, confusion matrix on test set
- [ ] Human audit results: 100-conversation blind review
- [ ] Error analysis document with categorised failures
- [ ] Performance comparison: Option A vs. B

## Gate Criteria

- [ ] F1 ≥ 0.75 macro-averaged on held-out test set
- [ ] κ ≥ 0.65 against human gold standard
- [ ] Error analysis complete with ≥20 categorised failure cases
- [ ] Human audit of 100 pipeline outputs documented
