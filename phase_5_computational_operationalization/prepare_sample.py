import json
import os
import time
import random
from collections import Counter, defaultdict

# Load ESConv
with open('ESConv.json') as f:
    data = json.load(f)

# Extract all supporter turns with context
supporter_turns = []
for conv_idx, conv in enumerate(data):
    dialog = conv['dialog']
    for turn_idx, turn in enumerate(dialog):
        if turn['speaker'] == 'supporter':
            # Get preceding seeker turn for legacy compatibility
            prev_seeker = ""
            for j in range(turn_idx - 1, -1, -1):
                if dialog[j]['speaker'] == 'seeker':
                    prev_seeker = dialog[j]['content']
                    break
                    
            # Extract sliding window of last 5 turns
            context_turns = []
            start_j = max(0, turn_idx - 5)
            for j in range(start_j, turn_idx):
                spk = dialog[j]['speaker'].capitalize()
                context_turns.append(f"{spk}: {dialog[j]['content']}")
            context_window = "\n".join(context_turns)
            
            supporter_turns.append({
                'conv_idx': conv_idx,
                'turn_idx': turn_idx,
                'content': turn['content'],
                'strategy': turn.get('annotation', {}).get('strategy', 'Unknown'),
                'context_window': context_window,
                'prev_seeker': prev_seeker,
                'emotion_type': conv['emotion_type'],
                'problem_type': conv['problem_type'],
            })

print(f"Total supporter turns extracted: {len(supporter_turns)}")

# Stratified sample: ~50 per strategy to get ~400 total
random.seed(42)
by_strategy = defaultdict(list)
for t in supporter_turns:
    by_strategy[t['strategy']].append(t)

sample = []
for strat, turns in by_strategy.items():
    n = min(50, len(turns))
    sample.extend(random.sample(turns, n))

random.shuffle(sample)
print(f"Sample size: {len(sample)}")
for strat, turns in sorted(by_strategy.items(), key=lambda x: -len(x[1])):
    n_sampled = sum(1 for s in sample if s['strategy'] == strat)
    print(f"  {strat}: {n_sampled} sampled from {len(turns)}")

# Save sample for classification
with open('esconv_sample.json', 'w') as f:
    json.dump(sample, f, indent=2)

print(f"\nSample saved to esconv_sample.json")
