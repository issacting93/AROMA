import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import plotly.graph_objects as go
import json
from collections import Counter, defaultdict
import os

def main():
    print("Loading esconv_aroma_full_llm.json...")
    with open('esconv_aroma_full_llm.json') as f:
        data = json.load(f)
    
    with open('ESConv.json') as f:
        raw_data = json.load(f)
    
    supporter_turns = []
    for conv in raw_data:
        for turn in conv['dialog']:
            if turn['speaker'] == 'supporter':
                supporter_turns.append(turn)
    
    # Output directories — artifacts dir AND local figures dir
    out_dir = os.path.expanduser("~/.gemini/antigravity/brain/e41227f0-3efa-4db4-be7b-d50e985919da")
    fig_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figures")
    os.makedirs(fig_dir, exist_ok=True)
    
    results = []
    for i, res in enumerate(data):
        if res and i < len(supporter_turns):
            turn = supporter_turns[i]
            
            d1 = res.get('d1')
            if isinstance(d1, list): d1 = d1[0] if d1 else None
            
            d2 = res.get('d2')
            if isinstance(d2, list): d2 = d2[0] if d2 else None

            results.append({
                'd1': str(d1).upper() if d1 is not None else None,
                'd2': str(d2) if d2 is not None else None,
                'strategy': turn.get('annotation', {}).get('strategy', 'Unknown')
            })


    # 1. D1 Distribution
    print("Generating D1 Full Distribution...")
    d1_counts = Counter(r['d1'] for r in results if r['d1'])
    d1_df = pd.DataFrame(d1_counts.most_common(), columns=['Support Type', 'Count'])
    
    plt.figure(figsize=(10, 6))
    sns.barplot(data=d1_df, x='Count', y='Support Type', palette='viridis')
    plt.title('D1 Support Type Distribution (Full Corpus, 18k Turns)', fontsize=14)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/d1_full_distribution.webp")
    plt.savefig(f"{fig_dir}/d1_full_distribution.webp")
    plt.close()

    # 2. D2 Distribution
    print("Generating D2 Full Distribution...")
    d2_counts = Counter(r['d2'] for r in results if r['d2'])
    d2_df = pd.DataFrame(d2_counts.most_common(), columns=['Care Role', 'Count'])
    
    plt.figure(figsize=(10, 6))
    sns.barplot(data=d2_df, x='Count', y='Care Role', palette='muted')
    plt.title('D2 Care Role Distribution (Full Corpus, 18k Turns)', fontsize=14)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/d2_full_distribution.webp")
    plt.savefig(f"{fig_dir}/d2_full_distribution.webp")
    plt.close()

    # 3. D1 x D2 Heatmap
    print("Generating D1xD2 Full Heatmap...")
    cooc = defaultdict(Counter)
    for r in results:
        if r['d1'] and r['d2']:
            cooc[r['d1']][r['d2']] += 1
            
    # Capitalize types to match LLM output
    d1_types = ['EMOTIONAL', 'INFORMATIONAL', 'ESTEEM', 'APPRAISAL', 'NETWORK', 'TANGIBLE']
    d2_roles = ['LISTENER', 'REFLECTIVE PARTNER', 'COACH', 'ADVISOR', 'COMPANION', 'NAVIGATOR']
    
    matrix = np.zeros((len(d1_types), len(d2_roles)))
    for i, d1 in enumerate(d1_types):
        for j, d2 in enumerate(d2_roles):
            matrix[i, j] = cooc[d1][d2]
            
    df_heat = pd.DataFrame(matrix, index=d1_types, columns=d2_roles)
    
    plt.figure(figsize=(12, 10))
    sns.heatmap(df_heat, annot=True, fmt='g', cmap='Blues')
    plt.title('D1 (Support Type) × D2 (Care Role) Full Corpus Heatmap', fontsize=14)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/d1_d2_full_heatmap.webp")
    plt.savefig(f"{fig_dir}/d1_d2_full_heatmap.webp")
    plt.close()

    # 4. D2 x D3 Heatmap
    print("Generating D2xD3 Full Heatmap...")
    d2_d3_cooc = defaultdict(Counter)
    for r in results:
        if r['d2'] and r['strategy']:
            d2_d3_cooc[r['d2']][r['strategy']] += 1
            
    d3_types = ['Question', 'Restatement or Paraphrasing', 'Reflection of feelings', 'Self-disclosure', 'Affirmation and Reassurance', 'Providing Suggestions', 'Information', 'Others']
    
    matrix_d2d3 = np.zeros((len(d2_roles), len(d3_types)))
    for i, d2 in enumerate(d2_roles):
        for j, d3 in enumerate(d3_types):
            matrix_d2d3[i, j] = d2_d3_cooc[d2][d3]
            
    df_heat_d2d3 = pd.DataFrame(matrix_d2d3, index=d2_roles, columns=d3_types)
    
    plt.figure(figsize=(14, 10))
    sns.heatmap(df_heat_d2d3, annot=True, fmt='g', cmap='Greens')
    plt.title('D2 (Care Role) × D3 (Strategic Turn Type) Full Corpus Heatmap', fontsize=14)
    plt.tight_layout()
    plt.savefig(f"{out_dir}/d2_d3_full_heatmap.webp")
    plt.savefig(f"{fig_dir}/d2_d3_full_heatmap.webp")
    plt.close()

    # 5. Sankey Diagram (D1 -> D2 -> D3)
    print("Generating D1 -> D2 -> D3 Sankey Diagram...")
    all_nodes = list(d1_types) + list(d2_roles) + list(['Quest.', 'Restate.', 'Reflect.', 'Self-d.', 'Affirm.', 'Suggest.', 'Info.', 'Others'])
    node_map = {node: i for i, node in enumerate(all_nodes)}
    
    d3_map = {
        'Question': 'Quest.', 
        'Restatement or Paraphrasing': 'Restate.', 
        'Reflection of feelings': 'Reflect.', 
        'Self-disclosure': 'Self-d.', 
        'Affirmation and Reassurance': 'Affirm.', 
        'Providing Suggestions': 'Suggest.', 
        'Information': 'Info.', 
        'Others': 'Others'
    }

    links = []
    d1_d2_links = defaultdict(int)
    d2_d3_links = defaultdict(int)
    
    for r in results:
        # D1 -> D2
        if r['d1'] in d1_types and r['d2'] in d2_roles:
            d1_d2_links[(r['d1'], r['d2'])] += 1
        # D2 -> D3
        d3_short = d3_map.get(r['strategy'], 'Others')
        if r['d2'] in d2_roles:
            d2_d3_links[(r['d2'], d3_short)] += 1
            
    for (src, tgt), val in d1_d2_links.items():
        links.append({'source': node_map[src], 'target': node_map[tgt], 'value': val})
    for (src, tgt), val in d2_d3_links.items():
        links.append({'source': node_map[src], 'target': node_map[tgt], 'value': val})

    # Define colors for nodes
    node_colors = []
    for node in all_nodes:
        if node in d1_types: node_colors.append("rgba(31, 119, 180, 0.8)") # Blue
        elif node in d2_roles: node_colors.append("rgba(255, 127, 14, 0.8)") # Orange
        else: node_colors.append("rgba(44, 160, 44, 0.8)") # Green

    fig = go.Figure(data=[go.Sankey(
        node = dict(
          pad = 20,
          thickness = 30,
          line = dict(color = "black", width = 0.5),
          label = all_nodes,
          color = node_colors,
          customdata = all_nodes,
          hovertemplate = 'Node %{label}<br />Total turns: %{value}<extra></extra>'
        ),
        link = dict(
          source = [l['source'] for l in links],
          target = [l['target'] for l in links],
          value = [l['value'] for l in links],
          color = "rgba(200, 200, 255, 0.3)",
          hovertemplate = 'Flow: %{source.label} → %{target.label}<br />Turns: %{value}<extra></extra>'
        ))])

    fig.update_layout(
        title_text="AROMA Flow: D1 (Support Type) → D2 (Care Role) → D3 (Strategic Turn Type)",
        font_size=12,
        paper_bgcolor='white',
        plot_bgcolor='white'
    )
    
    # Custom JS for "Click to Focus" behavior
    # This script will dim all other flows when a node is clicked
    js_focus = """
    var plotDiv = document.getElementsByClassName('plotly-graph-div')[0];
    if (plotDiv) {
        plotDiv.on('plotly_click', function(data) {
            var point = data.points[0];
            if (point.hasOwnProperty('source')) {
                // Link clicked - highlight this specific link
                console.log('Link clicked', point);
            } else {
                // Node clicked - highlight all flows from/to this node
                var nodeIndex = point.pointNumber;
                console.log('Node clicked', nodeIndex);
                
                // Note: Plotly's static export doesn't easily allow partial re-rendering
                // of a single trace without full Restyle. 
                // We'll keep it simple: highlight on click is done via the default Plotly selection
                // but we can add a custom alert or log for now.
            }
        });
    }
    """
    
    # Actually, for a pure "disable the rest" on click in a static HTML, 
    # we can use the 'plotly_select' or just rely on Plotly's built-in node selection
    # if we enable it.
    
    html_content = fig.to_html(include_plotlyjs='cdn', full_html=True)
    
    # Injecting a more powerful CSS/JS for the focus behavior
    focus_script = """
    <script>
    window.addEventListener('load', function() {
        var gd = document.getElementsByClassName('plotly-graph-div')[0];
        
        // Store original colors for reset
        var originalLinkColors = null;
        
        gd.on('plotly_click', function(data) {
            var fullData = gd._fullData[0];
            if (!originalLinkColors) {
                originalLinkColors = [...fullData.link.color];
            }
            
            var point = data.points[0];
            var newColors = originalLinkColors.map(() => "rgba(200, 200, 200, 0.05)"); // Ultra-dim
            
            if (point.source) {
                // Link clicked - highlight just this path
                newColors[point.pointNumber] = "rgba(50, 50, 200, 0.8)";
            } else {
                // Node clicked - highlight all connected links
                var nodeIdx = point.pointNumber;
                fullData.link.source.forEach((s, i) => {
                    if (s === nodeIdx || fullData.link.target[i] === nodeIdx) {
                        newColors[i] = originalLinkColors[i].replace("0.3", "0.8");
                    }
                });
            }
            
            Plotly.restyle(gd, {'link.color': [newColors]});
        });
        
        // Double click to reset
        gd.on('plotly_doubleclick', function() {
            if (originalLinkColors) {
                Plotly.restyle(gd, {'link.color': [originalLinkColors]});
            }
        });
    });
    </script>
    <div style="position: absolute; top: 10px; right: 10px; font-family: sans-serif; background: rgba(255,255,255,0.8); padding: 5px; border-radius: 5px; font-size: 11px; pointer-events: none;">
        <b>Interactivity:</b> Click node/link to focus. Double-click background to reset.
    </div>
    """
    html_content = html_content.replace('</body>', focus_script + '</body>')

    with open(f"{out_dir}/aroma_sankey.html", 'w') as f: f.write(html_content)
    with open(f"{fig_dir}/aroma_sankey.html", 'w') as f: f.write(html_content)

    print(f"SUCCESS: Sankey diagram (Interactive) saved to {out_dir}/aroma_sankey.html")
    print(f"SUCCESS: Sankey diagram (Interactive) saved to {fig_dir}/aroma_sankey.html")
    print(f"SUCCESS: All visualizations saved to {out_dir} and {fig_dir}")

if __name__ == "__main__":
    main()
