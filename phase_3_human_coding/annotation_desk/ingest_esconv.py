import json
import uuid
import os
from supabase import create_client

# -- CONFIGURATION --
SUPABASE_URL = "https://cfrgimxesnftjiompsma.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmdpbXhlc25mdGppb21wc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY5MzUsImV4cCI6MjA5MDAzMjkzNX0.deCQgRda3R6tF1rj6VIhljoO2DYs2d_lmTstKsJizs0"
DATA_PATH = "/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/data/ESConv.json"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def wipe_db():
    """Nuclear wipe of all annotation-related tables."""
    print("WARNING: Wiping all data from Supabase backend...")
    
    # Order matters due to foreign key constraints
    tables = ["annotations", "conversation_stances", "sequences", "conversations"]
    
    for table in tables:
        try:
            # Delete all rows where id is not null (effective wipe)
            # Using filter allows us to bypass the 'delete all' restriction often found in client libraries
            res = supabase.table(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            print(f"  - Wiped {table}")
        except Exception as e:
            print(f"  - Error wiping {table}: {e}")

def ingest(limit=25):
    """Ingest conversations and segment them."""
    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Data file not found at {DATA_PATH}")
        return

    with open(DATA_PATH, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} conversations from {DATA_PATH}")
    print(f"Ingesting top {limit} conversations...")

    for idx, conv in enumerate(data[:limit]):
        ext_id = f"ESConv_{idx}"
        
        # Normalize ESConv structure to AROMA schema
        dialog = []
        for turn in conv.get("dialog", []):
            dialog.append({
                "speaker": turn.get("speaker"),
                "text": turn.get("content").strip(),
                "turn_idx": len(dialog)
            })

        # 1. Insert Conversation
        conv_payload = {
            "external_id": ext_id,
            "raw_json": {"dialog": dialog}
        }
        res_conv = supabase.table("conversations").insert(conv_payload).execute()
        
        if not res_conv.data:
            print(f"  - Failed to insert {ext_id}")
            continue
            
        conv_db_id = res_conv.data[0]["id"]
        
        # 2. Segment into Sequences
        # Standard AROMA sampling: [2,6] and [7,11]
        sequences = [
            {"start": 2, "end": 6},  # Turn 3 to 7
            {"start": 7, "end": 11}  # Turn 8 to 12
        ]
        
        for seq_def in sequences:
            if len(dialog) > seq_def["end"]:
                turn_range_str = f"[{seq_def['start']},{seq_def['end']}]"
                
                seq_payload = {
                    "conversation_id": conv_db_id,
                    "turn_range": turn_range_str,
                    "is_calibration": True
                }
                supabase.table("sequences").insert(seq_payload).execute()
        
        if (idx + 1) % 5 == 0:
            print(f"  - Processed {idx + 1}/{limit} conversations...")

    print("Ingestion complete.")

if __name__ == "__main__":
    wipe_db()
    ingest(limit=25)
