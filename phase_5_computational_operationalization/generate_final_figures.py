"""
AROMA Final Figure Generator
=============================
Generates all submission-ready figures with a unified visual style.
Outputs PNG to figures/final/.

Usage:
    python generate_final_figures.py
"""
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import json
import pickle
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
from matplotlib.colors import LinearSegmentedColormap
from collections import Counter, defaultdict
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.metrics import classification_report, confusion_matrix, f1_score
from sklearn.model_selection import train_test_split

# ── Paths ────────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(BASE, "figures", "final")
os.makedirs(OUT, exist_ok=True)

# ── Unified Style ────────────────────────────────────────────────────────────
plt.rcParams.update({
    "font.family":       "sans-serif",
    "font.sans-serif":   ["Helvetica Neue", "Helvetica", "Arial", "DejaVu Sans"],
    "font.size":         10,
    "axes.titlesize":    13,
    "axes.titleweight":  "bold",
    "axes.labelsize":    11,
    "xtick.labelsize":   9,
    "ytick.labelsize":   9,
    "legend.fontsize":   9,
    "figure.facecolor":  "white",
    "axes.facecolor":    "white",
    "axes.edgecolor":    "#CCCCCC",
    "axes.grid":         False,
    "savefig.dpi":       300,
    "savefig.bbox":      "tight",
    "savefig.pad_inches": 0.15,
})

# Canonical orderings
D1_ORDER = ["Emotional", "Informational", "Esteem", "Appraisal", "Network", "Tangible"]
D2_ORDER = ["Listener", "Reflective Partner", "Coach", "Advisor", "Companion", "Navigator"]
D3_ORDER = ["Question", "Restatement or Paraphrasing", "Reflection of Feelings",
            "Self-disclosure", "Affirmation and Reassurance", "Providing Suggestions",
            "Information", "Others"]

# Palette — six harmonious colours for D1, D2, D3
PAL_D1 = {"Emotional": "#E8646A", "Informational": "#4C9BD6", "Esteem": "#9B72CF",
           "Appraisal": "#6BBF6B", "Network": "#E8A044", "Tangible": "#50BFC9"}
PAL_D2 = {"Listener": "#E8646A", "Reflective Partner": "#9B72CF", "Coach": "#50BFC9",
           "Advisor": "#4C9BD6", "Companion": "#E8A044", "Navigator": "#D66BA0"}
PAL_D3 = {"Question": "#4C9BD6", "Restatement or Paraphrasing": "#50BFC9",
           "Reflection of Feelings": "#9B72CF", "Self-disclosure": "#E8646A",
           "Affirmation and Reassurance": "#6BBF6B", "Providing Suggestions": "#E8A044",
           "Information": "#D66BA0", "Others": "#888888"}

# Heatmap colormaps
CMAP_HEAT = LinearSegmentedColormap.from_list("aroma_blue",
    ["#FFFFFF", "#D6E8F7", "#7BBBE5", "#3388C0", "#0D5A94"])
CMAP_HEAT_ALT = LinearSegmentedColormap.from_list("aroma_teal",
    ["#FFFFFF", "#D4F0E7", "#7BD4B8", "#33A882", "#0D7A56"])

# ── Helpers ──────────────────────────────────────────────────────────────────

def savefig(name):
    path = os.path.join(OUT, f"{name}.png")
    plt.savefig(path)
    plt.close()
    print(f"  ✓ {name}.png")

def bar_chart(data, labels, colors, xlabel, ylabel, title, fname, orientation="h",
              show_values=True, figsize=(9, 5)):
    fig, ax = plt.subplots(figsize=figsize)
    bars_colors = [colors.get(l, "#888888") for l in labels]
    if orientation == "h":
        bars = ax.barh(range(len(labels)), data, color=bars_colors, edgecolor="white", linewidth=0.5)
        ax.set_yticks(range(len(labels)))
        ax.set_yticklabels(labels)
        ax.invert_yaxis()
        ax.set_xlabel(xlabel)
        if show_values:
            for bar, val in zip(bars, data):
                ax.text(bar.get_width() + max(data)*0.01, bar.get_y() + bar.get_height()/2,
                        f"{val:,}", va="center", fontsize=9, color="#444444")
    else:
        bars = ax.bar(range(len(labels)), data, color=bars_colors, edgecolor="white", linewidth=0.5)
        ax.set_xticks(range(len(labels)))
        ax.set_xticklabels(labels, rotation=30, ha="right")
        ax.set_ylabel(ylabel)
        if show_values:
            for bar, val in zip(bars, data):
                ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(data)*0.01,
                        f"{val:,}", ha="center", fontsize=9, color="#444444")

    ax.set_title(title, pad=12)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    savefig(fname)

def heatmap(matrix, row_labels, col_labels, title, fname, cmap=None, figsize=(11, 8)):
    if cmap is None:
        cmap = CMAP_HEAT
    fig, ax = plt.subplots(figsize=figsize)
    im = ax.imshow(matrix, cmap=cmap, aspect="auto")

    ax.set_xticks(range(len(col_labels)))
    ax.set_yticks(range(len(row_labels)))
    ax.set_xticklabels(col_labels, rotation=40, ha="right")
    ax.set_yticklabels(row_labels)

    thresh = matrix.max() / 2
    for i in range(len(row_labels)):
        for j in range(len(col_labels)):
            val = int(matrix[i, j])
            ax.text(j, i, f"{val:,}", ha="center", va="center", fontsize=9,
                    color="white" if matrix[i, j] > thresh else "#333333")

    ax.set_title(title, pad=14)
    fig.colorbar(im, ax=ax, fraction=0.035, pad=0.04)
    savefig(fname)

# ── Model class (must match train_multitask_model.py) ────────────────────────
class MultiTaskAROMAModel(nn.Module):
    def __init__(self, input_dim, d1_classes, d2_classes, d3_classes):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.2),
        )
        self.head_d1 = nn.Linear(128, d1_classes)
        self.head_d2 = nn.Linear(128, d2_classes)
        self.head_d3 = nn.Linear(128, d3_classes)

    def forward(self, x):
        h = self.shared(x)
        return self.head_d1(h), self.head_d2(h), self.head_d3(h)

    def shared_repr(self, x):
        """Return the 128-dim shared representation (for embedding plots)."""
        return self.shared(x)

# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    # ── Load data ────────────────────────────────────────────────────────────
    print("Loading data...")
    with open(os.path.join(BASE, "esconv_aroma_full_llm.json")) as f:
        full_data = json.load(f)
    with open(os.path.join(BASE, "ESConv.json")) as f:
        raw_corpus = json.load(f)
    with open(os.path.join(BASE, "esconv_gold_400.json")) as f:
        gold = json.load(f)

    X_embed = np.load(os.path.join(BASE, "embeddings_384.npy"))

    with open(os.path.join(BASE, "label_encoders.pkl"), "rb") as f:
        encoders = pickle.load(f)
    le_d1, le_d2, le_d3 = encoders["le_d1"], encoders["le_d2"], encoders["le_d3"]

    # Build supporter turns list (aligned with full_data indices)
    supporter_turns = []
    for conv in raw_corpus:
        for turn in conv["dialog"]:
            if turn["speaker"] == "supporter":
                supporter_turns.append(turn)

    # Normalize D1 label casing: full_data uses UPPER, we use Title
    d1_upper_to_title = {d.upper(): d for d in D1_ORDER}
    d2_upper_to_title = {d.upper(): d for d in D2_ORDER}

    # Build unified records
    records = []
    for i, res in enumerate(full_data):
        if not res or i >= len(supporter_turns):
            continue
        d1_raw = res.get("d1")
        d2_raw = res.get("d2")
        if isinstance(d1_raw, list):
            d1_raw = d1_raw[0] if d1_raw else None
        if isinstance(d2_raw, list):
            d2_raw = d2_raw[0] if d2_raw else None
        d1 = d1_upper_to_title.get(str(d1_raw).upper()) if d1_raw else None
        d2 = d2_upper_to_title.get(str(d2_raw).upper()) if d2_raw else None
        d3 = supporter_turns[i].get("annotation", {}).get("strategy", None)
        # Normalize D3 casing to match D3_ORDER
        if d3:
            d3_lower_map = {s.lower(): s for s in D3_ORDER}
            d3 = d3_lower_map.get(d3.lower(), d3)
        records.append({"d1": d1, "d2": d2, "d3": d3})

    n_total = len([r for r in records if r["d1"]])
    print(f"  {len(records)} records loaded ({n_total} with valid D1)")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 1: D1 Distribution
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[1/10] D1 Support Type Distribution")
    d1_counts = Counter(r["d1"] for r in records if r["d1"])
    vals = [d1_counts.get(d, 0) for d in D1_ORDER]
    bar_chart(vals, D1_ORDER, PAL_D1, "Number of Turns", "",
              f"D1: Support Type Distribution (N={sum(vals):,})", "d1_distribution")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 2: D2 Distribution
    # ─────────────────────────────────────────────────────────────────────────
    print("[2/10] D2 Care Role Distribution")
    d2_counts = Counter(r["d2"] for r in records if r["d2"])
    vals = [d2_counts.get(d, 0) for d in D2_ORDER]
    bar_chart(vals, D2_ORDER, PAL_D2, "Number of Turns", "",
              f"D2: Care Role Distribution (N={sum(vals):,})", "d2_distribution")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 3: D1 × D2 Heatmap
    # ─────────────────────────────────────────────────────────────────────────
    print("[3/10] D1 × D2 Heatmap")
    cooc = defaultdict(Counter)
    for r in records:
        if r["d1"] and r["d2"]:
            cooc[r["d1"]][r["d2"]] += 1
    mat = np.array([[cooc[d1][d2] for d2 in D2_ORDER] for d1 in D1_ORDER], dtype=float)
    heatmap(mat, D1_ORDER, D2_ORDER,
            "D1 (Support Type) × D2 (Care Role)", "d1_d2_heatmap")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 4: D2 × D3 Heatmap
    # ─────────────────────────────────────────────────────────────────────────
    print("[4/10] D2 × D3 Heatmap")
    cooc23 = defaultdict(Counter)
    for r in records:
        if r["d2"] and r["d3"]:
            cooc23[r["d2"]][r["d3"]] += 1
    mat23 = np.array([[cooc23[d2][d3] for d3 in D3_ORDER] for d2 in D2_ORDER], dtype=float)
    heatmap(mat23, D2_ORDER, D3_ORDER,
            "D2 (Care Role) × D3 (Support Strategy)", "d2_d3_heatmap",
            cmap=CMAP_HEAT_ALT, figsize=(13, 8))

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 4.5: D3 Distribution (Support Strategy)
    # ─────────────────────────────────────────────────────────────────────────
    print("[4.5/10] D3 Support Strategy Distribution")
    d3_counts = Counter(r["d3"] for r in records if r["d3"])
    vals3 = [d3_counts.get(d, 0) for d in D3_ORDER]
    bar_chart(vals3, D3_ORDER, PAL_D3, "Number of Turns", "",
              f"D3: Support Strategy Distribution (N={sum(vals3):,})", "d3_distribution")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 5: D1 × D3 Heatmap (NEW — completes the triangle)
    # ─────────────────────────────────────────────────────────────────────────
    print("[5/10] D1 × D3 Heatmap")
    cooc13 = defaultdict(Counter)
    for r in records:
        if r["d1"] and r["d3"]:
            cooc13[r["d1"]][r["d3"]] += 1
    mat13 = np.array([[cooc13[d1][d3] for d3 in D3_ORDER] for d1 in D1_ORDER], dtype=float)
    # Use a warm palette for the third heatmap to distinguish from the other two
    cmap_warm = LinearSegmentedColormap.from_list("aroma_warm",
        ["#FFFFFF", "#FDEBD0", "#F5B041", "#D68910", "#7E5109"])
    heatmap(mat13, D1_ORDER, D3_ORDER,
            "D1 (Support Type) × D3 (Support Strategy)", "d1_d3_heatmap",
            cmap=cmap_warm, figsize=(13, 8))

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 6-7: Pre-training Embedding Plots (PCA + t-SNE)
    # ─────────────────────────────────────────────────────────────────────────
    print("[6/10] Pre-training Embeddings (MiniLM) — PCA")
    gold_d1 = [g["d1"] for g in gold]
    gold_d2 = [g["d2"] for g in gold]

    pca = PCA(n_components=2, random_state=42)
    X_pca = pca.fit_transform(X_embed)

    def scatter_plot(X2d, labels, palette, order, title, fname, method_label=""):
        fig, ax = plt.subplots(figsize=(8, 6))
        for cat in order:
            mask = [l == cat for l in labels]
            if not any(mask):
                continue
            pts = X2d[mask]
            ax.scatter(pts[:, 0], pts[:, 1], c=palette[cat], label=cat,
                       s=30, alpha=0.7, edgecolors="white", linewidth=0.3)
        ax.legend(loc="best", framealpha=0.9, edgecolor="#CCCCCC")
        ax.set_xlabel(f"{method_label} 1" if method_label else "Component 1")
        ax.set_ylabel(f"{method_label} 2" if method_label else "Component 2")
        ax.set_title(title, pad=12)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        savefig(fname)

    scatter_plot(X_pca, gold_d1, PAL_D1, D1_ORDER,
                 "Pre-training Embeddings by Support Type (PCA)",
                 "embedding_pretrain_d1_pca", "PCA")

    print("[7/10] Pre-training Embeddings (MiniLM) — t-SNE")
    tsne = TSNE(n_components=2, random_state=42, perplexity=30)
    X_tsne = tsne.fit_transform(X_embed)
    scatter_plot(X_tsne, gold_d1, PAL_D1, D1_ORDER,
                 "Pre-training Embeddings by Support Type (t-SNE)",
                 "embedding_pretrain_d1_tsne", "t-SNE")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 8-9: Post-training Embedding Plots (PCA + t-SNE)
    # ─────────────────────────────────────────────────────────────────────────
    print("[8/10] Post-training Embeddings — PCA")
    model = MultiTaskAROMAModel(384, len(le_d1.classes_), len(le_d2.classes_), len(le_d3.classes_))
    model.load_state_dict(torch.load(os.path.join(BASE, "aroma_model.pth"),
                                     map_location="cpu", weights_only=True))
    model.eval()

    with torch.no_grad():
        X_shared = model.shared_repr(torch.FloatTensor(X_embed)).numpy()

    pca_post = PCA(n_components=2, random_state=42)
    X_pca_post = pca_post.fit_transform(X_shared)
    scatter_plot(X_pca_post, gold_d1, PAL_D1, D1_ORDER,
                 "Post-training Embeddings by Support Type (PCA)",
                 "embedding_posttrain_d1_pca", "PCA")

    print("[9/10] Post-training Embeddings — t-SNE")
    tsne_post = TSNE(n_components=2, random_state=42, perplexity=30)
    X_tsne_post = tsne_post.fit_transform(X_shared)
    scatter_plot(X_tsne_post, gold_d1, PAL_D1, D1_ORDER,
                 "Post-training Embeddings by Support Type (t-SNE)",
                 "embedding_posttrain_d1_tsne", "t-SNE")

    # Also generate D2 versions of post-training
    scatter_plot(X_pca_post, gold_d2, PAL_D2, D2_ORDER,
                 "Post-training Embeddings by Care Role (PCA)",
                 "embedding_posttrain_d2_pca", "PCA")
    scatter_plot(X_tsne_post, gold_d2, PAL_D2, D2_ORDER,
                 "Post-training Embeddings by Care Role (t-SNE)",
                 "embedding_posttrain_d2_tsne", "t-SNE")

    # ─────────────────────────────────────────────────────────────────────────
    #  FIGURE 10: Per-class F1 Bar Charts (replaces confusion matrices)
    # ─────────────────────────────────────────────────────────────────────────
    print("[10/10] Per-class F1 Scores")
    y_d1_raw = [g["d1"] for g in gold]
    y_d2_raw = [g["d2"] for g in gold]
    y_d3_raw = [g["d3"] for g in gold]

    y_d1 = le_d1.transform(y_d1_raw)
    y_d2 = le_d2.transform(y_d2_raw)
    y_d3 = le_d3.transform(y_d3_raw)

    X_tr, X_te, d1_tr, d1_te, d2_tr, d2_te, d3_tr, d3_te = train_test_split(
        X_embed, y_d1, y_d2, y_d3, test_size=0.2, random_state=42)

    with torch.no_grad():
        o1, o2, o3 = model(torch.FloatTensor(X_te))
        p_d1 = torch.argmax(o1, dim=1).numpy()
        p_d2 = torch.argmax(o2, dim=1).numpy()
        p_d3 = torch.argmax(o3, dim=1).numpy()

    def f1_bar(y_true, y_pred, le, dim_palette, dim_order, dim_name, fname):
        report = classification_report(y_true, y_pred, target_names=le.classes_,
                                       output_dict=True, zero_division=0,
                                       labels=range(len(le.classes_)))
        # Map encoder class names to canonical order
        le_to_canonical = {}
        for c in le.classes_:
            for d in dim_order:
                if c.lower() == d.lower():
                    le_to_canonical[c] = d
                    break
            else:
                le_to_canonical[c] = c

        # Collect F1 scores in canonical order
        classes_ordered = []
        f1_vals = []
        prec_vals = []
        rec_vals = []
        support_vals = []
        for d in dim_order:
            # Find matching encoder class
            enc_name = None
            for c in le.classes_:
                if le_to_canonical.get(c, "").lower() == d.lower():
                    enc_name = c
                    break
            if enc_name and enc_name in report:
                classes_ordered.append(d)
                f1_vals.append(report[enc_name]["f1-score"])
                prec_vals.append(report[enc_name]["precision"])
                rec_vals.append(report[enc_name]["recall"])
                support_vals.append(int(report[enc_name]["support"]))

        macro_f1 = report.get("macro avg", {}).get("f1-score", 0)
        weighted_f1 = report.get("weighted avg", {}).get("f1-score", 0)

        fig, ax = plt.subplots(figsize=(9, 5))
        x = range(len(classes_ordered))
        colors = [dim_palette.get(c, "#888888") for c in classes_ordered]
        bars = ax.bar(x, f1_vals, color=colors, edgecolor="white", linewidth=0.5, width=0.7)

        # Add value + support labels
        for bar, f1, sup in zip(bars, f1_vals, support_vals):
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.02,
                    f".{int(f1*100):02d}", ha="center", fontsize=9, fontweight="bold", color="#333333")
            ax.text(bar.get_x() + bar.get_width()/2, -0.06,
                    f"n={sup}", ha="center", fontsize=8, color="#888888")

        # Reference lines
        ax.axhline(macro_f1, ls="--", color="#999999", lw=0.8, label=f"Macro F1 = {macro_f1:.2f}")
        ax.axhline(weighted_f1, ls=":", color="#666666", lw=0.8, label=f"Weighted F1 = {weighted_f1:.2f}")

        ax.set_xticks(x)
        ax.set_xticklabels(classes_ordered, rotation=30, ha="right")
        ax.set_ylabel("F1 Score")
        ax.set_ylim(-0.1, 1.1)
        ax.set_title(f"{dim_name}: Per-class F1 (Multitask Model)", pad=12)
        ax.legend(loc="upper right", framealpha=0.9, edgecolor="#CCCCCC")
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        savefig(fname)

    f1_bar(d1_te, p_d1, le_d1, PAL_D1, D1_ORDER, "D1 Support Type", "f1_d1")
    f1_bar(d2_te, p_d2, le_d2, PAL_D2, D2_ORDER, "D2 Care Role", "f1_d2")
    f1_bar(d3_te, p_d3, le_d3, PAL_D3, D3_ORDER, "D3 Support Strategy", "f1_d3")

    # ─────────────────────────────────────────────────────────────────────────
    #  BONUS: Static Sankey export (PNG via kaleido/plotly)
    # ─────────────────────────────────────────────────────────────────────────
    print("\n[Bonus] Static Sankey Diagram")
    try:
        import plotly.graph_objects as go

        all_nodes = D1_ORDER + D2_ORDER + [
            "Question", "Restating", "Reflecting", "Self-disclosure",
            "Affirming", "Suggesting", "Informing", "Other"
        ]
        d3_short = {
            "Question": "Question", "Restatement or Paraphrasing": "Restating",
            "Reflection of Feelings": "Reflecting", "Self-disclosure": "Self-disclosure",
            "Affirmation and Reassurance": "Affirming", "Providing Suggestions": "Suggesting",
            "Information": "Informing", "Others": "Other"
        }
        node_map = {n: i for i, n in enumerate(all_nodes)}
        node_colors = (
            [PAL_D1[d] for d in D1_ORDER] +
            [PAL_D2[d] for d in D2_ORDER] +
            ["#4C9BD6", "#50BFC9", "#9B72CF", "#E8646A", "#6BBF6B", "#E8A044", "#D66BA0", "#888888"]
        )

        links_s, links_t, links_v, links_c = [], [], [], []

        # D1 → D2
        d1d2_links = defaultdict(int)
        for r in records:
            if r["d1"] and r["d2"]:
                d1d2_links[(r["d1"], r["d2"])] += 1
        for (s, t), v in d1d2_links.items():
            links_s.append(node_map[s])
            links_t.append(node_map[t])
            links_v.append(v)
            c = PAL_D1[s]
            # Make semi-transparent
            r_, g_, b_ = int(c[1:3],16), int(c[3:5],16), int(c[5:7],16)
            links_c.append(f"rgba({r_},{g_},{b_},0.3)")

        # D2 → D3
        d2d3_links = defaultdict(int)
        for r in records:
            if r["d2"] and r["d3"]:
                d2d3_links[(r["d2"], d3_short.get(r["d3"], "Other"))] += 1
        for (s, t), v in d2d3_links.items():
            if t not in node_map:
                continue
            links_s.append(node_map[s])
            links_t.append(node_map[t])
            links_v.append(v)
            c = PAL_D2[s]
            r_, g_, b_ = int(c[1:3],16), int(c[3:5],16), int(c[5:7],16)
            links_c.append(f"rgba({r_},{g_},{b_},0.3)")

        fig_sankey = go.Figure(go.Sankey(
            orientation="h",
            node=dict(
                pad=22, thickness=18,
                line=dict(color="rgba(0,0,0,0)", width=0),
                label=all_nodes,
                color=node_colors,
            ),
            link=dict(
                source=links_s, target=links_t, value=links_v, color=links_c,
            ),
        ))
        fig_sankey.update_layout(
            title_text="AROMA Flow: D1 → D2 → D3",
            font=dict(family="Helvetica Neue, Arial", size=11, color="#333333"),
            paper_bgcolor="white", plot_bgcolor="white",
            width=1200, height=700,
            margin=dict(t=50, b=30, l=20, r=20),
        )
        sankey_path = os.path.join(OUT, "sankey.png")
        fig_sankey.write_image(sankey_path, scale=2)
        print(f"  ✓ sankey.png")
    except Exception as e:
        print(f"  ⚠ Sankey export failed ({e}) — install kaleido: pip install kaleido")

    # ─────────────────────────────────────────────────────────────────────────
    print(f"\nDone. All figures saved to {OUT}/")

if __name__ == "__main__":
    main()
