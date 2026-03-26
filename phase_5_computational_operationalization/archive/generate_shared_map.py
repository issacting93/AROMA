"""
Generate the "Shared Map" figure — one embedding space, two labeling systems.
"""
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import json, pickle, numpy as np, torch, torch.nn as nn
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

BASE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(BASE, "figures", "final")

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Helvetica Neue", "Helvetica", "Arial", "DejaVu Sans"],
    "font.size": 10, "axes.titlesize": 12, "axes.titleweight": "bold",
    "axes.labelsize": 10, "figure.facecolor": "white", "axes.facecolor": "white",
    "axes.edgecolor": "#CCCCCC", "axes.grid": False,
    "savefig.dpi": 300, "savefig.bbox": "tight", "savefig.pad_inches": 0.15,
})

D1_ORDER = ["Emotional", "Informational", "Esteem", "Appraisal", "Network", "Tangible"]
D2_ORDER = ["Listener", "Reflective Partner", "Coach", "Advisor", "Companion", "Navigator"]

PAL_D1 = {"Emotional": "#E8646A", "Informational": "#4C9BD6", "Esteem": "#9B72CF",
           "Appraisal": "#6BBF6B", "Network": "#E8A044", "Tangible": "#50BFC9"}
PAL_D2 = {"Listener": "#E8646A", "Reflective Partner": "#9B72CF", "Coach": "#50BFC9",
           "Advisor": "#4C9BD6", "Companion": "#E8A044", "Navigator": "#D66BA0"}

MARKERS_D2 = {"Listener": "o", "Reflective Partner": "s", "Coach": "^",
              "Advisor": "D", "Companion": "P", "Navigator": "X"}

class MultiTaskAROMAModel(nn.Module):
    def __init__(self, input_dim, d1_classes, d2_classes, d3_classes):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(input_dim, 256), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.2))
        self.head_d1 = nn.Linear(128, d1_classes)
        self.head_d2 = nn.Linear(128, d2_classes)
        self.head_d3 = nn.Linear(128, d3_classes)
    def forward(self, x):
        h = self.shared(x)
        return self.head_d1(h), self.head_d2(h), self.head_d3(h)
    def shared_repr(self, x):
        return self.shared(x)

def main():
    # Load
    with open(os.path.join(BASE, "esconv_gold_400.json")) as f:
        gold = json.load(f)
    X_raw = np.load(os.path.join(BASE, "embeddings_384.npy"))
    with open(os.path.join(BASE, "label_encoders.pkl"), "rb") as f:
        enc = pickle.load(f)

    d1_labels = [g["d1"] for g in gold]
    d2_labels = [g["d2"] for g in gold]

    model = MultiTaskAROMAModel(384, len(enc["le_d1"].classes_),
                                len(enc["le_d2"].classes_), len(enc["le_d3"].classes_))
    model.load_state_dict(torch.load(os.path.join(BASE, "aroma_model.pth"),
                                     map_location="cpu", weights_only=True))
    model.eval()

    with torch.no_grad():
        X_shared = model.shared_repr(torch.FloatTensor(X_raw)).numpy()

    # Compute projections
    pca_pre = PCA(n_components=2, random_state=42).fit_transform(X_raw)
    pca_post = PCA(n_components=2, random_state=42).fit_transform(X_shared)

    # ════════════════════════════════════════════════════════════════════════
    #  FIGURE A: Bivariate Shared Map (color=D1, shape=D2) — single panel
    # ════════════════════════════════════════════════════════════════════════
    fig, ax = plt.subplots(figsize=(10, 8))

    for d2 in D2_ORDER:
        for d1 in D1_ORDER:
            mask = [(a == d1 and b == d2) for a, b in zip(d1_labels, d2_labels)]
            if not any(mask):
                continue
            pts = pca_post[mask]
            ax.scatter(pts[:, 0], pts[:, 1],
                       c=PAL_D1[d1], marker=MARKERS_D2[d2],
                       s=50, alpha=0.75, edgecolors="white", linewidth=0.4)

    # D1 legend (color)
    d1_handles = [Line2D([0], [0], marker="o", color="w", markerfacecolor=PAL_D1[d],
                         markersize=8, label=d) for d in D1_ORDER]
    leg1 = ax.legend(handles=d1_handles, title="D1: Support Type", title_fontsize=9,
                     loc="upper left", framealpha=0.92, edgecolor="#CCCCCC", fontsize=8)
    ax.add_artist(leg1)

    # D2 legend (shape)
    d2_handles = [Line2D([0], [0], marker=MARKERS_D2[d], color="w",
                         markerfacecolor="#666666", markeredgecolor="#666666",
                         markersize=8, label=d) for d in D2_ORDER]
    ax.legend(handles=d2_handles, title="D2: Care Role", title_fontsize=9,
              loc="upper right", framealpha=0.92, edgecolor="#CCCCCC", fontsize=8)

    ax.set_xlabel("PCA 1")
    ax.set_ylabel("PCA 2")
    ax.set_title("Shared Representation Space: D1 (color) × D2 (shape)", pad=14)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    plt.savefig(os.path.join(OUT, "shared_map.png"))
    plt.close()
    print("  ✓ shared_map.png")

    # ════════════════════════════════════════════════════════════════════════
    #  FIGURE B: 2×2 Before/After Grid
    # ════════════════════════════════════════════════════════════════════════
    fig, axes = plt.subplots(2, 2, figsize=(14, 12))
    fig.suptitle("Embedding Space: Before vs. After Multitask Training",
                 fontsize=15, fontweight="bold", y=0.97)

    configs = [
        (axes[0, 0], pca_pre,  d1_labels, PAL_D1, D1_ORDER, "Pre-training — D1 Support Type"),
        (axes[0, 1], pca_pre,  d2_labels, PAL_D2, D2_ORDER, "Pre-training — D2 Care Role"),
        (axes[1, 0], pca_post, d1_labels, PAL_D1, D1_ORDER, "Post-training — D1 Support Type"),
        (axes[1, 1], pca_post, d2_labels, PAL_D2, D2_ORDER, "Post-training — D2 Care Role"),
    ]

    for ax, X2d, labels, pal, order, title in configs:
        for cat in order:
            mask = [l == cat for l in labels]
            if not any(mask):
                continue
            pts = X2d[mask]
            ax.scatter(pts[:, 0], pts[:, 1], c=pal[cat], label=cat,
                       s=28, alpha=0.7, edgecolors="white", linewidth=0.3)
        ax.legend(loc="best", framealpha=0.9, edgecolor="#CCCCCC", fontsize=7,
                  markerscale=0.9)
        ax.set_title(title, fontsize=11, pad=8)
        ax.set_xlabel("PCA 1", fontsize=9)
        ax.set_ylabel("PCA 2", fontsize=9)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)

    # Add row labels
    for ax, label in [(axes[0, 0], "BEFORE\n(MiniLM 384-d)"),
                      (axes[1, 0], "AFTER\n(Shared 128-d)")]:
        ax.annotate(label, xy=(-0.18, 0.5), xycoords="axes fraction",
                    fontsize=10, fontweight="bold", color="#666666",
                    ha="center", va="center", rotation=90)

    plt.tight_layout(rect=[0.03, 0, 1, 0.95])
    plt.savefig(os.path.join(OUT, "shared_map_grid.png"))
    plt.close()
    print("  ✓ shared_map_grid.png")

if __name__ == "__main__":
    main()
