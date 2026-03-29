import json
import csv

JSON_PATH = "/Users/zac/Documents/Documents-it/AROMA/aroma_annotations_2026-03-28.json"
CSV_PATH = "/Users/zac/Documents/Documents-it/AROMA/aroma_annotations_2026-03-28.csv"

with open(JSON_PATH, 'r') as f:
    data = json.load(f)

with open(CSV_PATH, 'w', newline='') as f:
    fieldnames = [
        "external_id", "sequence_id", "turn_range", "coder_id",
        "d1_support_type", "primary_d2_role", "d3_strategies",
        "stance_mismatch", "confidence", "notes"
    ]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()

    for entry in data:
        writer.writerow({
            "external_id": entry["sequence_id"]["conversation_id"]["external_id"],
            "sequence_id": entry["sequence_id"]["id"],
            "turn_range": entry["sequence_id"]["turn_range"],
            "coder_id": entry["coder_id"],
            "d1_support_type": entry["d1_support_type"] or "None",
            "primary_d2_role": entry["primary_d2_role"] or "None",
            "d3_strategies": ";".join(entry["d3_strategies"]),
            "stance_mismatch": entry["stance_mismatch"] or "N/A",
            "confidence": entry["confidence"],
            "notes": entry["notes"]
        })

print(f"Successfully converted JSON to {CSV_PATH}")
