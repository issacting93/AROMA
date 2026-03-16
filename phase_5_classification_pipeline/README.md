# Phase 5 — Classification Pipeline (Ethan, weeks 16–22)

This phase is primarily Ethan's work, but you need to spec it carefully together.

## 5.1 What Ethan is Building

A classifier that takes an AI conversation turn (or a full conversation) as input and outputs:
- Primary Care Role (D2) label
- Confidence score
- Optionally: D1 support type, failure mode flag

## 5.2 Training Data Preparation

From your gold standard coding, produce a clean training dataset:
- Format: JSON or CSV with turn text + gold label + confidence + metadata
- Split: 70% train / 15% validation / 15% test (the test set is your held-out 150 conversations from Phase 2)
- **The test set must be completely untouched until final evaluation. No peeking.**
- Balance classes if needed — if Listener is over-represented, downsample or weight accordingly

## 5.3 Model Choice

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

## 5.4 Evaluation Metrics

Report per class and macro-averaged:
- Precision, Recall, F1 against the held-out test set
- Cohen's Kappa against human gold standard
- Confusion matrix — which roles does the classifier most confuse?
- Performance breakdown by conversation length, platform source, confidence level
