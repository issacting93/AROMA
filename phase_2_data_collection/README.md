# Phase 2 — Data Collection (weeks 6–10, overlapping with Phase 1)

You need two datasets: a **development set** for building and refining the taxonomy, and a **test set** for evaluating the classification pipeline. Keep them strictly separate from the start.

## 2.1 Primary Dataset: Public Human-AI Conversations

**Source 1: WildChat (you already have experience here)**
- Filter for mental health adjacent conversations
- Search terms / topic classifier: anxiety, depression, stress, loneliness, grief, relationship problems, self-harm adjacent (careful with this), burnout, feeling overwhelmed, seeking support
- Target: 500–1000 conversations for development; 200–300 held out for test
- Key advantage: large scale, naturalistic, no recruitment required
- Key disadvantage: WildChat is general-purpose GPT use — care roles may be enacted inconsistently or not at all

**Source 2: Chatbot Arena / LMSYS**
- Filter for emotionally valenced or support-seeking prompts
- Useful for comparing how different LLMs enact (or fail to enact) care roles

**Source 3: Reddit mental health posts + AI response threads**
- r/ChatGPT, r/mentalhealth, r/therapy — users sharing AI interactions
- Li et al. (2025) used this approach; you have methodological precedent
- Useful for capturing user-initiated role assignment (people prompting GPT into specific roles)

**Source 4 (if you can get it): Wysa or 7 Cups public data**
- More clinically structured; roles may be more consistently enacted
- Likely requires IRB + data agreement — start this conversation early if you want it

**Practical target:**
- Development set: 400 conversations, ~2000–4000 turns
- Test set: 150 conversations, held out completely until pipeline evaluation
- Balance: at least 50 conversations per care role in the development set

## 2.2 Unit of Analysis Decision

You need to decide this now and stick to it throughout. Two options:

**Conversation-level coding:** Each conversation gets one primary care role label. Simpler, faster to code, easier to evaluate — but loses within-conversation role dynamics.

**Turn-level coding:** Each AI response turn gets a care role label. More granular, captures role switching, much richer data — but 5–10× more coding effort.

**Recommendation:** Do both, in sequence. Code at conversation level first to build intuition and inter-rater reliability quickly. Then code a subset (100 conversations, ~500 turns) at turn level to capture dynamics. The turn-level subset becomes your most valuable dataset and Ethan's pipeline training target.

## 2.3 Data Preprocessing

For each conversation in your dataset, extract and structure:
- Conversation ID
- Platform source
- Full turn sequence (user turn / AI turn / user turn...)
- Metadata: conversation length, topic tags, any available system prompt

Strip personally identifying information. If using WildChat, check their data use terms — they permit research use but have restrictions on certain categories.
