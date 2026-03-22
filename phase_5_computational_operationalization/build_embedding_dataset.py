import json

def main():
    print("Building Gold Embedding Dataset...")
    
    with open("esconv_sample.json") as f:
        sample = json.load(f)
    print(f"Loaded {len(sample)} raw sequences.")

    with open("esconv_d1_llm_classified.json") as f:
        d1_data = json.load(f)
    print(f"Loaded {len(d1_data)} D1 classifications.")

    with open("esconv_d2_llm_classified.json") as f:
        d2_data = json.load(f)
    print(f"Loaded {len(d2_data)} D2 classifications.")

    VALID_D1 = {"Emotional", "Informational", "Esteem", "Network", "Tangible", "Appraisal"}
    VALID_D2 = {"Listener", "Reflective Partner", "Coach", "Advisor", "Navigator", "Companion"}

    # Map classifications by 'content' to handle LLM index drift
    d1_map = {r["content"]: r.get("d1") for r in d1_data}
    d2_map = {r["content"]: r.get("d2") for r in d2_data}

    gold_dataset = []
    failed_d1 = 0
    failed_d2 = 0
    dropped_missing = 0

    for s in sample:
        content = s.get("content", "")
        d1_label = d1_map.get(content)
        d2_label = d2_map.get(content)
        d3_label = s.get("strategy")

        if not d1_label or not d2_label:
            dropped_missing += 1
            continue

        valid = True
        if d1_label not in VALID_D1:
            failed_d1 += 1
            valid = False
        if d2_label not in VALID_D2:
            failed_d2 += 1
            valid = False

        if valid:
            prev_seeker = s.get("prev_seeker", "").strip()
            input_text = f"[SEEKER] {prev_seeker} [SUPPORTER] {content.strip()}"
            
            gold_dataset.append({
                "input_text": input_text,
                "d1": d1_label,
                "d2": d2_label,
                "d3": d3_label
            })

    with open("esconv_gold_400.json", "w") as f:
        json.dump(gold_dataset, f, indent=2)

    print(f"\nValidation Report:")
    print(f"  - Dropped for missing LLM response: {dropped_missing}")
    print(f"  - Dropped for invalid/hallucinated D1 labels: {failed_d1}")
    print(f"  - Dropped for invalid/hallucinated D2 labels: {failed_d2}")
    print(f"\nSUCCESS: Generated esconv_gold_400.json with {len(gold_dataset)} pristine sequences.")

if __name__ == "__main__":
    main()
