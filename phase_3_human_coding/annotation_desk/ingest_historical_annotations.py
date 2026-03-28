import json
from supabase import create_client

# -- CONFIGURATION --
SUPABASE_URL = "https://cfrgimxesnftjiompsma.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmdpbXhlc25mdGppb21wc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY5MzUsImV4cCI6MjA5MDAzMjkzNX0.deCQgRda3R6tF1rj6VIhljoO2DYs2d_lmTstKsJizs0"
JSON_PATH = "/Users/zac/Documents/Documents-it/AROMA/aroma_annotations_2026-03-28.json"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest_annotations():
    with open(JSON_PATH, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} annotations for ingestion.")
    
    success_count = 0
    error_count = 0

    for entry in data:
        # Extract fields for public.annotations
        payload = {
            "id": entry["id"],
            "sequence_id": entry["sequence_id"]["id"],
            "coder_id": entry["coder_id"],
            "primary_d2_role": entry["primary_d2_role"],
            "d1_support_type": entry["d1_support_type"],
            "d3_strategies": entry["d3_strategies"],
            "stance_mismatch": entry["stance_mismatch"],
            "confidence": entry["confidence"],
            "notes": entry["notes"],
            "created_at": entry["created_at"]
        }

        try:
            # Use upsert to avoid duplicates if re-run
            res = supabase.table("annotations").upsert(payload, on_conflict="id").execute()
            if res.data:
                success_count += 1
            else:
                print(f"  - Failed to ingest annotation {entry['id']}")
                error_count += 1
        except Exception as e:
            print(f"  - Error ingesting annotation {entry['id']}: {e}")
            error_count += 1

    print(f"\nIngestion Complete:")
    print(f"  - Success: {success_count}")
    print(f"  - Errors: {error_count}")

if __name__ == "__main__":
    ingest_annotations()
