#!/usr/bin/env python3
"""Generate a Sankey diagram for AROMA dimensions.

Visualizes the flow: Seeker Stance -> D1 (Support Type) -> D2 (Care Role) -> D3 (Strategies).
Uses plotly if available, otherwise falls back to a data summary.
"""

import csv
import os
import sys
from collections import Counter

OUT = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(OUT, "..", "..", "aroma_annotations_2026-03-29.csv")

def main():
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV not found at {CSV_PATH}")
        return

    rows = []
    with open(CSV_PATH) as f:
        for r in csv.DictReader(f):
            rows.append(r)

    CODERS = {
        "bf32f904-50b3-4abb-9e0a-11aa1e2fb942": "Coder A",
        "41f829d6-9b5c-4fac-bfae-340a90fd8b25": "Coder B",
        "combined": "Team Combined"
    }

    try:
        import plotly.graph_objects as go
        import kaleido
    except ImportError:
        print("Required libraries missing.")
        return

    for cid, name in CODERS.items():
        if cid == "combined":
            coder_rows = [r for r in rows if r["coder_id"].strip() in ["bf32f904-50b3-4abb-9e0a-11aa1e2fb942", "41f829d6-9b5c-4fac-bfae-340a90fd8b25"]]
        else:
            coder_rows = [r for r in rows if r["coder_id"].strip() == cid]
        
        if not coder_rows: continue
        
        flow_counts = Counter()
        for r in coder_rows:
            st = r["seeker_stance"].strip() or "None"
            d1 = r["d1_support_type"].strip() or "None"
            d2 = r["primary_d2_role"].strip() or "None"
            d3s = [s.strip() for s in r["d3_strategies"].split(";") if s.strip()]
            
            flow_counts[(f"ST_{st}", f"D1_{d1}")] += 1
            flow_counts[(f"D1_{d1}", f"D2_{d2}")] += 1
            for d3 in d3s:
                flow_counts[(f"D2_{d2}", f"D3_{d3}")] += 1

        nodes = sorted(list(set([f for flow in flow_counts.keys() for f in flow])))
        node_map = {node_name: i for i, node_name in enumerate(nodes)}
        
        sources = [node_map[f[0]] for f in flow_counts.keys()]
        targets = [node_map[f[1]] for f in flow_counts.keys()]
        values = [flow_counts[f] for f in flow_counts.keys()]
        display_labels = [n.split("_", 1)[1] if "_" in n else n for n in nodes]
        
        colors = []
        for n in nodes:
            if n.startswith("ST_"): colors.append("rgba(31, 119, 180, 0.8)")
            elif n.startswith("D1_"): colors.append("rgba(255, 127, 14, 0.8)")
            elif n.startswith("D2_"): colors.append("rgba(44, 160, 44, 0.8)")
            elif n.startswith("D3_"): colors.append("rgba(214, 39, 40, 0.8)")
            else: colors.append("grey")

        fig = go.Figure(data=[go.Sankey(
            node = dict(pad=15, thickness=20, line=dict(color="black", width=0.5), label=display_labels, color=colors),
            link = dict(source=sources, target=targets, value=values)
        )])

        fig.update_layout(title_text=f"AROMA Taxonomy Flow ({name}): Stance → D1 → D2 → D3", font_size=10)
        
        suffix = name.lower().replace(" ", "_")
        fig.write_html(os.path.join(OUT, f"fig15_{suffix}_flow.html"))
        try:
            fig.write_image(os.path.join(OUT, f"fig15_{suffix}_flow.png"), engine="kaleido")
            print(f"Saved {name} Sankey to fig15_{suffix}_flow.png")
        except Exception as e:
            print(f"Could not save {name} PNG: {e}")

if __name__ == "__main__":
    main()


if __name__ == "__main__":
    main()
