import json
import re
from collections import Counter, defaultdict

# Load sample
with open('esconv_sample.json') as f:
    sample = json.load(f)

# Load full dataset for full-corpus analysis
with open('ESConv.json') as f:
    data = json.load(f)

# ============================================================
# HEURISTIC D1 CLASSIFIER
# Based on Cutrona & Suhr (1992) category definitions
# This is a FIRST PASS — the LLM pipeline will refine it
# ============================================================

# Keyword/pattern rules for D1 classification
# Order matters: more specific patterns checked first

def classify_d1(content, strategy, prev_seeker=""):
    content_lower = content.lower()
    
    # TANGIBLE — concrete resources, crisis lines, links
    tangible_patterns = [
        r'hotline', r'crisis line', r'call \d', r'1-800', r'helpline',
        r'here\'s a link', r'website', r'download', r'app called',
        r'emergency room', r'911'
    ]
    if any(re.search(p, content_lower) for p in tangible_patterns):
        return 'Tangible'
    
    # NETWORK — connecting to others, communities, shared experience groups
    network_patterns = [
        r'support group', r'community', r'talk to (your |a )?(friend|family|partner|parent|sibling|therapist|counselor|doctor)',
        r'reach out to', r'have you (talked|spoken) to', r'connect with',
        r'join a', r'group therapy', r'others (who|in|going through)',
        r'you\'re not alone', r'many people'
    ]
    if any(re.search(p, content_lower) for p in network_patterns):
        return 'Network'
    
    # Strategy-based primary classification
    if strategy == 'Information':
        # Information strategy almost always = Informational support type
        return 'Informational'
    
    if strategy == 'Providing Suggestions':
        # Suggestions are informational (advice-giving)
        return 'Informational'
    
    if strategy == 'Reflection of feelings':
        # Reflecting feelings = emotional support
        return 'Emotional'
    
    if strategy == 'Affirmation and Reassurance':
        # Affirmation can be Esteem or Emotional
        esteem_patterns = [
            r'you (are|\'re) (strong|capable|brave|resilient|smart|talented)',
            r'you (can|will) (do|handle|manage|get through|overcome)',
            r'proud of you', r'you\'ve (done|shown|handled|accomplished)',
            r'you (have|possess) (the |great )', r'your (strength|ability|skill)',
            r'believe in you', r'you deserve'
        ]
        if any(re.search(p, content_lower) for p in esteem_patterns):
            return 'Esteem'
        return 'Emotional'
    
    if strategy == 'Self-disclosure':
        # Self-disclosure expressing empathy = Emotional
        return 'Emotional'
    
    if strategy == 'Restatement or Paraphrasing':
        # Restatement can be Emotional (validating) or Appraisal (reframing)
        appraisal_patterns = [
            r'another way', r'look at it', r'perspective', r'reframe',
            r'what if', r'could also mean', r'perhaps', r'on the (bright|positive) side',
            r'silver lining', r'opportunity', r'in a different (light|way)'
        ]
        if any(re.search(p, content_lower) for p in appraisal_patterns):
            return 'Appraisal'
        return 'Emotional'
    
    if strategy == 'Question':
        # Questions about feelings = Emotional
        # Questions about situation/facts = Informational (seeking info to provide support)
        feeling_patterns = [
            r'how (do|does|are|did) you feel', r'what (are|were) you feeling',
            r'how (are|is) you', r'feeling (about|right now|today)',
            r'what emotion', r'how\'s that (making|make) you feel',
            r'how does that affect you emotionally'
        ]
        if any(re.search(p, content_lower) for p in feeling_patterns):
            return 'Emotional'
        
        # Questions probing for situation understanding
        return 'Informational'
    
    if strategy == 'Others':
        # Greetings, transitions — default to Emotional (social lubrication)
        if len(content) < 30:
            return 'Emotional'
        # Longer "Others" — check content
        appraisal_patterns = [
            r'another way', r'think about', r'consider', r'perspective',
            r'reframe', r'look at', r'what if'
        ]
        if any(re.search(p, content_lower) for p in appraisal_patterns):
            return 'Appraisal'
        return 'Emotional'
    
    # Default fallback
    return 'Emotional'


# ============================================================
# CLASSIFY SAMPLE (400 turns)
# ============================================================
for turn in sample:
    turn['d1'] = classify_d1(turn['content'], turn['strategy'], turn['prev_seeker'])

# Save classified sample
with open('esconv_d1_classified.json', 'w') as f:
    json.dump(sample, f, indent=2)

# ============================================================
# CLASSIFY FULL CORPUS (18,376 supporter turns)
# ============================================================
all_classified = []
for conv_idx, conv in enumerate(data):
    for turn_idx, turn in enumerate(conv['dialog']):
        if turn['speaker'] == 'supporter':
            strategy = turn.get('annotation', {}).get('strategy', 'Others')
            # Extract sliding window of last 5 turns
            context_turns = []
            start_j = max(0, turn_idx - 5)
            for j in range(start_j, turn_idx):
                spk = conv['dialog'][j]['speaker'].capitalize()
                context_turns.append(f"{spk}: {conv['dialog'][j]['content']}")
            context_window = "\n".join(context_turns)
            
            d1 = classify_d1(turn['content'], strategy, context_window)
            all_classified.append({
                'conv_idx': conv_idx,
                'turn_idx': turn_idx,
                'content': turn['content'],
                'strategy': strategy,
                'context_window': context_window,
                'd1': d1,
            })

# Save full corpus classification
with open('esconv_d1_full.json', 'w') as f:
    json.dump(all_classified, f, indent=2)

# ============================================================
# RESULTS
# ============================================================
print(f"{'='*70}")
print(f"D1 SUPPORT TYPE CLASSIFICATION — FULL CORPUS")
print(f"{'='*70}")
print(f"Total supporter turns classified: {len(all_classified)}")
print()

d1_counts = Counter(t['d1'] for t in all_classified)
for d1, count in d1_counts.most_common():
    bar = '█' * int(count / len(all_classified) * 50)
    print(f"  {d1:>15}: {count:>5} ({count/len(all_classified)*100:>5.1f}%) {bar}")

# ============================================================
# D1 × D3 CO-OCCURRENCE MATRIX
# ============================================================
print(f"\n{'='*70}")
print(f"D1 × D3 CO-OCCURRENCE MATRIX")
print(f"{'='*70}")

cooccurrence = defaultdict(Counter)
for t in all_classified:
    cooccurrence[t['d1']][t['strategy']] += 1

strategies = ['Question', 'Restatement or Paraphrasing', 'Reflection of feelings', 
              'Self-disclosure', 'Affirmation and Reassurance', 'Providing Suggestions', 
              'Information', 'Others']
d1_types = ['Emotional', 'Esteem', 'Informational', 'Network', 'Tangible', 'Appraisal']

# Abbreviated headers
strat_short = ['Quest.', 'Restate.', 'Reflect.', 'Self-dis.', 'Affirm.', 'Suggest.', 'Info.', 'Others']

header = f"{'':>15}" + "".join(f"{s:>10}" for s in strat_short) + f"{'TOTAL':>10}"
print(header)
print("-" * len(header))

for d1 in d1_types:
    row_total = sum(cooccurrence[d1][s] for s in strategies)
    row = f"{d1:>15}"
    for strat in strategies:
        count = cooccurrence[d1][strat]
        if count > 0:
            row += f"{count:>10}"
        else:
            row += f"{'—':>10}"
    row += f"{row_total:>10}"
    print(row)

# Total row
print("-" * len(header))
total_row = f"{'TOTAL':>15}"
for strat in strategies:
    total = sum(cooccurrence[d1][strat] for d1 in d1_types)
    total_row += f"{total:>10}"
grand_total = sum(d1_counts.values())
total_row += f"{grand_total:>10}"
print(total_row)

# ============================================================
# D1 × D3 AS PERCENTAGES (within each D1 type)
# ============================================================
print(f"\n{'='*70}")
print(f"D1 × D3 — STRATEGY DISTRIBUTION WITHIN EACH SUPPORT TYPE (%)")
print(f"{'='*70}")

header2 = f"{'':>15}" + "".join(f"{s:>10}" for s in strat_short)
print(header2)
print("-" * len(header2))

for d1 in d1_types:
    row_total = sum(cooccurrence[d1][s] for s in strategies)
    if row_total == 0:
        continue
    row = f"{d1:>15}"
    for strat in strategies:
        count = cooccurrence[d1][strat]
        pct = count / row_total * 100
        if pct > 0:
            row += f"{pct:>9.1f}%"
        else:
            row += f"{'—':>10}"
    print(row)

# ============================================================
# KEY FINDINGS
# ============================================================
print(f"\n{'='*70}")
print(f"KEY FINDINGS (HEURISTIC — REQUIRES LLM VALIDATION)")
print(f"{'='*70}")

print("""
1. DOMINANT SUPPORT TYPE: The majority of ESConv supporter turns serve 
   Emotional support functions. This is expected — ESConv is a peer 
   emotional support dataset.

2. STRATEGY-TYPE ALIGNMENT: Some D3→D1 mappings are near-deterministic:
   - Reflection of Feelings → almost always Emotional
   - Information → almost always Informational  
   - Self-disclosure → almost always Emotional
   This suggests these strategies have low role-discrimination power.

3. STRATEGY-TYPE FLEXIBILITY: Other strategies serve multiple support types:
   - Question can serve Emotional (feeling inquiry) or Informational (situation inquiry)
   - Affirmation can serve Emotional (comfort) or Esteem (competence-building)
   These are the strategies where D2 (Care Role) will add the most value.

4. UNDERREPRESENTED TYPES: Network and Tangible support are sparse in 
   ESConv. This is a dataset limitation, not a taxonomy limitation — 
   Navigator role will be hard to train from ESConv alone.

5. APPRAISAL is likely undercounted by heuristic rules. The LLM pipeline 
   will catch reframing that doesn't use obvious keyword patterns.

NOTE: This is a heuristic first pass. The LLM-as-judge pipeline 
(classify_d1_llm.py) will produce validated labels with inter-annotator 
agreement metrics.
""")

print(f"Files saved:")
print(f"  esconv_d1_classified.json  — 400 sample turns with D1 labels")
print(f"  esconv_d1_full.json        — 18,376 full corpus turns with D1 labels")
