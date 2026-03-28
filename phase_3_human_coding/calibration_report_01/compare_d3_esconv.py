#!/usr/bin/env python3
"""Compare original ESConv D3 strategy labels with human coder labels.

Full Phase 1 dataset: 50 double-coded sequences across ESConv_0–24.

ESConv labels are turn-level (one strategy per supporter turn).
Human labels are sequence-level (multi-label per 5-turn window).

For comparison we:
1. Aggregate ESConv turn-level labels into a set per sequence
2. Compare against each human coder's D3 set for that sequence
3. Compute per-strategy Cohen's kappa and overall metrics
"""

import csv
import json
import os
from collections import Counter, defaultdict

import matplotlib
import matplotlib.pyplot as plt
import numpy as np

matplotlib.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "axes.titlesize": 13,
    "axes.labelsize": 11,
    "figure.dpi": 200,
})

OUT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(OUT, "..", "..", "aroma_annotations_2026-03-28.csv")
ESCONV_PATH = os.path.join(OUT, "..", "..",
    "phase_5_computational_operationalization", "data", "ESConv.json")

# Strategy name normalization (ESConv -> AROMA canonical)
STRATEGY_MAP = {
    "Question": "Question",
    "Providing Suggestions": "Providing Suggestions",
    "Affirmation and Reassurance": "Affirmation and Reassurance",
    "Others": "Others",
    "Reflection of feelings": "Reflection of Feelings",
    "Reflection of Feelings": "Reflection of Feelings",
    "Self-disclosure": "Self-disclosure",
    "Restatement or Paraphrasing": "Restatement/Paraphrasing",
    "Restatement/Paraphrasing": "Restatement/Paraphrasing",
    "Information": "Information",
}

ALL_STRATEGIES = [
    "Question", "Affirmation and Reassurance", "Providing Suggestions",
    "Reflection of Feelings", "Self-disclosure", "Information",
    "Restatement/Paraphrasing", "Others",
]

# ---------- Load ESConv ----------
with open(ESCONV_PATH) as f:
    esconv = json.load(f)

# ---------- Load human annotations ----------
annotations = []
with open(CSV_PATH) as f:
    for r in csv.DictReader(f):
        annotations.append(r)

CODER_A = "bf32f904-50b3-4abb-9e0a-11aa1e2fb942"
CODER_B = "41f829d6-9b5c-4fac-bfae-340a90fd8b25"

# ---------- Build ESConv sequence-level labels ----------
def get_esconv_strategies(conv_idx, turn_start, turn_end):
    """Get set of ESConv strategies for supporter turns in [start, end)."""
    conv = esconv[conv_idx]
    strategies = set()
    for i, turn in enumerate(conv["dialog"]):
        if turn_start <= i < turn_end and turn["speaker"] == "supporter":
            raw = turn.get("annotation", {}).get("strategy", "")
            if raw:
                normed = STRATEGY_MAP.get(raw, raw)
                strategies.add(normed)
    return strategies


def parse_turn_range(tr):
    """Parse '[2,7)' -> (2, 7)"""
    tr = tr.strip().strip("[)")
    parts = tr.split(",")
    return int(parts[0]), int(parts[1])


# ---------- Build comparison pairs ----------
# For each double-coded sequence, we have: ESConv labels, Coder A labels, Coder B labels
paired = {}
for r in annotations:
    key = (r["external_id"].strip(), r["sequence_id"].strip())
    paired.setdefault(key, {})[r["coder_id"].strip()] = r
both = {k: v for k, v in paired.items() if len(v) == 2}

comparisons = []
for key, coders in both.items():
    ext_id = coders[CODER_A]["external_id"].strip()
    conv_idx = int(ext_id.split("_")[1])
    turn_range = coders[CODER_A]["turn_range"].strip()
    t_start, t_end = parse_turn_range(turn_range)

    esconv_strats = get_esconv_strategies(conv_idx, t_start, t_end)

    def parse_human(r):
        return set(s.strip() for s in r["d3_strategies"].split(";") if s.strip())

    human_a = parse_human(coders[CODER_A])
    human_b = parse_human(coders[CODER_B])

    comparisons.append({
        "ext_id": ext_id,
        "turn_range": turn_range,
        "esconv": esconv_strats,
        "coder_a": human_a,
        "coder_b": human_b,
    })

print(f"Sequences compared: {len(comparisons)}")


# ---------- Cohen's Kappa (per strategy, binary) ----------
def cohens_kappa(y1, y2):
    """Cohen's kappa for two binary lists."""
    assert len(y1) == len(y2)
    n = len(y1)
    if n == 0:
        return float("nan")
    # Confusion matrix
    a = sum(1 for i in range(n) if y1[i] == 1 and y2[i] == 1)
    b = sum(1 for i in range(n) if y1[i] == 1 and y2[i] == 0)
    c = sum(1 for i in range(n) if y1[i] == 0 and y2[i] == 1)
    d = sum(1 for i in range(n) if y1[i] == 0 and y2[i] == 0)
    po = (a + d) / n
    pe = ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n)
    if pe == 1.0:
        return 1.0 if po == 1.0 else 0.0
    return (po - pe) / (1 - pe)


def compute_kappas(human_key):
    """Compute per-strategy kappa between ESConv and a human coder."""
    results = {}
    for strat in ALL_STRATEGIES:
        esconv_binary = [1 if strat in c["esconv"] else 0 for c in comparisons]
        human_binary = [1 if strat in c[human_key] else 0 for c in comparisons]
        k = cohens_kappa(esconv_binary, human_binary)
        # Also compute raw counts
        esconv_count = sum(esconv_binary)
        human_count = sum(human_binary)
        agree = sum(1 for e, h in zip(esconv_binary, human_binary) if e == h)
        results[strat] = {
            "kappa": k,
            "esconv_count": esconv_count,
            "human_count": human_count,
            "agree": agree,
            "pct_agree": agree / len(comparisons) * 100,
        }
    return results


kappa_a = compute_kappas("coder_a")
kappa_b = compute_kappas("coder_b")

# Also compute overall set-level metrics
def set_metrics(human_key):
    jaccard_scores = []
    exact_matches = 0
    for c in comparisons:
        e = c["esconv"]
        h = c[human_key]
        if len(e) == 0 and len(h) == 0:
            jaccard_scores.append(1.0)
            exact_matches += 1
        elif len(e) == 0 or len(h) == 0:
            jaccard_scores.append(0.0)
        else:
            inter = len(e & h)
            union = len(e | h)
            jaccard_scores.append(inter / union)
            if e == h:
                exact_matches += 1
    return {
        "mean_jaccard": np.mean(jaccard_scores),
        "median_jaccard": np.median(jaccard_scores),
        "exact_match": exact_matches / len(comparisons) * 100,
    }


metrics_a = set_metrics("coder_a")
metrics_b = set_metrics("coder_b")

# Also inter-coder for reference
def inter_coder_metrics():
    jaccard_scores = []
    exact_matches = 0
    for c in comparisons:
        a = c["coder_a"]
        b = c["coder_b"]
        if len(a) == 0 and len(b) == 0:
            jaccard_scores.append(1.0)
            exact_matches += 1
        elif len(a) == 0 or len(b) == 0:
            jaccard_scores.append(0.0)
        else:
            inter = len(a & b)
            union = len(a | b)
            jaccard_scores.append(inter / union)
            if a == b:
                exact_matches += 1
    return {
        "mean_jaccard": np.mean(jaccard_scores),
        "median_jaccard": np.median(jaccard_scores),
        "exact_match": exact_matches / len(comparisons) * 100,
    }


metrics_inter = inter_coder_metrics()

# ---------- Print results ----------
print("\n" + "=" * 70)
print("PER-STRATEGY COHEN'S KAPPA: ESConv vs Human Coders")
print("=" * 70)
print(f"{'Strategy':<32} {'ESConv':>6} {'Cdr A':>6} {'κ(A)':>7} {'Cdr B':>6} {'κ(B)':>7}")
print("-" * 70)
for s in ALL_STRATEGIES:
    a = kappa_a[s]
    b = kappa_b[s]
    print(f"{s:<32} {a['esconv_count']:>6} {a['human_count']:>6} {a['kappa']:>7.3f} "
          f"{b['human_count']:>6} {b['kappa']:>7.3f}")

print("\n" + "=" * 70)
print("SET-LEVEL METRICS")
print("=" * 70)
print(f"{'Comparison':<30} {'Mean Jaccard':>12} {'Median Jaccard':>14} {'Exact Match':>12}")
print("-" * 70)
print(f"{'ESConv vs Coder A':<30} {metrics_a['mean_jaccard']:>12.3f} "
      f"{metrics_a['median_jaccard']:>14.3f} {metrics_a['exact_match']:>11.1f}%")
print(f"{'ESConv vs Coder B':<30} {metrics_b['mean_jaccard']:>12.3f} "
      f"{metrics_b['median_jaccard']:>14.3f} {metrics_b['exact_match']:>11.1f}%")
print(f"{'Coder A vs Coder B':<30} {metrics_inter['mean_jaccard']:>12.3f} "
      f"{metrics_inter['median_jaccard']:>14.3f} {metrics_inter['exact_match']:>11.1f}%")


# ============================================================
# Fig 9 — Per-strategy kappa heatmap
# ============================================================
fig, ax = plt.subplots(figsize=(9, 5))
kappa_matrix = np.array([[kappa_a[s]["kappa"] for s in ALL_STRATEGIES],
                          [kappa_b[s]["kappa"] for s in ALL_STRATEGIES]])

im = ax.imshow(kappa_matrix, cmap="RdYlGn", vmin=-0.3, vmax=1.0, aspect="auto")
ax.set_xticks(range(len(ALL_STRATEGIES)))
ax.set_xticklabels(ALL_STRATEGIES, rotation=40, ha="right", fontsize=9)
ax.set_yticks([0, 1])
ax.set_yticklabels(["ESConv vs Coder A", "ESConv vs Coder B"])
ax.set_title("D3 Per-Strategy Cohen's κ: ESConv Ground Truth vs Human Coders")
for i in range(2):
    for j in range(len(ALL_STRATEGIES)):
        val = kappa_matrix[i, j]
        color = "white" if abs(val) < 0.2 or val > 0.6 else "black"
        ax.text(j, i, f"{val:.2f}", ha="center", va="center", fontsize=10, color=color)
plt.colorbar(im, ax=ax, shrink=0.6, label="Cohen's κ")
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig9_d3_kappa_heatmap.png"))
plt.close()


# ============================================================
# Fig 10 — Set-level Jaccard similarity distribution
# ============================================================
def get_jaccards(human_key):
    scores = []
    for c in comparisons:
        e = c["esconv"]
        h = c[human_key]
        if len(e) == 0 and len(h) == 0:
            scores.append(1.0)
        elif len(e) == 0 or len(h) == 0:
            scores.append(0.0)
        else:
            scores.append(len(e & h) / len(e | h))
    return scores


jacc_a = get_jaccards("coder_a")
jacc_b = get_jaccards("coder_b")
jacc_inter = []
for c in comparisons:
    a, b = c["coder_a"], c["coder_b"]
    if len(a) == 0 and len(b) == 0:
        jacc_inter.append(1.0)
    elif len(a) == 0 or len(b) == 0:
        jacc_inter.append(0.0)
    else:
        jacc_inter.append(len(a & b) / len(a | b))

fig, ax = plt.subplots(figsize=(7, 4.5))
bins = np.arange(0, 1.15, 0.1)
ax.hist([jacc_a, jacc_b, jacc_inter], bins=bins,
        label=["ESConv vs Coder A", "ESConv vs Coder B", "Coder A vs Coder B"],
        color=["#4C72B0", "#DD8452", "#55A868"], edgecolor="white", alpha=0.8)
ax.set_xlabel("Jaccard Similarity")
ax.set_ylabel("Count")
ax.set_title("D3 Strategy Set Similarity (per sequence)")
ax.legend(fontsize=9)
ax.axvline(x=np.mean(jacc_a), color="#4C72B0", linestyle="--", alpha=0.7)
ax.axvline(x=np.mean(jacc_b), color="#DD8452", linestyle="--", alpha=0.7)
ax.axvline(x=np.mean(jacc_inter), color="#55A868", linestyle="--", alpha=0.7)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig10_d3_jaccard_distribution.png"))
plt.close()


# ============================================================
# Fig 11 — Strategy frequency comparison (ESConv vs coders)
# ============================================================
esconv_counts = Counter()
for c in comparisons:
    for s in c["esconv"]:
        esconv_counts[s] += 1
coder_a_counts = Counter()
for c in comparisons:
    for s in c["coder_a"]:
        coder_a_counts[s] += 1
coder_b_counts = Counter()
for c in comparisons:
    for s in c["coder_b"]:
        coder_b_counts[s] += 1

fig, ax = plt.subplots(figsize=(10, 5))
x = np.arange(len(ALL_STRATEGIES))
w = 0.25
ax.bar(x - w, [esconv_counts[s] for s in ALL_STRATEGIES], w,
       label="ESConv (aggregated)", color="#55A868")
ax.bar(x, [coder_a_counts[s] for s in ALL_STRATEGIES], w,
       label="Coder A", color="#4C72B0")
ax.bar(x + w, [coder_b_counts[s] for s in ALL_STRATEGIES], w,
       label="Coder B", color="#DD8452")
ax.set_xticks(x)
ax.set_xticklabels(ALL_STRATEGIES, rotation=35, ha="right", fontsize=9)
ax.set_ylabel("Sequences containing strategy")
ax.set_title(f"D3 Strategy Frequency: ESConv vs Human Coders (n={len(comparisons)} sequences)")
ax.legend(fontsize=9)
plt.tight_layout()
plt.savefig(os.path.join(OUT, "fig11_d3_frequency_comparison.png"))
plt.close()


print(f"\nFigures 9-11 saved to: {OUT}")
