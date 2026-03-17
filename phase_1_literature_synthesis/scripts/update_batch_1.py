import pandas as pd

# Load the worksheet
df = pd.read_csv("aroma_extraction_worksheet.csv")

# Data for Batch 1
extractions = {
    "zhang2025dark": {
        "extracted_roles": "AI Companion, Virtual Friend, Seductive Partner",
        "extracted_strategies": "Open-ended socialization, user-led fantasy, reinforcement of user biases",
        "extracted_functions": "Emotional companionship, social surrogacy",
        "modality_features": "Avatar customisation, 24/7 chat",
        "paradox_indicators": "Yes (High)",
        "failure_notes": "Pseudo-intimacy; loss of boundaries; user over-reliance and emotional dependency."
    },
    "new_002": {
        "extracted_roles": "Caregiver, Guide, Therapist-lite, Nurturer",
        "extracted_strategies": "Active listening, psychoeducation, colloquial chat, context-aware reflection",
        "extracted_functions": "Therapeutic alliance (DTA), bond formation, distress tracking",
        "modality_features": "Diary entries, screenshots, conversational UI",
        "paradox_indicators": "Partial",
        "failure_notes": "Role mismatch (e.g., user wants to be led but AI is passive); disconnect between clinical expectation and chat agency."
    },
    "new_000": {
        "extracted_roles": "Artificial Companion, Sim-Physician, Social Ally",
        "extracted_strategies": "Simulating empathy, non-judgmental availability",
        "extracted_functions": "Loneliness mitigation, social health buffering",
        "modality_features": "Text-based chat (Replika, ChatGPT)",
        "paradox_indicators": "Yes",
        "failure_notes": "Lack of genuine reciprocity; 'artificiality' of the care bond vs. human desire for 'real' connection."
    },
    "new_006": {
        "extracted_roles": "Peer-responder, Crisis Counselor (automated)",
        "extracted_strategies": "Motivational Interviewing (MI), Empathetic response generation",
        "extracted_functions": "Triage, crisis intervention, psychiatric response",
        "modality_features": "LLM (GPT-4) in clinical hospital settings",
        "paradox_indicators": "Yes (Safety-critical)",
        "failure_notes": "Reliability Paradox: High text agency but low clinical authority; demographic bias; performance-reliability trade-offs."
    },
    "new_003": {
        "extracted_roles": "Virtual Friend, Sentiment-aware Assistant, Pseudo-Intimate Partner",
        "extracted_strategies": "Algorithmic affection, pseudo-empathy, mood regulation",
        "extracted_functions": "Relational labor replacement, intimacy simulation",
        "modality_features": "Emotional AI (sentic-aware)",
        "paradox_indicators": "Yes (High)",
        "failure_notes": "Pseudo-intimacy Paradox: Trading authentic rupture-repair for algorithmic agreeableness; emotional solipsism."
    }
}

# Apply updates
for item_id, data in extractions.items():
    for col, value in data.items():
        df.loc[df['id'] == item_id, col] = value

# Save updated worksheet
df.to_csv("aroma_extraction_worksheet.csv", index=False)
print("Updated Batch 1 extractions in aroma_extraction_worksheet.csv")
