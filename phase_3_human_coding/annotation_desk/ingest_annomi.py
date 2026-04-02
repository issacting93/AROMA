"""Ingest ANNO-MI transcripts into the AROMA annotation desk (Supabase).

Maps ANNO-MI motivational interviewing transcripts to the same schema used by
ESConv data: conversations → sequences (12-turn windows) → ready for annotation.

Speaker mapping:
  - ANNO-MI "therapist" → AROMA "supporter"
  - ANNO-MI "client"    → AROMA "seeker"

Usage:
  python ingest_annomi.py              # ingest all 133 transcripts
  python ingest_annomi.py --limit 20   # ingest first 20 transcripts
  python ingest_annomi.py --dry-run    # preview without writing to Supabase
"""

import csv
import sys
from collections import defaultdict
from supabase import create_client

SUPABASE_URL = "https://cfrgimxesnftjiompsma.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmcmdpbXhlc25mdGppb21wc21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTY5MzUsImV4cCI6MjA5MDAzMjkzNX0.deCQgRda3R6tF1rj6VIhljoO2DYs2d_lmTstKsJizs0"
DATA_PATH = "/Users/zac/Documents/Documents-it/AROMA/phase_5_computational_operationalization/data/external/AnnoMI-simple.csv"

SEQUENCE_WINDOW = 12  # turns per sequence, matching v0.3 codebook

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

SPEAKER_MAP = {
    "therapist": "supporter",
    "client": "seeker",
}


def load_transcripts():
    """Load and group ANNO-MI utterances by transcript_id."""
    transcripts = defaultdict(list)
    with open(DATA_PATH, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:
            transcripts[row["transcript_id"]].append(row)

    # Sort each transcript by utterance_id
    for tid in transcripts:
        transcripts[tid].sort(key=lambda r: int(r["utterance_id"]))

    return dict(transcripts)


def build_dialog(utterances):
    """Convert ANNO-MI utterances to AROMA dialog format."""
    dialog = []
    for utt in utterances:
        dialog.append({
            "speaker": SPEAKER_MAP.get(utt["interlocutor"], utt["interlocutor"]),
            "text": utt["utterance_text"].strip(),
            "turn_idx": len(dialog),
            # Preserve ANNO-MI metadata for reference
            "annomi_behaviour": utt.get("main_therapist_behaviour", ""),
            "annomi_client_talk": utt.get("client_talk_type", ""),
        })
    return dialog


def build_sequences(dialog_length):
    """Generate non-overlapping 12-turn sequence windows."""
    sequences = []
    for start in range(0, dialog_length, SEQUENCE_WINDOW):
        end = min(start + SEQUENCE_WINDOW, dialog_length)
        if end - start >= 4:  # skip very short trailing fragments
            sequences.append({"start": start, "end": end})
    return sequences


def ingest(limit=None, dry_run=False):
    transcripts = load_transcripts()
    sorted_ids = sorted(transcripts.keys(), key=lambda x: int(x))

    if limit:
        sorted_ids = sorted_ids[:limit]

    print(f"Loaded {len(transcripts)} transcripts from {DATA_PATH}")
    print(f"Ingesting {len(sorted_ids)} transcripts...")
    if dry_run:
        print("(DRY RUN — no data will be written)")

    total_seqs = 0

    for i, tid in enumerate(sorted_ids):
        utterances = transcripts[tid]
        ext_id = f"AnnoMI_{tid}"
        topic = utterances[0].get("topic", "unknown")
        mi_quality = utterances[0].get("mi_quality", "unknown")

        dialog = build_dialog(utterances)
        sequences = build_sequences(len(dialog))
        total_seqs += len(sequences)

        if dry_run:
            print(f"  {ext_id}: {len(dialog)} turns → {len(sequences)} seqs "
                  f"[{mi_quality}] ({topic})")
            continue

        conv_payload = {
            "external_id": ext_id,
            "raw_json": {
                "dialog": dialog,
                "source": "AnnoMI",
                "mi_quality": mi_quality,
                "topic": topic,
            },
        }
        res_conv = supabase.table("conversations").insert(conv_payload).execute()

        if not res_conv.data:
            print(f"  - Failed to insert {ext_id}")
            continue

        conv_db_id = res_conv.data[0]["id"]

        for seq_def in sequences:
            # int4range uses [inclusive, exclusive) convention
            turn_range_str = f"[{seq_def['start']},{seq_def['end']})"
            seq_payload = {
                "conversation_id": conv_db_id,
                "turn_range": turn_range_str,
                "is_calibration": True,
            }
            supabase.table("sequences").insert(seq_payload).execute()

        if (i + 1) % 10 == 0:
            print(f"  - Processed {i + 1}/{len(sorted_ids)} transcripts...")

    print(f"\nIngestion complete: {len(sorted_ids)} conversations, {total_seqs} sequences.")


if __name__ == "__main__":
    limit = None
    dry_run = "--dry-run" in sys.argv

    if "--limit" in sys.argv:
        idx = sys.argv.index("--limit")
        limit = int(sys.argv[idx + 1])

    ingest(limit=limit, dry_run=dry_run)
