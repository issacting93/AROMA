import json
import os
from collections import Counter, defaultdict
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def main():
    print("Generating full corpus visualizations (18,296 turns)...")
    
    # 1. Load data
    with open("ESConv.json") as f:
        raw_data = json.load(f)
    with open("esconv_aroma_full_llm.json") as f:
        full_labels = json.load(f)
        
    print(f"Loaded {len(raw_data)} conversations and {len(full_labels)} turn labels.")

    # 2. Extract and combine
    records = []
    label_ptr = 0
    for conv_idx, conv in enumerate(raw_data):
        for turn_idx, turn in enumerate(conv["dialog"]):
            if turn["speaker"] == "supporter":
                if label_ptr >= len(full_labels): break
                
                labels = full_labels[label_ptr]
                label_ptr += 1
                
                if not labels or not labels.get("d1"):
                    continue
                
                records.append({
                    "d1": labels["d1"].title(),
                    "d2": labels["d2"].title() if labels.get("d2") else "None",
                    "d3": turn.get("annotation", {}).get("strategy", "Others")
                })

    print(f"Combined {len(records)} records.")

    # 3. Figure Setup
    D1_ORDER = ["Emotional", "Informational", "Esteem", "Appraisal", "Network", "Tangible"]
    D2_ORDER = ["Listener", "Reflective Partner", "Coach", "Navigator", "Advisor", "Companion"]
    D3_ORDER = ["Question", "Restatement or Paraphrasing", "Reflection of feelings",
                "Self-disclosure", "Affirmation and Reassurance", "Providing Suggestions",
                "Information", "Others"]

    def plot_heatmap(mat, rows, cols, title, name):
        plt.figure(figsize=(10, 8))
        sns.heatmap(mat, annot=True, fmt=".0f", cmap="Blues", 
                    xticklabels=cols, yticklabels=rows)
        plt.title(f"{title} (N={len(records):,})")
        plt.tight_layout()
        plt.savefig(f"figures/final/full_{name}.png", dpi=300)
        plt.close()
        print(f"  ✓ Saved figures/final/full_{name}.png")

    # 4. Generate Heatmaps
    # D1 x D2
    cooc12 = defaultdict(Counter)
    for r in records: cooc12[r["d1"]][r["d2"]] += 1
    mat12 = np.array([[cooc12[d1][d2] for d2 in D2_ORDER] for d1 in D1_ORDER])
    plot_heatmap(mat12, D1_ORDER, D2_ORDER, "D1 (Support Type) × D2 (Care Role)", "d1_d2_heatmap")

    # D1 x D3
    cooc13 = defaultdict(Counter)
    for r in records: cooc13[r["d1"]][r["d3"]] += 1
    mat13 = np.array([[cooc13[d1][d3] for d3 in D3_ORDER] for d1 in D1_ORDER])
    plot_heatmap(mat13, D1_ORDER, D3_ORDER, "D1 (Support Type) × D3 (Support Strategy)", "d1_d3_heatmap")

    # D2 x D3
    cooc23 = defaultdict(Counter)
    for r in records: cooc23[r["d2"]][r["d3"]] += 1
    mat23 = np.array([[cooc23[d2][d3] for d3 in D3_ORDER] for d2 in D2_ORDER])
    plot_heatmap(mat23, D2_ORDER, D3_ORDER, "D2 (Care Role) × D3 (Support Strategy)", "d2_d3_heatmap")

    print("\nSUCCESS: All full-corpus heatmaps generated.")

if __name__ == "__main__":
    main()
