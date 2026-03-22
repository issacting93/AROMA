import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

import torch
torch.set_num_threads(1)

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import PCA

def main():
    print("Loading pristine Gold dataset...")
    # Using the 385 verified Haiku baseline constraints
    with open("esconv_gold_400.json") as f:
        dataset = json.load(f)

    texts = [item["input_text"] for item in dataset]
    d1_labels = [item["d1"] for item in dataset]
    d2_labels = [item["d2"] for item in dataset]

    print("Loading all-MiniLM-L6-v2 transformer (100% free local execution)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Encoding texts into 384-dimensional vectors...")
    embeddings = model.encode(texts, show_progress_bar=True)
    
    print("Projecting vectors to 2D using PCA for mathematical visualisation...")
    pca = PCA(n_components=2, random_state=42)
    embeddings_2d = pca.fit_transform(embeddings)
    
    df = pd.DataFrame({
        "x": embeddings_2d[:, 0],
        "y": embeddings_2d[:, 1],
        "D1 (Support Type)": d1_labels,
        "D2 (Care Role)": d2_labels
    })

    # Plot D1 Support Type clustering
    plt.figure(figsize=(12, 9))
    sns.scatterplot(data=df, x="x", y="y", hue="D1 (Support Type)", palette="Set2", s=90, alpha=0.85)
    plt.title("Zero-Cost Vector Projection: MiniLM Embeddings over Support Type (D1)", fontsize=16, pad=15, fontweight="bold")
    # Clean up the visual graph
    plt.xticks([])
    plt.yticks([])
    plt.xlabel("PCA Component 1", fontsize=12)
    plt.ylabel("PCA Component 2", fontsize=12)
    plt.legend(title="D1 Baseline Label", title_fontsize='13', fontsize='11')
    sns.despine(left=True, bottom=True)
    plt.tight_layout()
    plt.savefig("embedding_d1.png", dpi=300)
    plt.close()

    # Plot D2 Care Role clustering
    plt.figure(figsize=(12, 9))
    sns.scatterplot(data=df, x="x", y="y", hue="D2 (Care Role)", palette="blend:#7AB,#EDA", s=90, alpha=0.85)
    plt.title("Zero-Cost Vector Projection: MiniLM Embeddings over Care Role (D2)", fontsize=16, pad=15, fontweight="bold")
    plt.xticks([])
    plt.yticks([])
    plt.xlabel("PCA Component 1", fontsize=12)
    plt.ylabel("PCA Component 2", fontsize=12)
    plt.legend(title="D2 Ground Truth", title_fontsize='13', fontsize='11')
    sns.despine(left=True, bottom=True)
    plt.tight_layout()
    plt.savefig("embedding_d2.png", dpi=300)
    plt.close()

    print("\nSUCCESS: Embedding plots saved to embedding_d1.png and embedding_d2.png")

if __name__ == "__main__":
    main()
