import os
import json
import torch
import torch.nn as nn
import numpy as np
import pandas as pd
import pickle
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE

# ── Paths ────────────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.join(BASE, "figures", "final")
os.makedirs(OUT, exist_ok=True)

# ── Unified Style ────────────────────────────────────────────────────────────
plt.rcParams.update({
    "font.family":       "sans-serif",
    "font.size":         10,
    "axes.titlesize":    12,
    "axes.titleweight":  "bold",
    "figure.facecolor":  "white",
    "axes.facecolor":    "white"
})

# Palettes (Matching generate_final_figures.py)
PAL_D1 = {"Emotional": "#E8646A", "Informational": "#4C9BD6", "Esteem": "#9B72CF",
           "Appraisal": "#6BBF6B", "Network": "#E8A044", "Tangible": "#50BFC9"}
PAL_D2 = {"Listener": "#E8646A", "Reflective Partner": "#9B72CF", "Coach": "#50BFC9",
           "Advisor": "#4C9BD6", "Companion": "#E8A044", "Navigator": "#D66BA0"}

D1_ORDER = ["Emotional", "Informational", "Esteem", "Appraisal", "Network", "Tangible"]
D2_ORDER = ["Listener", "Reflective Partner", "Coach", "Advisor", "Companion", "Navigator"]

# ── Model class ──────────────────────────────────────────────────────────────
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
        return self.shared(x)

def main():
    print("Loading data and model...")
    X_embed = np.load(os.path.join(BASE, "embeddings_384.npy"))
    with open(os.path.join(BASE, "esconv_gold_400.json")) as f:
        gold = json.load(f)
    with open(os.path.join(BASE, "label_encoders.pkl"), "rb") as f:
        encoders = pickle.load(f)
    
    le_d1, le_d2, le_d3 = encoders["le_d1"], encoders["le_d2"], encoders["le_d3"]
    gold_d1 = [g["d1"] for g in gold]
    gold_d2 = [g["d2"] for g in gold]

    model = MultiTaskAROMAModel(384, len(le_d1.classes_), len(le_d2.classes_), len(le_d3.classes_))
    model.load_state_dict(torch.load(os.path.join(BASE, "aroma_model.pth"), map_location="cpu", weights_only=True))
    model.eval()

    with torch.no_grad():
        X_shared = model.shared_repr(torch.FloatTensor(X_embed)).numpy()

    print("Computing projections...")
    pca = PCA(n_components=2, random_state=42)
    X_pca = pca.fit_transform(X_shared)
    
    tsne = TSNE(n_components=2, random_state=42, perplexity=30)
    X_tsne = tsne.fit_transform(X_shared)

    # ── Plotting Grid ────────────────────────────────────────────────────────
    fig, axes = plt.subplots(2, 2, figsize=(16, 14))
    plt.subplots_adjust(wspace=0.25, hspace=0.3)

    configs = [
        (X_pca, gold_d1, PAL_D1, D1_ORDER, "A. D1 Support Type (Global PCA)", "PCA 1", "PCA 2", axes[0,0]),
        (X_pca, gold_d2, PAL_D2, D2_ORDER, "B. D2 Care Role (Global PCA)", "PCA 1", "PCA 2", axes[0,1]),
        (X_tsne, gold_d1, PAL_D1, D1_ORDER, "C. D1 Support Type (Local t-SNE)", "t-SNE 1", "t-SNE 2", axes[1,0]),
        (X_tsne, gold_d2, PAL_D2, D2_ORDER, "D. D2 Care Role (Local t-SNE)", "t-SNE 1", "t-SNE 2", axes[1,1])
    ]

    for X2d, labels, palette, order, title, xl, yl, ax in configs:
        for cat in order:
            mask = [l == cat for l in labels]
            if any(mask):
                pts = X2d[mask]
                ax.scatter(pts[:, 0], pts[:, 1], c=palette[cat], label=cat, s=40, alpha=0.75, edgecolors="white", linewidth=0.4)
        ax.set_title(title, pad=10)
        ax.set_xlabel(xl)
        ax.set_ylabel(yl)
        ax.spines["top"].set_visible(False)
        ax.spines["right"].set_visible(False)
        ax.legend(loc="best", fontsize=8, framealpha=0.8)

    plt.suptitle("The AROMA Shared Map: One Latent Space, Three Dimensions of Meaning", fontsize=18, fontweight="bold", y=0.96)
    
    out_path = os.path.join(OUT, "combined_shared_map.png")
    plt.savefig(out_path, dpi=300, bbox_inches="tight")
    print(f"SUCCESS: Combined Shared Map saved to {out_path}")

if __name__ == "__main__":
    main()
