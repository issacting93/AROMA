"""
AROMA D2 Care Role Classification — LLM-as-Judge Pipeline
=============================================================
Run this with your Anthropic API key to classify ESConv sequences
into AROMA's 6 Care Roles based on relational stance across turns.

Usage:
  export ANTHROPIC_API_KEY="sk-ant-..."
  python3 classify_d2_llm.py
"""

import json
import os
import time
import httpx
from collections import Counter

API_KEY = os.environ.get("ANTHROPIC_API_KEY")

BATCH_SIZE = 10
MODEL = "claude-3-haiku-20240307"

D2_CODEBOOK = """You are an expert annotator classifying AI caregiving roles using the AROMA 3-Dimension Taxonomy.
Your task is to classify the relational stance of the supporter across a conversational sequence. 
Instead of looking at a single turn, read the 5-turn sliding window to determine the established Care Role.

Classify the supporter into exactly ONE of these 6 roles:

1. LISTENER — Receptive, following role focused on emotional validation without steering or evaluation. 
   Markers: High count of paraphrasing and minimal encouragers. Follows user lead entirely; no new topics.
   
2. REFLECTIVE PARTNER — Socratic, exploratory role facilitating the user's discovery of internal insights/reframing.
   Markers: Socratic questioning + cognitive reappraisal prompts. ("What I'm hearing is... does that sound right?").
   
3. COACH — Directive, motivating role focused on self-efficacy and action toward user-defined goals.
   Markers: Goal-setting + Change-talk elicitation ("What would managing this mean to you?"). 
   
4. ADVISOR — Authoritative, expertise-led role providing psychoeducation and structured clinical guidance.
   Markers: Psychoeducation delivery + direct advice. (High Authority-Agency paradox risk).
   
5. NAVIGATOR — Practical guide focused on bridge-building to external systems and crisis resources.
   Markers: Resource listing + Triage questions. The "Warm Handoff".
   
6. COMPANION — Persistent, warm presence focused on reducing isolation through relational bonding.
   Markers: Shared References ("Last time you said...") + Reciprocal disclosure. Stance is on the Bond, not a task.

DECISION RULES:
- Read the entire Conversation History (up to 5 turns). The role is the STABLE RELATIONAL STANCE the supporter is holding across the sequence, not just the literal action of the final turn.
- If the supporter is merely validating and listening, it is LISTENER.
- If the supporter introduces guided questions to shift the user's perspective, it is REFLECTIVE PARTNER.
- If the supporter drives toward an action plan or building competence, it is COACH.
- If the supporter acts like a domain expert giving factual psychological/medical guidance, it is ADVISOR.

Respond with ONLY a JSON array of objects, each with "index" (0-based position in the batch) and "d2" (one of: Listener, Reflective Partner, Coach, Advisor, Navigator, Companion). No other text, no markdown fences."""

def classify_batch(batch, batch_num):
    turns_text = ""
    for i, turn in enumerate(batch):
        turns_text += f"\n--- Sequence {i} ---\n"
        turns_text += f"Conversation History (up to 5 turns):\n{turn.get('context_window', '')}\n"
        turns_text += f"Supporter (final turn strategy={turn['strategy']}): \"{turn['content'][:300]}\"\n"

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = httpx.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": MODEL,
                    "max_tokens": 1000,
                    "system": D2_CODEBOOK,
                    "messages": [
                        {"role": "user", "content": f"Classify each supporter sequence below into ONE D2 Care Role.\n{turns_text}"}
                    ],
                },
                timeout=60,
            )
            if response.status_code == 529 or response.status_code == 429:
                print(f"  [API Overloaded/RateLimit - retry {attempt+1}/{max_retries}]", end="", flush=True)
                time.sleep(10 * (attempt + 1))
                continue
            if response.status_code != 200:
                print(f"  API Error ({response.status_code}): {response.text}")
                return None
            data = response.json()
            text = "".join(b["text"] for b in data.get("content", []) if b.get("type") == "text")
            text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            try:
                return json.loads(text)
            except json.JSONDecodeError as je:
                print(f"  JSON Decode Error: {je} - Text was: {text[:100]}...")
                return None
        except httpx.ReadTimeout:
            print(f"  [Timeout - retry {attempt+1}/{max_retries}]", end="", flush=True)
            time.sleep(5)
        except Exception as e:
            print(f"  Error batch {batch_num}: {e}")
            return None
    return None

def main():
    if not API_KEY:
        print("ERROR: Set ANTHROPIC_API_KEY environment variable")
        exit(1)

    with open("esconv_sample.json") as f:
        sample = json.load(f)

    results = []
    total_batches = (len(sample) + BATCH_SIZE - 1) // BATCH_SIZE

    print(f"Classifying {len(sample)} sequences for D2 Care Role...")
    
    for batch_num in range(total_batches):
        start = batch_num * BATCH_SIZE
        end = min(start + BATCH_SIZE, len(sample))
        batch = sample[start:end]

        print(f"  Batch {batch_num+1}/{total_batches}...", end=" ", flush=True)

        classifications = classify_batch(batch, batch_num)

        if classifications:
            for cls in classifications:
                idx = cls["index"]
                batch[idx]["d2"] = cls["d2"]
                results.append(batch[idx])
            print(f"OK")
        else:
            for turn in batch:
                turn["d2"] = "FAILED"
                results.append(turn)
            print("FAILED")

        time.sleep(1)

    with open("esconv_d2_llm_classified.json", "w") as f:
        json.dump(results, f, indent=2)

    d2_counts = Counter(r["d2"] for r in results if r["d2"] != "FAILED")
    failed = sum(1 for r in results if r["d2"] == "FAILED")

    print(f"\nRESULTS: {len(results) - failed} classified, {failed} failed")
    for d2, count in d2_counts.most_common():
        print(f"  {d2}: {count}")

if __name__ == "__main__":
    main()
