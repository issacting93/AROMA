# AROMA Annotation Desk

Human coding tool for Phase 3 of the AROMA project. Implements the annotation protocol from Codebook v0.2.

## Architecture

```
annotation_desk/
  schema.sql              Supabase schema (v0.3) — run this first
  ingest_esconv.py        Loads ESConv conversations into the DB
  SeekerFirstForm.tsx     Original component sketch (unused — canonical version is in app/)
  app/                    Vite + React + TypeScript frontend
    src/
      types.ts            Shared enums, alignment matrix, data models
      supabase.ts         Supabase client + typed API helpers
      App.tsx             Main app shell: auth, navigation, orchestration
      components/
        Login.tsx          Email/password auth gate
        SeekerFirstForm.tsx   Core annotation form (seeker-first reveal + coding sidebar)
        CalibrationDashboard.tsx   Batch manager — browse and select sequences
        TurningPointDashboard.tsx  Insights view — role alignment metrics
```

## Coding Protocol (from Codebook v0.2)

The tool enforces a two-phase annotation flow per conversation:

**Phase 1 — Stance (conversation-level):**
The left panel shows only seeker turns. The coder assigns one of three stances (Passive / Exploratory / Active) plus notes. AI responses are hidden. This prevents the AI's behavior from biasing stance judgment (Coding Rule 6).

**Phase 2 — Sequence annotation (sequence-level):**
After stance is locked, AI turns are revealed. The coder annotates each sequence with:

| Field | Source | Values |
|---|---|---|
| D1 Support Type | Cutrona & Suhr 1992 | Emotional, Informational, Esteem, Network, Tangible, Appraisal |
| D2 Care Role | Codebook Part 2 | Listener, Reflective Partner, Coach, Advisor, Companion, Navigator, Ambiguous, None |
| D3 Strategies | Hill 2009 + ESConv | Question, Restatement/Paraphrasing, Reflection of Feelings, Self-disclosure, Affirmation and Reassurance, Providing Suggestions, Information, Others |
| Role Transition | Codebook §1.3 | Boolean |
| Paradox Flag + Type | Codebook §1.4 | Authority-Agency gap, Therapeutic misconception, Obligation gap, Paradox-potential |
| Confidence | Coding Rule 4 | 1 (Low), 2 (Medium), 3 (High) |
| Stance Mismatch | §4.5 alignment matrix | Auto-computed: aligned, mild_misfit, misfit, misaligned, misaligned_paradox_risk |

## Database

Uses Supabase (Postgres + Auth + RLS). Four tables:

- **conversations** — raw ESConv JSON, one row per dialogue
- **sequences** — turn ranges within a conversation (3-5 turn segments)
- **conversation_stances** — per-coder, per-conversation stance labels (supports IRR)
- **annotations** — per-coder, per-sequence coding with all codebook fields

Run `schema.sql` against your Supabase project to set up tables, RLS policies, and indexes.

## Setup

### 1. Supabase

Create a Supabase project. Run `schema.sql` in the SQL editor. Create coder accounts under Authentication > Users.

### 2. Ingest data

```bash
pip install supabase
# Edit SUPABASE_URL and SUPABASE_KEY in ingest_esconv.py
python ingest_esconv.py
```

This loads the first 10 ESConv conversations with 2 calibration sequences each.

### 3. Frontend

```bash
cd app
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Known Limitations

- **Stance sees only current sequence's turns.** The codebook requires all seeker turns across the entire conversation for stance coding. Currently, only the selected sequence's turns are passed to the stance phase. Needs orchestration fix in App.tsx.
- **No within-conversation sequence navigation.** After annotating one sequence, the tool loads the next conversation instead of advancing to the next sequence in the same conversation.
- **CalibrationDashboard reads `conv.user_stance` from old schema.** The "Global Stance" column will show "Pending" until updated to join against `conversation_stances`.
- **`ingest_esconv.py` uses hardcoded segmentation.** Sequences are fixed at turns 3-7 and 8-12 regardless of conversation structure. Production segmentation should be driven by role transition analysis or a lead coder.
- **`AnnotationFormData.stance_mismatch` is typed as `boolean` but stored as `AlignmentLevel` text.** Works at runtime, type is incorrect.
