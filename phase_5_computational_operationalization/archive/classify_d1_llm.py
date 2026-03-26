"""
AROMA D1 Support Type Classification — LLM-as-Judge Pipeline
=============================================================
Run this with your Anthropic API key to classify ESConv supporter
turns into Cutrona & Suhr (1992) support types.

Usage:
  export ANTHROPIC_API_KEY="sk-ant-..."
  python classify_d1_llm.py

Processes the 400-turn stratified sample first, then optionally
scales to the full 18,376-turn corpus.
"""

import json
import os
import time
import httpx
from collections import Counter, defaultdict

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    print("ERROR: Set ANTHROPIC_API_KEY environment variable")
    print("  export ANTHROPIC_API_KEY='sk-ant-...'")
    exit(1)

BATCH_SIZE = 10
MODEL = "claude-3-haiku-20240307"

D1_CODEBOOK = """You are an expert annotator classifying emotional support conversation turns using the AROMA 3-Dimension Taxonomy (adapted from Cutrona & Suhr, 1992, and Lazarus & Folkman, 1984).

For each supporter turn, classify it into exactly ONE primary support type based on what need the turn addresses:

1. EMOTIONAL — Expressions of sympathy, care, concern, empathy, or encouragement directed at alleviating emotional distress. Includes sympathy, understanding, encouragement, and expressions of care.
   Examples: "That sounds really hard", "I'm sorry you're going through this", "I understand how you feel"

2. ESTEEM — Expressions that affirm the recipient's worth, abilities, strengths, or positive qualities. Focuses on building/restoring self-worth and competence.
   Examples: "You've shown real strength", "You're capable of handling this", "You should be proud of yourself"

3. INFORMATIONAL — Providing advice, suggestions, factual information, guidance, referrals, or teaching. Focuses on knowledge gaps and problem-solving.
   Examples: "You could try talking to HR", "Anxiety often manifests as...", "Here's what that medication does"

4. NETWORK — Connecting the recipient to others, communities, or shared experiences. Focuses on reducing isolation and building social connections.
   Examples: "There are support groups for this", "Others have been through similar situations", "Have you talked to your friends about this?"

5. TANGIBLE — Offering practical, concrete assistance or resources. Focuses on direct help with tasks or material needs.
   Examples: "Here's a crisis line number", "I can help you with that paperwork", "Let me find that resource for you"

6. APPRAISAL — Helping the recipient reframe, reinterpret, or make meaning of their situation. Focuses on cognitive reappraisal and perspective-taking.
   Examples: "Another way to look at this might be...", "This reaction makes sense given what happened", "What if this is actually an opportunity?"

DECISION RULES:
- If a turn contains both emotional acknowledgment AND advice, classify by the PRIMARY function (what takes up most of the turn)
- If a turn is a question, classify by what the question is ABOUT (asking about feelings = EMOTIONAL, asking about situation details = INFORMATIONAL, asking about social connections = NETWORK)
- Validation of feelings (e.g. "It makes sense you feel that way") MUST be classified as EMOTIONAL, not ESTEEM.
- If a turn is purely phatic/greeting ("Hello", "How are you?"), classify as EMOTIONAL (social lubrication serves emotional connection)
- Self-disclosure that shares similar experiences classify as EMOTIONAL (expressing empathy through shared experience)
- Reframing or perspective-shifting classify as APPRAISAL, not INFORMATIONAL (they change interpretation, not provide facts)
- Affirmation of abilities/strengths classify as ESTEEM. Affirmation of feelings/experiences classify as EMOTIONAL.

Respond with ONLY a JSON array of objects, each with "index" (0-based position in the batch) and "d1" (one of: Emotional, Esteem, Informational, Network, Tangible, Appraisal). You must use EXACTLY one of these 6 labels. Do NOT output a strategy name (e.g., Information, Restatement, Question). No other text, no markdown fences."""


def classify_batch(batch, batch_num):
    turns_text = ""
    for i, turn in enumerate(batch):
        turns_text += f"\n--- Turn {i} ---\n"
        turns_text += f"Conversation History (up to 5 turns):\n{turn.get('context_window', turn.get('prev_seeker', ''))}\n"
        turns_text += f"Supporter (strategy={turn['strategy']}): \"{turn['content'][:300]}\"\n"

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
                    "system": D1_CODEBOOK,
                    "messages": [
                        {"role": "user", "content": f"Classify each supporter turn below into ONE D1 support type.\n{turns_text}"}
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
            # Ensure it's valid JSON
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
    with open("esconv_sample.json") as f:
        sample = json.load(f)

    results = []
    total_batches = (len(sample) + BATCH_SIZE - 1) // BATCH_SIZE

    print(f"Classifying {len(sample)} turns in {total_batches} batches...")
    print(f"Model: {MODEL}")
    print()

    for batch_num in range(total_batches):
        start = batch_num * BATCH_SIZE
        end = min(start + BATCH_SIZE, len(sample))
        batch = sample[start:end]

        print(f"  Batch {batch_num+1}/{total_batches} (turns {start}-{end-1})...", end=" ", flush=True)

        classifications = classify_batch(batch, batch_num)

        if classifications:
            for cls in classifications:
                idx = cls["index"]
                batch[idx]["d1"] = cls["d1"]
                results.append(batch[idx])
            print(f"OK")
        else:
            for turn in batch:
                turn["d1"] = "FAILED"
                results.append(turn)
            print("FAILED")

        time.sleep(1)  # rate limiting

    # Save
    with open("esconv_d1_llm_classified.json", "w") as f:
        json.dump(results, f, indent=2)

    # Report
    d1_counts = Counter(r["d1"] for r in results if r["d1"] != "FAILED")
    failed = sum(1 for r in results if r["d1"] == "FAILED")

    print(f"\n{'='*60}")
    print(f"RESULTS: {len(results) - failed} classified, {failed} failed")
    print(f"{'='*60}")
    for d1, count in d1_counts.most_common():
        print(f"  {d1}: {count} ({count/(len(results)-failed)*100:.1f}%)")

    # D1 x D3 matrix
    print(f"\nD1 × D3 Co-occurrence Matrix:")
    cooc = defaultdict(Counter)
    for r in results:
        if r["d1"] != "FAILED":
            cooc[r["d1"]][r["strategy"]] += 1

    strategies = ["Question", "Restatement or Paraphrasing", "Reflection of feelings",
                  "Self-disclosure", "Affirmation and Reassurance", "Providing Suggestions",
                  "Information", "Others"]
    d1_types = ["Emotional", "Esteem", "Informational", "Network", "Tangible", "Appraisal"]

    strat_short = ["Quest.", "Restate.", "Reflect.", "Self-d.", "Affirm.", "Suggest.", "Info.", "Others"]
    header = f"{'':>15}" + "".join(f"{s:>9}" for s in strat_short)
    print(header)
    print("-" * len(header))
    for d1 in d1_types:
        row = f"{d1:>15}"
        for strat in strategies:
            c = cooc[d1][strat]
            row += f"{c:>9}" if c > 0 else f"{'—':>9}"
        print(row)

    print(f"\nSaved to: esconv_d1_llm_classified.json")


if __name__ == "__main__":
    main()
