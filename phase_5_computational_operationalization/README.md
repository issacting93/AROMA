# AROMA D1 Classification Pipeline

## What's here

| File | Description |
|------|-------------|
| `ESConv.json` | Full ESConv dataset — 1,300 conversations, 38,365 turns, D3 strategy labels pre-applied |
| `esconv_sample.json` | Stratified sample — 400 supporter turns (50 per strategy) |
| `prepare_sample.py` | Script that extracts and stratifies the sample from ESConv.json |
| `classify_d1_heuristic.py` | Rule-based D1 classifier (first pass, no API needed) |
| `classify_d1_llm.py` | LLM-as-judge D1 classifier (requires Anthropic API key) |
| `esconv_d1_classified.json` | 400 sample turns with heuristic D1 labels |
| `esconv_d1_full.json` | 18,376 full corpus turns with heuristic D1 labels |

## How to run

### Heuristic (immediate, no API)
```bash
python classify_d1_heuristic.py
```
Produces `esconv_d1_full.json` with rule-based D1 labels on all 18,376 supporter turns.

### LLM-as-judge (requires API key)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
pip install httpx
python classify_d1_llm.py
```
Classifies the 400-turn sample using Claude Sonnet. Produces `esconv_d1_llm_classified.json`.

To scale to full corpus: modify `classify_d1_llm.py` to load `esconv_d1_full.json` instead of `esconv_sample.json`.

## Heuristic results (full corpus)

| Support Type | Count | % |
|---|---|---|
| Emotional | 10,561 | 57.5% |
| Informational | 7,138 | 38.8% |
| Network | 369 | 2.0% |
| Esteem | 211 | 1.1% |
| Appraisal | 49 | 0.3% |
| Tangible | 48 | 0.3% |

## Next steps

1. **Run LLM pipeline** on 400-turn sample → compare with heuristic labels → measure agreement
2. **Human gold set** — two coders label ~200 turns manually → report Cohen's κ → use as ground truth
3. **Refine codebook** based on disagreements between heuristic, LLM, and human labels
4. **Scale LLM pipeline** to full 18,376 turns with refined codebook
5. **Proceed to Step 2** — D2 Care Role classification (sequence-level)

## Codebook (D1 Support Types)

Based on Cutrona & Suhr (1992) Social Support Behavior Code:

1. **Emotional** — sympathy, care, concern, empathy, encouragement
2. **Esteem** — affirming worth, abilities, strengths, competence
3. **Informational** — advice, suggestions, facts, guidance, teaching
4. **Network** — connecting to others, communities, reducing isolation
5. **Tangible** — concrete assistance, resources, practical help
6. **Appraisal** — reframing, reinterpreting, meaning-making
