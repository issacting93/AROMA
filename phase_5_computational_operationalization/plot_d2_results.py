import json
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from collections import Counter, defaultdict

def main():
    print("Loading esconv_d1_llm_classified.json...")
    with open('esconv_d1_llm_classified.json') as f:
        d1_data = json.load(f)

    print("Loading esconv_d2_llm_classified.json...")
    with open('esconv_d2_llm_classified.json') as f:
        d2_data = json.load(f)

    d1_map = {f"{t['conv_idx']}_{t['turn_idx']}": t.get('d1') for t in d1_data if 'd1' in t}
    
    # 1. Plot D2 Distribution
    d2_counts = Counter()
    d1_d2_cooc = defaultdict(Counter)

    for t in d2_data:
        d2 = t.get('d2')
        if not d2 or type(d2) is not str: continue
        d2_counts[d2] += 1
        
        # Cross reference D1
        key = f"{t['conv_idx']}_{t['turn_idx']}"
        d1 = d1_map.get(key)
        if d1:
            d1_d2_cooc[d1][d2] += 1

    d2_roles = ['Reflective Partner', 'Companion', 'Listener', 'Advisor', 'Navigator', 'Coach']
    d2_values = [d2_counts[role] for role in d2_roles]

    plt.figure(figsize=(10, 6))
    colors = sns.color_palette("muted", len(d2_roles))
    sns.barplot(x=d2_roles, y=d2_values, palette=colors)
    plt.title('D2 Care Role Distribution (Claude 3 Haiku)', fontsize=14, pad=15)
    plt.xlabel('D2 Care Role', fontsize=12)
    plt.ylabel('Number of Sequences', fontsize=12)
    plt.xticks(rotation=30, ha='right')
    
    for i, v in enumerate(d2_values):
        plt.text(i, v + 2, str(v), ha='center', va='bottom', fontweight='bold')

    plt.tight_layout()
    dist_path = '/Users/zac/.gemini/antigravity/brain/aea16e0e-5f9e-40b4-a437-c148b980ec37/d2_llm_distribution.webp'
    plt.savefig(dist_path, dpi=300, format='webp')
    plt.close()

    # 2. Plot D1 x D2 Heatmap
    d1_types = ['Emotional', 'Informational', 'Esteem', 'Appraisal', 'Network']
    matrix = np.zeros((len(d1_types), len(d2_roles)))
    
    for i, d1 in enumerate(d1_types):
        for j, d2 in enumerate(d2_roles):
            matrix[i, j] = d1_d2_cooc[d1][d2]

    df = pd.DataFrame(matrix, index=d1_types, columns=d2_roles)

    plt.figure(figsize=(10, 8))
    sns.heatmap(df, annot=True, fmt='g', cmap='YlGnBu', cbar_kws={'label': 'Number of Co-occurrences'})
    plt.title('D1 (Support Type) × D2 (Care Role) LLM Mapping', fontsize=14, pad=20)
    plt.xlabel('D2 Care Role Context', fontsize=12)
    plt.ylabel('D1 Support Type Utterance', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    heat_path = '/Users/zac/.gemini/antigravity/brain/aea16e0e-5f9e-40b4-a437-c148b980ec37/d1_d2_llm_heatmap.webp'
    plt.savefig(heat_path, dpi=300, format='webp')
    plt.close()

    print(f"Saved D2 distribution: {dist_path}")
    print(f"Saved D1xD2 heatmap: {heat_path}")

if __name__ == "__main__":
    main()
