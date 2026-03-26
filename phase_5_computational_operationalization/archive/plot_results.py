import os
import sys

# Ensure dependencies are installed
try:
    import pandas as pd
    import seaborn as sns
    import matplotlib.pyplot as plt
    import numpy as np
except ImportError:
    print("Installing required packages...")
    os.system('python3 -m pip install pandas matplotlib seaborn --break-system-packages')
    import pandas as pd
    import seaborn as sns
    import matplotlib.pyplot as plt
    import numpy as np

import json
from collections import Counter, defaultdict

def main():
    print("Loading esconv_d1_full.json...")
    with open('esconv_d1_full.json') as f:
        data = json.load(f)

    print("Generating D1 Bar Chart...")
    d1_counts = Counter(t['d1'] for t in data)
    labels = list(d1_counts.keys())
    values = list(d1_counts.values())

    sorted_pairs = sorted(zip(labels, values), key=lambda x: x[1], reverse=False)
    labels, values = zip(*sorted_pairs)

    plt.figure(figsize=(10, 6))
    colors = sns.color_palette('viridis', len(labels))
    bars = plt.barh(labels, values, color=colors)

    plt.title('D1 Support Type Distribution (Heuristic Baseline)', fontsize=14, pad=20)
    plt.xlabel('Number of Turns', fontsize=12)
    plt.ylabel('Support Type', fontsize=12)

    for bar in bars:
        width = bar.get_width()
        plt.text(width + max(values)*0.01, bar.get_y() + bar.get_height()/2, 
                 f'{int(width):,}', ha='left', va='center', fontsize=10)

    plt.tight_layout()
    plt.savefig('/Users/zac/.gemini/antigravity/brain/aea16e0e-5f9e-40b4-a437-c148b980ec37/d1_heuristic_distribution.webp', dpi=300, format='webp')
    plt.close()

    print("Generating D1xD3 Heatmap...")
    cooccurrence = defaultdict(Counter)
    for t in data:
        cooccurrence[t['d1']][t['strategy']] += 1

    strategies = ['Question', 'Restatement or Paraphrasing', 'Reflection of feelings', 
                  'Self-disclosure', 'Affirmation and Reassurance', 'Providing Suggestions', 
                  'Information', 'Others']
    d1_types = ['Emotional', 'Informational', 'Network', 'Esteem', 'Appraisal', 'Tangible']

    matrix = np.zeros((len(d1_types), len(strategies)))
    for i, d1 in enumerate(d1_types):
        for j, s in enumerate(strategies):
            matrix[i, j] = cooccurrence[d1][s]

    df = pd.DataFrame(matrix, index=d1_types, columns=strategies)

    plt.figure(figsize=(12, 8))
    sns.heatmap(df, annot=True, fmt='g', cmap='YlGnBu', cbar_kws={'label': 'Number of Turns'})
    plt.title('D1 Support Type × D3 Support Strategy Co-occurrence Matrix', fontsize=14, pad=20)
    plt.xlabel('D3 Support Strategy (Dataset Labels)', fontsize=12)
    plt.ylabel('D1 Support Type (Heuristic Labels)', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('/Users/zac/.gemini/antigravity/brain/aea16e0e-5f9e-40b4-a437-c148b980ec37/d1_d3_heatmap.webp', dpi=300, format='webp')
    plt.close()
    
    print("Visualizations saved to artifacts directory.")

if __name__ == "__main__":
    main()
