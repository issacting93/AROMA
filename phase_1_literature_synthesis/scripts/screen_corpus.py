import pandas as pd
import os
import re

# ==========================================
# 1. SCREENING RULES & HEURISTICS
# ==========================================

# Inclusion must match at least one term from each of these three buckets:
# A: Domain (AI/Chatbot)
# B: Context (Mental Health/Support)
# C: Focus (Role/Stance/Strategy/Paradox)

BUCKET_A = ["chatbot", "conversational agent", "llm", "large language model", "virtual agent", "ai companion", "social robot", "dialogue system"]
BUCKET_B = ["mental health", "wellbeing", "well-being", "psychological", "counseling", "counselling", "therapy", "peer support", "coaching", "care", "intervention"]
BUCKET_C = ["role", "persona", "stance", "behavior", "strategy", "interaction design", "relational", "empathy", "conversation", "navigator", "referral", "linkage", "triage", "authority", "agency", "paradox", "misalignment", "misconception", "alliance"]

# Exclusion: Keywords that typically indicate out-of-scope papers (e.g. medical hardware, non-conversational)
EXCLUSION_TERMS = ["wearable", "passive monitoring", "sensing", "biomarker", "imaging", "pharmacology", "genomics", "surgical", "e-health record", "ehr only"]

def screen_paper(title, abstract, relevance_score):
    text = f"{title} {abstract if abstract else ''}".lower()
    
    # Check Exclusion First
    if any(term in text for term in EXCLUSION_TERMS):
        # Unless it also has very high relevance terms
        if not ("therapeutic alliance" in text or "care role" in text):
            return "EXCLUDE (Heuristic)", "Technological/Medical Noise"

    # Check Buckets
    has_a = any(term in text for term in BUCKET_A)
    has_b = any(term in text for term in BUCKET_B)
    has_c = any(term in text for term in BUCKET_C)

    if has_a and has_b and has_c:
        if relevance_score >= 5:
            return "INCLUDE (Candidate)", "High Overlap"
        else:
            return "MAYBE (Review)", "General Overlap"
    
    if (has_a and has_b) or (has_a and has_c) or (has_b and has_c):
        return "MAYBE (Review)", "Partial Overlap"
        
    return "EXCLUDE (Heuristic)", "Low Contextual Overlap"

# ==========================================
# 2. EXECUTION
# ==========================================

raw_path = "/Users/zac/Documents/Documents-it/AROMA/phase_1_literature_synthesis/scripts/aroma_search_output/aroma_corpus_raw.csv"
output_path = "/Users/zac/Documents/Documents-it/AROMA/phase_1_literature_synthesis/scripts/aroma_search_output/aroma_corpus_screened.csv"

if not os.path.exists(raw_path):
    print(f"Error: {raw_path} not found.")
else:
    df = pd.read_csv(raw_path)
    
    decisions = []
    reasons = []
    
    for _, row in df.iterrows():
        decision, reason = screen_paper(row['title'], row['abstract'], row['relevance_score'])
        decisions.append(decision)
        reasons.append(reason)
        
    df['screen_decision'] = decisions
    df['screen_reason'] = reasons
    
    # Re-sort to put 'INCLUDE' at the top
    priority_map = {"INCLUDE (Candidate)": 0, "MAYBE (Review)": 1, "EXCLUDE (Heuristic)": 2}
    df['prio_val'] = df['screen_decision'].map(priority_map)
    df = df.sort_values(['prio_val', 'relevance_score', 'citation_count'], ascending=[True, False, False])
    df = df.drop(columns=['prio_val'])
    
    df.to_csv(output_path, index=False)
    
    print(f"Screening complete.")
    print(f"Candidates to Include: {len(df[df['screen_decision'] == 'INCLUDE (Candidate)'])}")
    print(f"Review Required (Maybe): {len(df[df['screen_decision'] == 'MAYBE (Review)'])}")
    print(f"Excluded: {len(df[df['screen_decision'] == 'EXCLUDE (Heuristic)'])}")
    print(f"Results saved to {output_path}")
