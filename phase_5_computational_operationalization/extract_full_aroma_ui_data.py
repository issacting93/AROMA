import json
import os

def main():
    # Paths
    esconv_path = '/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/ESConv.json'
    aroma_results_path = '/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/esconv_aroma_full_llm.json'
    out_js_path = '/Users/zac/Downloads/aroma_research_ui/aroma_sample_dataset.js'
    
    print("Loading datasets...")
    with open(esconv_path) as f:
        esconv = json.load(f)
    with open(aroma_results_path) as f:
        aroma_results = json.load(f)
        
    ui_conversations = []
    global_supporter_idx = 0
    
    max_convs = 500 # Full targeted batch size
    
    print(f"Mapping first {max_convs} conversations...")
    
    high_paradox_examples = []
    boundary_examples = []
    
    for i in range(min(max_convs, len(esconv))):
        if i % 10 == 0: print(f"  Processed {i} conversations...")
        raw_conv = esconv[i]
        
        ui_conv = {
            "id": f"ESCONV-{i:03d}",
            "title": f"Conversation {i}",
            "source": "ESConv Full Corpus",
            "problem_type": raw_conv.get('problem_type', 'unknown'),
            "emotion_type": raw_conv.get('emotion_type', 'unknown'),
            "notes": "Full corpus integration v2.",
            "turns": []
        }
        
        last_role = None
        for turn_idx, turn in enumerate(raw_conv['dialog']):
            if turn['speaker'] == 'supporter':
                res = aroma_results[global_supporter_idx] if global_supporter_idx < len(aroma_results) else None
                
                d1 = res['d1'].capitalize() if res and res.get('d1') else "Unknown"
                d2 = res['d2'].title() if res and res.get('d2') else "Unknown"
                d3 = turn.get('annotation', {}).get('strategy', 'Others')
                
                ui_turn = {
                    "idx": turn_idx,
                    "speaker": "supporter",
                    "content": turn['content'],
                    "d1": d1,
                    "d2": d2,
                    "d3": d3
                }
                ui_conv["turns"].append(ui_turn)
                
                # Capture high-paradox examples
                if d2 in ['Advisor', 'Navigator'] and len(high_paradox_examples) < 15:
                    high_paradox_examples.append({
                        "id": f"HP-{len(high_paradox_examples)}",
                        "role": d2,
                        "content": turn['content'],
                        "context_window": f"Conv {i}, Turn {turn_idx}. Topic: {ui_conv['problem_type']}",
                        "emotion_type": ui_conv['emotion_type'],
                        "problem_type": ui_conv['problem_type']
                    })
                
                # Capture boundary shifts
                if last_role and d2 != last_role and len(boundary_examples) < 10:
                    boundary_examples.append({
                        "id": f"B-{len(boundary_examples)}",
                        "role_a": last_role,
                        "role_b": d2,
                        "content": turn['content'],
                        "context_window": f"Shift in Conv {i} from {last_role} to {d2}.",
                        "notes": "Automatic extraction of role-boundary transition."
                    })
                
                last_role = d2
                global_supporter_idx += 1
            else:
                # Still need to increment global index if we were skipping user turns?
                # No, the classification script ONLY appends supporter turns to its list.
                pass
                
        ui_conversations.append(ui_conv)
        
    full_data = {
        "meta": {
            "name": "AROMA Full Corpus Dataset (500 Convs)",
            "description": "Validated 18k-turn dataset (subset) using hardened codebook prompt.",
            "source_note": f"Subset of {len(ui_conversations)} conversations from ESConv."
        },
        "conversations": ui_conversations,
        "reference_examples": {
            "boundary": boundary_examples,
            "high_paradox": high_paradox_examples
        }
    }
    
    print(f"Writing to {out_js_path}...")
    with open(out_js_path, 'w') as f:
        f.write("window.AROMA_SAMPLE_DATA = ")
        json.dump(full_data, f, indent=2)
        f.write(";")
    
    print("Done.")

if __name__ == "__main__":
    main()
