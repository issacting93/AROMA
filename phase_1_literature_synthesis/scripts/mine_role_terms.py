"""
AROMA Phase 1 — Role Term Deep Mining
Mining all 203 paper abstracts for AI care role terminology.
"""
import pandas as pd
import re
from collections import Counter

df = pd.read_csv("aroma_extraction_worksheet.csv", low_memory=False)

# Comprehensive patterns for care role terminology in AI/MH research
ROLE_PATTERNS = [
    # Direct role mentions
    r"\b(ai|llm|chatbot|robot|virtual|digital|conversational agent)[- ]?(based )?(?:as (?:a|an) )?(therapist|counselor|counsellor|psychologist|psychiatrist|clinician)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(coach|coaching)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(companion)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(mentor)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(advisor|adviser)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(navigator)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(peer)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(friend|buddy)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(screener|screening tool)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(assessor)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(mediator)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(listener)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(caregiver|carer)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(facilitator)\b",
    r"\b(ai|chatbot|virtual|digital)[ -]?(intervener|intervention agent)\b",
    # Role-focused terms used in papers
    r"\b(empathic agent|empathetic agent)\b",
    r"\b(crisis (agent|bot|system|chatbot))\b",
    r"\b(peer responder|peer-responder)\b",
    r"\b(social robot)\b",
    r"\b(virtual agent)\b",
    r"\b(therapeutic (agent|chatbot|system|bot))\b",
    r"\b(clinical (agent|chatbot|system|assistant))\b",
    r"\b(health (coach|coaching) (agent|chatbot|bot))\b",
    r"\b(wellness (coach|bot|assistant))\b",
    r"\b(mental health (chatbot|bot|agent|assistant))\b",
    r"\b(conversational (agent|system) acting as|functioning as|acting like) (a|an)? (\w+)\b",
    r"\b(act|serve|function|work)s? as (a|an) (therapist|coach|companion|counselor|navigator|screener|peer|friend|mentor)\b",
]

role_results = Counter()

for _, row in df.iterrows():
    text = str(row.get("abstract", "")).lower()
    text += " " + str(row.get("title", "")).lower()
    
    for pat in ROLE_PATTERNS:
        matches = re.findall(pat, text, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                # Grab the most meaningful group
                term = " ".join(m.strip() for m in match if m and len(m) > 2 and m.lower() not in ["ai", "as", "a", "an", "the"])
                term = re.sub(r'\s+', ' ', term).strip()
            else:
                term = match.strip()
            if term and len(term) > 4:
                role_results[term] += 1

print(f"Found {len(role_results)} unique role terms across corpus.\n")
print("=== Top Role Terms ===")
for term, count in role_results.most_common(50):
    print(f"  {count:3d} | {term}")

# Save
df_roles = pd.DataFrame([{"role_term": t, "frequency": c} for t, c in role_results.most_common(100)])
df_roles.to_csv("aroma_role_terms_mined.csv", index=False)
print(f"\nSaved {len(df_roles)} terms to aroma_role_terms_mined.csv")
