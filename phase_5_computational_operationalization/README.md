# Phase 5: Computational Operationalization

This phase operationalizes the 3-dimensional AROMA framework (Support Type, Care Role, Support Strategy) using computational methods on the ESConv dataset.

## Current State & Datasets

We have fully executed the **LLM-as-a-judge baseline (Step 1 & Step 2)** over a 400-turn stratified sample to generate high-quality ground-truth labels for D1 and D2 utilizing a 5-turn conversational context window.

| File | Description |
|------|-------------|
| `ESConv.json` | Full ESConv dataset — 1,300 conversations, 38,365 turns, D3 strategy labels pre-applied |
| `esconv_sample.json` | Stratified sample — 400 sequences padded with a 5-turn `context_window` |
| `esconv_d1_full.json` | 18,376 full corpus turns with rule-based heuristic D1 labels |
| `esconv_d1_llm_classified.json` | Ground-truth D1 Support Types generated via Claude 3 Haiku for the 400-turn sample |
| `esconv_d2_llm_classified.json` | Ground-truth D2 Care Roles generated via Claude 3 Haiku across the same 400-turn sample |

## Operationalization Scripts

### 1. Heuristic Pipeline (D1 Baseline)
`classify_d1_heuristic.py`: Rule-based fallback classifier mapping raw dataset strategies to D1 Support Types. Evaluated over 18,376 turns.

### 2. LLM Annotation Pipeline (D1 & D2 Ground Truth)
`classify_d1_llm.py` and `classify_d2_llm.py`: Production LLM annotators using the Anthropic API (`claude-3-haiku-20240307`) with robust exponential backoff. They parse `esconv_sample.json` applying our AROMA Codebooks to the 5-turn sliding windows.

### 3. Visualizations
`plot_results.py` / `plot_d2_results.py`: Scripts to compile and render D1/D3 distributions, D2 role breakdowns, and cross-dimensional covariance matrices (e.g. D1 x D2 heatmaps). Output saved to `figures/` and `.webp` artifacts.

## Next Step: Vector Embedding Model (Contribution C3)

Now that the high-quality 400-sequence ground-truth dataset has been generated across D1 and D2 (and matched with D3 labels), our primary focus shifts to training the **multi-task `sentence-transformers` vector embedding model**. 

By training a single encoder to predict D1, D2, and D3 natively simultaneously via 3 independent projection heads, we will empirically validate AROMA's core theoretical claim: that these 3 dimensions capture distinct, non-redundant communication patterns.

> **See `EMBEDDING_PIPELINE_INSTRUCTIONS.md` for the technical specifications of building the Step 3 Embedding Model.**
