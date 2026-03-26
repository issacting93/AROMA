import json
import uuid
import os
from supabase import create_client

# -- CONFIGURATION --
SUPABASE_URL = "https://cfrgimxesnftjiompsma.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmdpbXhlc25mdGppb21wc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY5MzUsImV4cCI6MjA5MDAzMjkzNX0.deCQgRda3R6tF1rj6VIhljoO2DYs2d_lmTstKsJizs0"
DATA_PATH = "/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/ESConv.json"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def ingest():
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} conversations from {DATA_PATH}")

    for idx, conv in enumerate(data[:10]):  # Start with 10 for safety
        ext_id = f"ESConv_{idx}"
        
        # 0. Self-healing cleanup: delete existing if present
        supabase.table("conversations").delete().eq("external_id", ext_id).execute()
        
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
        conv_db_id = res_conv.data[0]["id"]
        
        # 2. Segment into Sequences
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
        
        print(f"Ingested {ext_id} with {len(sequences)} sequences.")

if __name__ == "__main__":
    ingest()
