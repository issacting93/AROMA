# AROMA Annotation Desk

Human coding tool for Phase 3 of the AROMA project. Implements the annotation protocol from Codebook v0.2.

## Architecture

```
annotation_desk/
  schema.sql              Supabase schema (v0.3.1) — Clean Reset SQL
  CODER_GUIDE.md          Full theoretical definitions & D2 decision tree
  app/                    Vite + React + TypeScript frontend
    seed_data.js          Node.js seeding utility (Vite environment)
    src/
      types.ts            Alignment matrix, roles (D2), and stances
      supabase.ts         Typed API helpers
      components/
        SeekerFirstForm.tsx   Canonical annotation form (v3.5)
        CalibrationDashboard.tsx  Batch manager w/ IRR status
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

### 2. Ingest Calibration Data

From the `app/` directory:
```bash
node seed_data.js
```
This loads **20 calibration sequences** (5 distinct conversations) into the database for the initial researcher alignment phase.

### 3. Frontend

```bash
cd app
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Resolved Limitations (v0.2.2 Harmonization)

- [x] **IRR Data Mapping**: CalibrationDashboard now correctly joins `conversation_stances` to show "Global Stance" per coder.
- [x] **Sequence Navigation**: Annotated sequences now automatically advance to the next segment in the conversation.
- [x] **Type Safety**: Unified `AlignmentLevel` types across frontend and Postgres schema.
- [x] **Visual Harmony**: UI now uses the Bloom Indigo/Slate design tokens via `aroma_shared.css`.
