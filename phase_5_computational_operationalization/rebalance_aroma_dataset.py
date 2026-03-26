import json
import random
from collections import Counter

def main():
    print("Mining full corpus for balanced AROMA dataset...")
    
    # 1. Load full raw corpus
    with open("ESConv.json") as f:
        raw_data = json.load(f)
    
    # 2. Load pre-classified labels
    with open("esconv_aroma_full_llm.json") as f:
        full_labels = json.load(f)
        
    print(f"Loaded {len(raw_data)} conversations and {len(full_labels)} turn labels.")

    # 3. Extract all supporter turns with context
    all_turns = []
    label_ptr = 0
    for conv_idx, conv in enumerate(raw_data):
        dialog = conv["dialog"]
        for turn_idx, turn in enumerate(dialog):
            if turn["speaker"] == "supporter":
                if label_ptr >= len(full_labels):
                    break
                    
                labels = full_labels[label_ptr]
                label_ptr += 1
                
                # Basic validation
                if not labels or "d1" not in labels:
                    continue
                
                # Get context (previous seeker turn)
                prev_seeker = ""
                for j in range(turn_idx - 1, -1, -1):
                    if dialog[j]["speaker"] == "seeker":
                        prev_seeker = dialog[j]["content"]
                        break
                
                all_turns.append({
                    "input_text": f"[SEEKER] {prev_seeker.strip()} [SUPPORTER] {turn['content'].strip()}",
                    "d1": labels["d1"].title(), # Normalize to Title Case
                    "d2": labels["d2"].title() if labels.get("d2") else "None",
                    "d3": turn.get("annotation", {}).get("strategy", "Others")
                })

    print(f"Extracted {len(all_turns)} labeled turns.")

    # 4. Balanced Sampling
    # Target: Min(Available, 500) per class
    target_per_class = 500
    
    class_groups = {}
    for t in all_turns:
        d1 = t["d1"]
        if d1 not in class_groups:
            class_groups[d1] = []
        class_groups[d1].append(t)

    balanced_set = []
    print("\nSampling Report:")
    for d1, turns in class_groups.items():
        sample_size = min(len(turns), target_per_class)
        sampled = random.sample(turns, sample_size)
        balanced_set.extend(sampled)
        print(f"  - {d1:<15}: {len(turns):>5} available -> {sample_size:>4} sampled")

    # 5. Save
    # Shuffle the final set
    random.shuffle(balanced_set)
    
    with open("esconv_gold_balanced.json", "w") as f:
        json.dump(balanced_set, f, indent=2)
        
    print(f"\nSUCCESS: Created esconv_gold_balanced.json with {len(balanced_set)} turns.")
    print("New distribution:", Counter([t["d1"] for t in balanced_set]))

if __name__ == "__main__":
    main()
