# C3 Embedding Model — Build Instructions for Ethan

## Goal

Replace the LLM-as-judge classifier (`classify_d1_llm.py`) with a vector embedding model that classifies ESConv supporter turns along all 3 AROMA dimensions simultaneously:

- **D1** — Support Type (Emotional, Esteem, Informational, Network, Tangible, Appraisal)
- **D2** — Care Role (Listener, Reflective Partner, Coach, Advisor, Navigator, Companion)
- **D3** — Support Strategy (Question, Restatement/Paraphrasing, Reflection of Feelings, Self-disclosure, Affirmation and Reassurance, Providing Suggestions, Information, Others)

D3 labels already exist in the ESConv dataset. D1 labels come from the heuristic classifier. D2 labels don't exist yet — they need to be generated (see Step 4).

This is **Contribution C3** in the CHI paper: "A computational operationalization that classifies conversational turns along AROMA's three dimensions simultaneously."

---

## Files to read first

### Taxonomy definitions (what you're classifying into)

| File | What it tells you |
|------|-------------------|
| `TAXONOMY - D1 - support types (Support Behavior Code (SSBC)).csv` | D1 types with subcategories, definitions, and examples |
| `TAXONOMY - D2 - Roles.csv` | D2 roles with descriptions, literature sources, and identification markers |
| `phase_3_human_coding/Codebook_v0.1.md` | Full coding manual — decision trees, boundary conditions, confusable-pair rules |
| `Care_Role_Literature_Map.md` | Literature grounding for each role |

### Data (what you're training on)

| File | What it contains |
|------|-----------------|
| `phase_5_computational_operationalization/ESConv.json` | Raw ESConv dataset — 1,300 conversations, ~18,376 supporter turns. Each turn has D3 `strategy` labels from the original dataset |
| `phase_5_computational_operationalization/esconv_d1_full.json` | All 18,376 supporter turns with heuristic D1 labels + context fields (`prev_seeker`, `emotion_type`, `problem_type`, `content`, `strategy`) |
| `phase_5_computational_operationalization/esconv_sample.json` | 400-turn stratified sample (50 per D3 strategy) |

### Existing classifiers (understand the baseline you're replacing)

| File | What it does |
|------|-------------|
| `phase_5_computational_operationalization/classify_d1_heuristic.py` | Rule-based D1 classifier. Uses keyword patterns + D3 strategy to assign D1. This is the "Annotator 1" baseline. |
| `phase_5_computational_operationalization/classify_d1_llm.py` | LLM-as-judge D1 classifier. Strategy-blind (doesn't see D3 labels). Includes `compute_agreement()` — Cohen's kappa, confusion matrix, per-class F1. **This is what you're replacing with the embedding model.** |
| `phase_5_computational_operationalization/classify_d2_llm.py` | LLM-as-judge D2 classifier. Classifies 5-turn sliding windows into Care Roles. Has a known bug (leaks strategy labels in the prompt). Reference for D2 logic but don't copy the bug. |

### Visualization (for evaluating your output)

| File | What it does |
|------|-------------|
| `phase_5_computational_operationalization/plot_llm_results.py` | Generates bar charts, heatmaps, and heuristic-vs-LLM comparison. Adapt this for embedding results. |

### Paper context

| File | What it tells you |
|------|-------------------|
| `draft_CHI.md` | Lines 5 and 27 define C3. The embedding model needs to validate that D1/D2/D3 are empirically separable dimensions (not redundant). |

---

## Folder structure

```
AROMA/
├── phase_3_human_coding/          # Codebook + annotation protocol
│   ├── Codebook_v0.1.md           # Decision trees for D1 and D2
│   └── D2_Annotation_Protocol.md  # D2 window-based coding rules
│
├── phase_5_computational_operationalization/   # YOUR WORKING DIRECTORY
│   ├── ESConv.json                # Raw data
│   ├── esconv_d1_full.json        # Heuristic D1 labels (training signal)
│   ├── esconv_sample.json         # 400-turn sample
│   ├── classify_d1_heuristic.py   # Baseline heuristic
│   ├── classify_d1_llm.py         # LLM classifier (you're replacing this)
│   ├── classify_d2_llm.py         # D2 LLM classifier (reference only)
│   ├── plot_llm_results.py        # Visualization (adapt for embeddings)
│   ├── TAXONOMY - D1 - *.csv      # D1 definitions
│   ├── TAXONOMY - D2 - *.csv      # D2 definitions
│   └── figures/                   # Output charts
│
├── Care_Role_Literature_Map.md    # Role grounding
└── draft_CHI.md                   # Paper (C3 definition)
```

---

## Steps

### Step 1: Set up environment

```bash
pip install sentence-transformers scikit-learn torch pandas numpy seaborn matplotlib
```

Base model recommendation: `all-MiniLM-L6-v2` (fast, good baseline) or `BAAI/bge-base-en-v1.5` (better quality). Start with MiniLM for iteration speed.

### Step 2: Build the embedding dataset

Load `esconv_d1_full.json`. Each turn has:

```json
{
  "conv_idx": 0,
  "turn_idx": 3,
  "content": "That sounds really hard...",
  "strategy": "Reflection of feelings",   // ← this IS the D3 label
  "prev_seeker": "I lost my job and...",
  "emotion_type": "sadness",
  "problem_type": "job crisis",
  "d1": "Emotional"                        // ← heuristic D1 label
}
```

For the embedding input, concatenate `prev_seeker` + `content` — the model needs conversational context to classify accurately. Format suggestion:

```
[SEEKER] {prev_seeker} [SUPPORTER] {content}
```

Labels you have now:
- **D1**: from the heuristic (noisy — ~75% accurate based on human validation)
- **D3**: from the ESConv dataset (human-annotated, high quality)
- **D2**: does NOT exist yet — see Step 4

### Step 3: Train D1 classifier (single-dimension first)

Start with D1 only to validate the approach before going multi-dimensional.

**Option A — Classification head on frozen embeddings:**
1. Encode all 18,376 turns with the sentence transformer
2. Train a simple classifier (logistic regression or small MLP) on the embeddings → D1 labels
3. Use stratified 80/20 split. Report accuracy, macro-F1, per-class F1
4. Compare with heuristic baseline and (if available) LLM-as-judge results

**Option B — Fine-tune the sentence transformer:**
1. Use `SetFitModel` from `setfit` library (few-shot fine-tuning, works well with small labeled sets)
2. Fine-tune on the 400-turn sample (`esconv_sample.json`) where labels are more curated
3. Evaluate on full corpus

Option A is faster to iterate. Option B will likely perform better but needs more compute.

**Known issue:** The heuristic D1 labels are noisy training signal. The heuristic over-classifies Emotional (~73.5%) and under-classifies Appraisal, Network, and Esteem. If you train directly on these labels, the model will inherit that bias. Mitigation options:
- Use the LLM-classified labels (`esconv_d1_llm_classified.json`) as a second signal and train on turns where heuristic and LLM agree
- Wait for the human gold set (~200 turns, Phase 3) and use that as validation/test split

### Step 4: Generate D2 labels

D2 (Care Role) operates at the **sequence level** — a 3-5 turn sliding window, not a single turn. This is the hardest dimension.

**How to get D2 labels:**
1. Read `phase_3_human_coding/D2_Annotation_Protocol.md` for the window-based coding rules
2. Read `classify_d2_llm.py` for the existing LLM approach (but fix the strategy-leak bug on line 61 — remove `strategy={turn['strategy']}` from the prompt)
3. Build sliding windows: for each supporter turn, grab the preceding 2-4 turns as context
4. Run LLM classification on the 400-turn sample to generate D2 labels
5. Or: wait for Phase 3 human coding (Codebook_v0.1.md) to produce human-annotated D2 labels

For the embedding model, the input for D2 should be the **full window** (not just the supporter turn):
```
[TURN1] seeker: ... [TURN2] supporter: ... [TURN3] seeker: ... [TURN4] supporter: ... [TURN5] seeker: ...
```

### Step 5: Multi-dimensional model

Once you have labels for all 3 dimensions, train a **multi-task** model:

```
Input: [SEEKER] ... [SUPPORTER] ...
  → Head 1: D1 (6-class)
  → Head 2: D2 (6-class)
  → Head 3: D3 (8-class)
```

Architecture:
1. Shared sentence transformer encoder
2. Three independent classification heads (linear layers)
3. Combined loss = L_d1 + L_d2 + L_d3 (optionally weighted)

**Why multi-task matters for the paper:** If the shared encoder performs well on all 3 dimensions simultaneously, it demonstrates that D1/D2/D3 capture genuinely distinct information — validating AROMA's claim that these dimensions are independent. If performance drops compared to single-task models, that suggests redundancy (which would be a problem for the taxonomy). This is the core empirical claim of C3.

### Step 6: Evaluation and output

Produce these artifacts:

1. **Per-dimension metrics**: accuracy, macro-F1, per-class precision/recall/F1
2. **Confusion matrices**: one per dimension (reuse format from `compute_agreement()` in `classify_d1_llm.py`)
3. **D1×D3 heatmap**: from embedding predictions (compare with heuristic heatmap using `plot_llm_results.py`)
4. **D1×D2 heatmap**: new — shows which support types co-occur with which care roles
5. **Embedding space visualization**: t-SNE or UMAP of the turn embeddings, colored by D1/D2/D3. If clusters separate cleanly by dimension, that's strong evidence for AROMA's independence claim.
6. **Comparison table**: heuristic vs. LLM vs. embedding accuracy on the same test set

Save classified output as `esconv_embedding_classified.json` with format:
```json
{
  "conv_idx": 0,
  "turn_idx": 3,
  "content": "...",
  "strategy": "Reflection of feelings",
  "prev_seeker": "...",
  "d1_heuristic": "Emotional",
  "d1_embedding": "Emotional",
  "d2_embedding": "Listener",
  "d3": "Reflection of feelings"
}
```

---

## Priority order

1. D1 classifier on frozen embeddings (Step 3A) — fastest path to a working baseline
2. D1×D3 heatmap from embeddings — immediate visual comparison with heuristic
3. D2 label generation (Step 4) — needed before multi-task
4. Multi-task model (Step 5) — the actual C3 contribution
5. UMAP visualization — the "pretty figure" for the paper

---

## Watch out for

- **Class imbalance**: Emotional is ~73% of turns. Use stratified splits and report macro-F1 (not accuracy alone). Consider oversampling minority classes (Appraisal, Tangible, Network) during training.
- **D2 sparsity**: ESConv is peer support, not clinical. Navigator, Advisor, and Companion will be rare or absent. The paper acknowledges this — don't force roles that aren't there.
- **Noisy D1 labels**: The heuristic labels are the training signal but they're imperfect (~75% accurate). Where possible, use agreement between heuristic + LLM as a quality filter.
- **D3 is already labeled**: Don't re-predict D3 from scratch — the ESConv D3 labels are human-annotated. The D3 head validates that the embedding space captures strategy information, but D3 is not the novel contribution.
- **Sequence length for D2**: Single turns are insufficient for D2 classification. The embedding input for D2 must include the conversational window (3-5 turns). You may need a different encoder strategy for D2 (e.g., mean-pooling multiple turn embeddings vs. encoding the concatenated window).
