import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

def main():
    # Hardcoded empirical results from Phase 5 annotations
    data = [
        {"Role": "Companion", "Count": 101, "Model": "Claude 3 Haiku"},
        {"Role": "Listener", "Count": 94, "Model": "Claude 3 Haiku"},
        {"Role": "Reflective Partner", "Count": 122, "Model": "Claude 3 Haiku"},
        {"Role": "Advisor", "Count": 41, "Model": "Claude 3 Haiku"},
        {"Role": "Coach", "Count": 36, "Model": "Claude 3 Haiku"},
        {"Role": "Navigator", "Count": 6, "Model": "Claude 3 Haiku"},
        
        {"Role": "Companion", "Count": 137, "Model": "Claude Sonnet 4.6"},
        {"Role": "Listener", "Count": 101, "Model": "Claude Sonnet 4.6"},
        {"Role": "Reflective Partner", "Count": 39, "Model": "Claude Sonnet 4.6"},
        {"Role": "Advisor", "Count": 59, "Model": "Claude Sonnet 4.6"},
        {"Role": "Coach", "Count": 42, "Model": "Claude Sonnet 4.6"},
        {"Role": "Navigator", "Count": 22, "Model": "Claude Sonnet 4.6"},
        
        {"Role": "Companion", "Count": 87, "Model": "Claude Opus 4.6"},
        {"Role": "Listener", "Count": 110, "Model": "Claude Opus 4.6"},
        {"Role": "Reflective Partner", "Count": 44, "Model": "Claude Opus 4.6"},
        {"Role": "Advisor", "Count": 84, "Model": "Claude Opus 4.6"},
        {"Role": "Coach", "Count": 51, "Model": "Claude Opus 4.6"},
        {"Role": "Navigator", "Count": 24, "Model": "Claude Opus 4.6"},
    ]
    df = pd.DataFrame(data)
    
    # Sort roles roughly by Haiku vs Sonnet variance or logically
    role_order = ["Reflective Partner", "Companion", "Listener", "Advisor", "Coach", "Navigator"]
    
    plt.figure(figsize=(12, 6))
    
    # Use a distinct, sharp color palette to separate the models
    palette = {"Claude 3 Haiku": "#7fb3d5", "Claude Sonnet 4.6": "#1a5276", "Claude Opus 4.6": "#d35400"}
    
    ax = sns.barplot(data=df, x="Role", y="Count", hue="Model", palette=palette, order=role_order)
    
    plt.title("Inter-Rater Model Discrepancy: Haiku vs. Sonnet 4.6", fontsize=15, pad=20, fontweight="bold")
    plt.ylabel("Number of Sequences (out of 400)", fontsize=12)
    plt.xlabel("AROMA Care Role (D2)", fontsize=12)
    plt.xticks(fontsize=11)
    
    # Place values on top of the bars
    for container in ax.containers:
        ax.bar_label(container, fmt='%.0f', padding=3, fontweight="bold")
        
    plt.legend(title="LLM Judge Model", title_fontsize='11', fontsize='10')
    plt.tight_layout()
    
    save_path = '/Users/zac/.gemini/antigravity/brain/aea16e0e-5f9e-40b4-a437-c148b980ec37/d2_model_comparison.webp'
    plt.savefig(save_path, dpi=300, format='webp')
    print(f"Saved to {save_path}")

if __name__ == "__main__":
    main()
