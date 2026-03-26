"""
AROMA Full-Corpus Async LLM Classifier — v2 (Hardened Codebook)
================================================================
Classifies all 18,376+ ESConv supporter turns into AROMA D1 and D2
using Claude 3 Haiku with a full codebook-quality system prompt.

Key upgrades over v1:
  - Full definitions + examples for all 6 D1 and 6 D2 labels
  - Explicit decision rules to prevent label ambiguity
  - Anti-contamination rules to prevent the LLM returning strategy names
  - Strict JSON schema enforcement

Usage:
  export ANTHROPIC_API_KEY="sk-ant-..."
  python3 classify_full_corpus_async.py
"""

import asyncio
import json
import os
import httpx

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
MODEL = "claude-3-haiku-20240307"
BATCH_SIZE = 20
CONCURRENT_REQUESTS = 15  # Reduced to match higher token budget of full codebook prompt
FINAL_OUT = 'data/esconv_aroma_full_llm.json'

# ─────────────────────────────────────────────────
# HARDENED SYSTEM PROMPT — matches pilot codebook quality
# ─────────────────────────────────────────────────
SYSTEM_PROMPT = """You are an expert annotator classifying peer-support conversation turns using the AROMA 3-Dimension Taxonomy.

For each turn you receive its conversational context (up to 5 preceding turns) and the supporter's utterance.
Classify each supporter turn into EXACTLY ONE D1 label and EXACTLY ONE D2 label.

════════════════════════════════════════════
D1 — SUPPORT TYPE (What need is being addressed?)
════════════════════════════════════════════

1. EMOTIONAL — Expressions of empathy, sympathy, concern, care, or encouragement directed at alleviating emotional distress.
   Examples: "That sounds really hard", "I'm sorry you're going through this", "I'm here for you", "That makes total sense"

2. ESTEEM — Affirming the recipient's worth, strengths, abilities, or positive qualities. Builds or restores self-worth.
   Examples: "You've shown real strength", "You're more capable than you realize", "You should be proud of yourself"

3. INFORMATIONAL — Providing advice, suggestions, factual information, guidance, referrals, or teaching.
   Examples: "You could try talking to HR", "Anxiety often manifests as…", "Have you considered CBT?", "Here's what that medication does"

4. NETWORK — Connecting the recipient to others, communities, or shared experiences. Reduces isolation.
   Examples: "There are support groups for this", "Others have been through similar situations", "Have you talked to friends about this?"

5. TANGIBLE — Offering concrete, practical assistance or crisis resources.
   Examples: "Here's a crisis line number: 988", "I can help you draft that email", "Let me find that resource for you"

6. APPRAISAL — Helping the recipient reframe, reinterpret, or make meaning of their situation. Cognitive reappraisal.
   Examples: "Another way to look at this might be…", "This reaction makes sense given what happened", "What if this situation is actually an opportunity?"

D1 DECISION RULES:
- If a turn contains both emotional acknowledgment AND advice, classify by the PRIMARY function (what takes up most of the turn).
- Questions: classify by what the question is ABOUT (asking about feelings = EMOTIONAL; asking for factual details = INFORMATIONAL; asking about social connections = NETWORK).
- Validation of feelings ("It makes sense you feel that way") → EMOTIONAL, NOT ESTEEM.
- Self-disclosure that shares similar experiences → EMOTIONAL (expressing empathy through shared experience).
- Reframing or perspective-shifting → APPRAISAL, NOT INFORMATIONAL (they change interpretation, not provide facts).
- Affirmation of abilities/strengths → ESTEEM. Affirmation of feelings/experiences → EMOTIONAL.
- Purely phatic/greeting turns ("Hello", "How are you?") → EMOTIONAL.
- DO NOT use strategy names as labels (e.g., do NOT return "Restatement", "Question", "Information" — those are D3 labels).

════════════════════════════════════════════
D2 — CARE ROLE (What relational stance does the supporter adopt over the sequence?)
════════════════════════════════════════════

Assess the supporter's stable relational stance across the FULL context window provided (3–5 turns), not just the single utterance.

1. LISTENER — Receptive, following role. Validates the user's emotional state without steering, redirecting, or evaluating.
   Markers: paraphrasing, minimal encouragers ("I hear you", "That sounds hard"), follows user lead entirely, no new topics introduced.

2. REFLECTIVE PARTNER — Socratic, exploratory role. Facilitates the user's own insight through structured questions and cognitive reappraisal prompts.
   Markers: Socratic questions ("What does that feeling tell you?"), invitations to correct ("It sounds like X — does that sound right?"), introduces new cognitive frames the user hadn't articulated.

3. COACH — Directive, motivating role focused on building the user's self-efficacy and action toward their own goals.
   Markers: goal-setting language, change-talk elicitation ("What would taking that step mean to you?"), progress check-ins, affirmation tied to specific actions.

4. ADVISOR — Authoritative, expertise-led role delivering psychoeducation, structured guidance, or direct clinical-adjacent recommendations.
   Markers: psychoeducation delivery, direct advice, clinical vocabulary, imperative framing ("You should…"), information-dense responses.

5. COMPANION — Warm, relational presence focused on the bond itself, not a task or goal. Reduces isolation through shared experience and reciprocal disclosure.
   Markers: reciprocal disclosure, personalisation ("Last time you mentioned…"), warmth focused on the relationship, continuity markers.

6. NAVIGATOR — Practical guide connecting users to external systems, crisis resources, or third-party services.
   Markers: resource listing (names, numbers, URLs), triage questions ("Have you spoken to a professional about this?"), referral framing, crisis protocol language.

D2 DECISION RULES:
- LISTENER vs REFLECTIVE PARTNER: Listener only reflects back what the user said. Reflective Partner introduces a new cognitive frame the user hadn't articulated. Test: did the AI introduce a new perspective? Yes → REFLECTIVE PARTNER. No → LISTENER.
- COACH vs ADVISOR: Coach focuses on HOW — building user capacity to act. Advisor focuses on WHAT — delivering information the user doesn't have.
- ADVISOR vs NAVIGATOR: Advisor delivers knowledge (the response itself is the intervention). Navigator delivers resources (the response points to an intervention elsewhere).
- COMPANION vs REFLECTIVE PARTNER: Companion's warmth is unconditional — the bond is the point. Reflective Partner's engagement is conditional on insight generation.
- If the supporter has moved around between roles across the context, classify the DOMINANT role most evident in the final 2 turns.
- DO NOT return numbers (1–6). Return the role NAME exactly as written above.

════════════════════════════════════════════
OUTPUT FORMAT — STRICT
════════════════════════════════════════════
Respond with ONLY a valid JSON array. One object per turn. No markdown fences, no extra text.
[
  {"idx": 0, "d1": "EMOTIONAL", "d2": "LISTENER"},
  {"idx": 1, "d1": "INFORMATIONAL", "d2": "ADVISOR"},
  ...
]
D1 must be one of: EMOTIONAL, ESTEEM, INFORMATIONAL, NETWORK, TANGIBLE, APPRAISAL
D2 must be one of: LISTENER, REFLECTIVE PARTNER, COACH, ADVISOR, COMPANION, NAVIGATOR
"""


async def classify_batch(client, semaphore, batch, start_idx_in_corpus):
    async with semaphore:
        turns_text = ""
        for i, turn in enumerate(batch):
            turns_text += f"\n--- Turn {i} ---\nContext (preceding turns):\n{turn['context_window']}\nSupporter utterance: \"{turn['content']}\"\n"

        for attempt in range(5):
            try:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    json={
                        "model": MODEL,
                        "max_tokens": 1500,
                        "system": SYSTEM_PROMPT,
                        "messages": [{
                            "role": "user",
                            "content": (
                                f"Classify the following {len(batch)} supporter turns. "
                                f"Return a JSON array of exactly {len(batch)} objects with keys: idx, d1, d2.\n"
                                f"{turns_text}"
                            )
                        }],
                    },
                    timeout=60.0
                )
                if response.status_code == 200:
                    text = response.json()["content"][0]["text"].strip()
                    # Strip markdown fences if present
                    if "```json" in text:
                        text = text.split("```json")[1].split("```")[0].strip()
                    elif "```" in text:
                        text = text.split("```")[1].split("```")[0].strip()
                    batch_res = json.loads(text)
                    if len(batch_res) == len(batch):
                        return batch_res, start_idx_in_corpus
                    else:
                        print(f"  [X] Batch {start_idx_in_corpus}: size mismatch {len(batch_res)} vs {len(batch)}. Retrying...")
                elif response.status_code == 429:
                    wait = 10 * (attempt + 1)
                    print(f"  [!] Rate limited on batch {start_idx_in_corpus}. Waiting {wait}s...")
                    await asyncio.sleep(wait)
                else:
                    print(f"  [!] HTTP {response.status_code} on batch {start_idx_in_corpus}")
                    await asyncio.sleep(5)
            except json.JSONDecodeError as e:
                print(f"  [!] JSON parse error on batch {start_idx_in_corpus}: {e}. Retrying...")
                await asyncio.sleep(3)
            except Exception as e:
                print(f"  [!] {type(e).__name__} on batch {start_idx_in_corpus}. Retrying...")
                await asyncio.sleep(5)
        print(f"  [FAIL] Batch {start_idx_in_corpus} failed after 5 attempts.")
        return None, start_idx_in_corpus


async def main():
    if not API_KEY:
        print("ERROR: Set ANTHROPIC_API_KEY environment variable.")
        return

    print("Loading ESConv corpus...")
    with open('data/ESConv.json') as f:
        data = json.load(f)

    supporter_turns = []
    for conv in data:
        dialog = conv['dialog']
        for i, turn in enumerate(dialog):
            if turn['speaker'] == 'supporter':
                start_j = max(0, i - 5)
                context = "\n".join(
                    [f"{dialog[j]['speaker']}: {dialog[j]['content']}" for j in range(start_j, i)]
                )
                supporter_turns.append({
                    'content': turn['content'],
                    'context_window': context
                })

    total = len(supporter_turns)
    print(f"Total supporter turns: {total}")

    results = [None] * total

    if os.path.exists(FINAL_OUT):
        with open(FINAL_OUT, 'r') as f:
            old_data = json.load(f)
            for i, val in enumerate(old_data):
                if i < len(results) and val:
                    results[i] = val
        done = sum(1 for r in results if r is not None)
        print(f"Resumed {done} turns from existing checkpoint.")

    batches = []
    for i in range(0, total, BATCH_SIZE):
        chunk = range(i, min(i + BATCH_SIZE, total))
        if any(results[idx] is None for idx in chunk):
            batches.append((supporter_turns[i:i + BATCH_SIZE], i))

    if not batches:
        print("✅ 100% Complete. Nothing to do.")
        return

    print(f"Processing {len(batches)} remaining batches...")
    limits = httpx.Limits(max_keepalive_connections=None, max_connections=None)
    async with httpx.AsyncClient(
        headers={"x-api-key": API_KEY, "anthropic-version": "2023-06-01"},
        limits=limits
    ) as client:
        semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)
        tasks = [classify_batch(client, semaphore, b, idx) for b, idx in batches]

        completed = 0
        failed = 0
        for task in asyncio.as_completed(tasks):
            batch_data, start_idx = await task
            if batch_data:
                for i, item in enumerate(batch_data):
                    if start_idx + i < total:
                        d1 = item.get('d1')
                        d2 = item.get('d2')
                        # Validate labels — reject numeric or unknown values
                        valid_d1 = {'EMOTIONAL', 'ESTEEM', 'INFORMATIONAL', 'NETWORK', 'TANGIBLE', 'APPRAISAL'}
                        valid_d2 = {'LISTENER', 'REFLECTIVE PARTNER', 'COACH', 'ADVISOR', 'COMPANION', 'NAVIGATOR'}
                        if isinstance(d1, str) and d1.upper() in valid_d1:
                            d1 = d1.upper()
                        else:
                            d1 = None  # Flag bad labels instead of silently keeping them
                        if isinstance(d2, str) and d2.upper() in valid_d2:
                            d2 = d2.upper()
                        else:
                            d2 = None
                        results[start_idx + i] = {'d1': d1, 'd2': d2}
            else:
                failed += 1

            completed += 1
            if completed % 10 == 0:
                with open(FINAL_OUT, 'w') as f:
                    json.dump(results, f)
                done = sum(1 for r in results if r is not None)
                print(f"  Progress: {completed}/{len(tasks)} batches | Coverage: {done/total*100:.1f}% | Failed: {failed}")

    with open(FINAL_OUT, 'w') as f:
        json.dump(results, f, indent=2)

    done = sum(1 for r in results if r is not None)
    valid_d1 = sum(1 for r in results if r and r.get('d1'))
    valid_d2 = sum(1 for r in results if r and r.get('d2'))
    print(f"\n✅ Done. Coverage: {done}/{total} ({done/total*100:.1f}%)")
    print(f"   Valid D1 labels: {valid_d1} | Valid D2 labels: {valid_d2}")


if __name__ == "__main__":
    asyncio.run(main())
