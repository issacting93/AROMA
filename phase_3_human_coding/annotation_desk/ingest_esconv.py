import json
import uuid
import os
from supabase import create_client

SUPABASE_URL = "https://cfrgimxesnftjiompsma.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmdpbXhlc25mdGppb21wc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY5MzUsImV4cCI6MjA5MDAzMjkzNX0.deCQgRda3R6tF1rj6VIhljoO2DYs2d_lmTstKsJizs0"
DATA_PATH = "/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/data/ESConv.json"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def wipe_db():
    print("WARNING: Wiping all data from Supabase backend...")
    tables = ["annotations", "conversation_stances", "sequences", "conversations"]
    for table in tables:
        try:
            res = supabase.table(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            print(f"  - Wiped {table}")
        except Exception as e:
            print(f"  - Error wiping {table}: {e}")

def ingest(offset=0, limit=25):
    if not os.path.exists(DATA_PATH):
        print(f"ERROR: Data file not found at {DATA_PATH}")
        return

    with open(DATA_PATH, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} conversations from {DATA_PATH}")
    print(f"Ingesting conversations from index {offset} to {offset + limit}...")

    for i in range(offset, min(offset + limit, len(data))):
        conv = data[i]
        ext_id = f"ESConv_{i}"
        
        dialog = []
        for turn in conv.get("dialog", []):
            dialog.append({
                "speaker": turn.get("speaker"),
                "text": turn.get("content").strip(),
                "turn_idx": len(dialog)
            })

        conv_payload = {
            "external_id": ext_id,
            "raw_json": {"dialog": dialog}
        }
        res_conv = supabase.table("conversations").insert(conv_payload).execute()
        
        if not res_conv.data:
            print(f"  - Failed to insert {ext_id}")
            continue
            
        conv_db_id = res_conv.data[0]["id"]
        
        sequences = [
            {"start": 0, "end": 11}
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
        
        if (i + 1) % 5 == 0:
            print(f"  - Processed {i + 1}/{offset + limit} conversations...")

    print("Ingestion complete.")

if __name__ == "__main__":
    import sys
    
    if "append" in sys.argv:
        ingest(offset=25, limit=10)
    else:
        wipe_db()
        ingest(offset=0, limit=25)
