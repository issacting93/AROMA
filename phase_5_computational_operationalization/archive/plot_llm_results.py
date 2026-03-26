"""
AROMA D1 Classification — Visualization Suite
===============================================
Generates 3 figures from the heuristic and LLM classification outputs:
  1. D1 bar chart (LLM)
  2. D1 × D3 heatmap (LLM)
  3. Heuristic vs LLM comparison (side-by-side bars)

Usage:
  python3 plot_llm_results.py [--llm FILE] [--heuristic FILE] [--outdir DIR]

Defaults:
  --llm        esconv_d1_llm_classified.json
  --heuristic  esconv_d1_full.json
  --outdir     .  (current directory)
"""

import json
import argparse
import os
import sys

try:
    import numpy as np
    import pandas as pd
    import seaborn as sns
    import matplotlib.pyplot as plt
except ImportError:
    print("Installing required packages...")
    os.system("python3 -m pip install pandas matplotlib seaborn numpy --break-system-packages")
    import numpy as np
    import pandas as pd
    import seaborn as sns
    import matplotlib.pyplot as plt

from collections import Counter, defaultdict

D1_TYPES = ["Emotional", "Esteem", "Informational", "Network", "Tangible", "Appraisal"]
STRATEGIES = [
    "Question", "Restatement or Paraphrasing", "Reflection of feelings",
    "Self-disclosure", "Affirmation and Reassurance", "Providing Suggestions",
    "Information", "Others",
]
STRAT_SHORT = ["Question", "Restate.", "Reflect.", "Self-disc.", "Affirm.", "Suggest.", "Info.", "Others"]


def load_and_filter(path):
    """Load classified JSON, drop FAILED turns."""
    with open(path) as f:
        data = json.load(f)
    return [t for t in data if t.get("d1") and t["d1"] != "FAILED"]


def plot_d1_bar(data, outdir, label="LLM"):
    """Bar chart of D1 support type distribution."""
    counts = Counter(t["d1"] for t in data)
    total = sum(counts.values())

    pairs = sorted([(d1, counts.get(d1, 0)) for d1 in D1_TYPES], key=lambda x: x[1])
    labels, values = zip(*pairs)

    fig, ax = plt.subplots(figsize=(10, 6))
    colors = sns.color_palette("viridis", len(labels))
    bars = ax.barh(labels, values, color=colors)

    for bar in bars:
        w = bar.get_width()
        pct = w / total * 100
        ax.text(w + max(values) * 0.01, bar.get_y() + bar.get_height() / 2,
                f"{int(w):,} ({pct:.1f}%)", ha="left", va="center", fontsize=10)

    ax.set_title(f"D1 Support Type Distribution ({label})", fontsize=14, pad=20)
    ax.set_xlabel("Number of Turns", fontsize=12)
    ax.set_ylabel("Support Type", fontsize=12)
    plt.tight_layout()

    path = os.path.join(outdir, f"d1_{label.lower()}_distribution.png")
    plt.savefig(path, dpi=300)
    plt.close()
    print(f"  Saved: {path}")


def plot_d1xd3_heatmap(data, outdir, label="LLM"):
    """Heatmap of D1 × D3 co-occurrence."""
    cooc = defaultdict(Counter)
    for t in data:
        cooc[t["d1"]][t.get("strategy", "Unknown")] += 1

    matrix = np.zeros((len(D1_TYPES), len(STRATEGIES)))
    for i, d1 in enumerate(D1_TYPES):
        for j, s in enumerate(STRATEGIES):
            matrix[i, j] = cooc[d1][s]

    df = pd.DataFrame(matrix, index=D1_TYPES, columns=STRAT_SHORT)

    fig, ax = plt.subplots(figsize=(12, 7))
    sns.heatmap(df, annot=True, fmt="g", cmap="YlGnBu", cbar_kws={"label": "Number of Turns"}, ax=ax)
    ax.set_title(f"D1 Support Type × D3 Strategy ({label})", fontsize=14, pad=20)
    ax.set_xlabel("D3 Support Strategy (ESConv labels)", fontsize=12)
    ax.set_ylabel("D1 Support Type", fontsize=12)
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()

    path = os.path.join(outdir, f"d1_d3_{label.lower()}_heatmap.png")
    plt.savefig(path, dpi=300)
    plt.close()
    print(f"  Saved: {path}")


def plot_comparison(heuristic_data, llm_data, outdir):
    """Side-by-side bar chart comparing heuristic vs LLM D1 distributions."""
    h_counts = Counter(t["d1"] for t in heuristic_data)
    l_counts = Counter(t["d1"] for t in llm_data)

    h_total = sum(h_counts.values())
    l_total = sum(l_counts.values())

    # Normalize to percentages for fair comparison (corpora may differ in size)
    h_pcts = {d1: h_counts.get(d1, 0) / h_total * 100 for d1 in D1_TYPES}
    l_pcts = {d1: l_counts.get(d1, 0) / l_total * 100 for d1 in D1_TYPES}

    x = np.arange(len(D1_TYPES))
    width = 0.35

    fig, ax = plt.subplots(figsize=(12, 6))
    bars_h = ax.bar(x - width / 2, [h_pcts[d] for d in D1_TYPES], width,
                    label=f"Heuristic (n={h_total:,})", color=sns.color_palette("viridis", 2)[0])
    bars_l = ax.bar(x + width / 2, [l_pcts[d] for d in D1_TYPES], width,
                    label=f"LLM (n={l_total:,})", color=sns.color_palette("viridis", 2)[1])

    # Add percentage labels on bars
    for bars in [bars_h, bars_l]:
        for bar in bars:
            h = bar.get_height()
            if h > 1:
                ax.text(bar.get_x() + bar.get_width() / 2, h + 0.5,
                        f"{h:.1f}%", ha="center", va="bottom", fontsize=9)

    ax.set_title("D1 Support Type: Heuristic vs LLM Classification", fontsize=14, pad=20)
    ax.set_ylabel("Percentage of Turns", fontsize=12)
    ax.set_xticks(x)
    ax.set_xticklabels(D1_TYPES, fontsize=11)
    ax.legend(fontsize=11)
    ax.set_ylim(0, max(max(h_pcts.values()), max(l_pcts.values())) * 1.15)
    plt.tight_layout()

    path = os.path.join(outdir, "d1_heuristic_vs_llm.png")
    plt.savefig(path, dpi=300)
    plt.close()
    print(f"  Saved: {path}")


def main():
    parser = argparse.ArgumentParser(description="AROMA D1 Classification Visualizations")
    parser.add_argument("--llm", default="esconv_d1_llm_classified.json",
                        help="Path to LLM-classified JSON")
    parser.add_argument("--heuristic", default="esconv_d1_full.json",
                        help="Path to heuristic-classified JSON")
    parser.add_argument("--outdir", default=".",
                        help="Directory to save figures")
    args = parser.parse_args()

    os.makedirs(args.outdir, exist_ok=True)

    # Always try LLM results
    if os.path.exists(args.llm):
        print(f"Loading LLM results: {args.llm}")
        llm_data = load_and_filter(args.llm)
        print(f"  {len(llm_data)} turns loaded (FAILED excluded)")
        plot_d1_bar(llm_data, args.outdir, label="LLM")
        plot_d1xd3_heatmap(llm_data, args.outdir, label="LLM")
    else:
        llm_data = None
        print(f"LLM file not found: {args.llm} — skipping LLM charts")

    # Heuristic results
    if os.path.exists(args.heuristic):
        print(f"Loading heuristic results: {args.heuristic}")
        h_data = load_and_filter(args.heuristic)
        print(f"  {len(h_data)} turns loaded")
        plot_d1_bar(h_data, args.outdir, label="Heuristic")
        plot_d1xd3_heatmap(h_data, args.outdir, label="Heuristic")
    else:
        h_data = None
        print(f"Heuristic file not found: {args.heuristic} — skipping heuristic charts")

    # Comparison (needs both)
    if llm_data and h_data:
        print("Generating comparison chart...")
        plot_comparison(h_data, llm_data, args.outdir)
    elif not llm_data:
        print("Skipping comparison — run classify_d1_llm.py first to generate LLM results")

    print("Done.")


if __name__ == "__main__":
    main()
