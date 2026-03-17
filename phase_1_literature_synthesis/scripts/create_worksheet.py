import pandas as pd
import json
import os

# 1. Load Screened Candidates (INCLUDE only)
screened_path = "scripts/aroma_search_output/aroma_corpus_screened.csv"
df_screened = pd.read_csv(screened_path)
df_candidates = df_screened[df_screened['screen_decision'] == 'INCLUDE (Candidate)'].copy()

# 2. Load Legacy Corpus
legacy_path = "legacy_corpus.json"
with open(legacy_path, 'r') as f:
    legacy_data = json.load(f)
df_legacy = pd.DataFrame(legacy_data)

# 3. Standardize Columns for Merging
# Keep only core columns for the worksheet
cols_to_keep = ['id', 'title', 'authors', 'year', 'venue', 'abstract', 'relevance_score', 'screen_decision']

# Legacy IDs are already set. For new candidates, generate temporary IDs
df_candidates['id'] = ["new_" + str(i).zfill(3) for i in range(len(df_candidates))]

# Merge
df_final = pd.concat([df_legacy[cols_to_keep], df_candidates[cols_to_keep]], ignore_index=True)

# 4. Add Extraction Columns
extraction_cols = [
    "extracted_roles",        # Role terms used (e.g. Navigator, Coach)
    "extracted_strategies",   # Behavioural strategies (e.g. CBT, Socratic)
    "extracted_functions",    # Core functions (Psych ed, referral)
    "modality_features",      # UI/UX features
    "paradox_indicators",     # Presence of Auth-Agency Paradox (Yes/No/Partial)
    "failure_notes"           # Detailed description of misalignment
]

for col in extraction_cols:
    df_final[col] = ""

# 5. Save
output_path = "aroma_extraction_worksheet.csv"
df_final.to_csv(output_path, index=False)

print(f"Extraction worksheet created: {output_path}")
print(f"Total entries: {len(df_final)} ({len(df_legacy)} legacy + {len(df_candidates)} new)")
