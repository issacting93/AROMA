import json
import os
import plotly.graph_objects as go
from collections import Counter, defaultdict

def main():
    print("Generating full corpus Sankey diagram (18,296 turns)...")
    
    # 1. Load data
    with open("ESConv.json") as f:
        raw_data = json.load(f)
    with open("esconv_aroma_full_llm.json") as f:
        full_labels = json.load(f)
        
    records = []
    label_ptr = 0
    for conv in raw_data:
        for turn in conv["dialog"]:
            if turn["speaker"] == "supporter":
                if label_ptr >= len(full_labels): break
                labels = full_labels[label_ptr]
                label_ptr += 1
                if not labels or not labels.get("d1") or not labels.get("d2"): continue
                
                records.append({
                    "d1": labels["d1"].title(),
                    "d2": labels["d2"].title(),
                    "d3": turn.get("annotation", {}).get("strategy", "Others")
                })

    print(f"Combined {len(records)} records for Sankey.")

    # 2. Define Nodes and Colors
    D1_NODES = ["Emotional", "Informational", "Esteem", "Appraisal", "Network", "Tangible"]
    D2_NODES = ["Listener", "Reflective Partner", "Coach", "Navigator", "Advisor", "Companion"]
    D3_NODES = ["Question", "Restatement or Paraphrasing", "Reflection of feelings",
                "Self-disclosure", "Affirmation and Reassurance", "Providing Suggestions",
                "Information", "Others"]
    
    # Combine into unique node list
    all_nodes = D1_NODES + D2_NODES + D3_NODES
    node_map = {n: i for i, n in enumerate(all_nodes)}
    
    # 3. Calculate Links
    sources = []
    targets = []
    values = []
    
    # D1 (Type) -> D2 (Role)
    cooc12 = defaultdict(int)
    for r in records: cooc12[(r["d1"], r["d2"])] += 1
    for (d1, d2), val in cooc12.items():
        sources.append(node_map[d1])
        targets.append(node_map[d2])
        values.append(val)
        
    # D2 (Role) -> D3 (Strategy)
    cooc23 = defaultdict(int)
    for r in records: cooc23[(r["d2"], r["d3"])] += 1
    for (d2, d3), val in cooc23.items():
        sources.append(node_map[d2])
        targets.append(node_map[d3])
        values.append(val)

    # 4. Generate Sankey
    fig = go.Figure(data=[go.Sankey(
        node = dict(
          pad = 15,
          thickness = 20,
          line = dict(color = "black", width = 0.5),
          label = all_nodes,
          color = "rgba(100, 100, 255, 0.8)"
        ),
        link = dict(
          source = sources,
          target = targets,
          value = values,
          color = "rgba(200, 200, 200, 0.4)"
      ))])

    fig.update_layout(title_text=f"AROMA Flow: D1 (Type) → D2 (Role) → D3 (Strategy) [N={len(records):,}]", font_size=10)
    
    # Save as HTML and static image (if plotly-orca/kaleido is available)
    fig.write_html("figures/final/full_sankey.html")
    print("  ✓ Saved figures/final/full_sankey.html")
    
    try:
        import kaleido
        fig.write_image("figures/final/full_sankey.png")
        print("  ✓ Saved figures/final/full_sankey.png")
    except ImportError:
        print("  ! Could not save .png (kaleido missing). Please use the HTML file.")

if __name__ == "__main__":
    main()
