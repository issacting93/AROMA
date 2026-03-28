# AROMA Annotation Desk

Research annotation tool for the AROMA project (Phase 3 human coding). Built with React 19, TypeScript, Vite, and Supabase.

## Features

- **Annotate** — Code conversation sequences across three dimensions (D1 Support Type, D2 Care Role, D3 Strategy) with stance-alignment tracking
- **Batch** — Calibration batch manager with 3-phase workflow, progress tracking, and per-coder status
- **Data** — Tabular annotation explorer with inline editing, coder tabs, sorting, filtering, and IRR (inter-rater reliability) analysis mode
- **Insights** — Turning-point dashboard visualizing annotation distributions
- **Guide** — Embedded coder guide / codebook reference

## Architecture

```
src/
├── App.tsx                  # Main shell: auth, routing, sidebar, navigation
├── supabase.ts              # Supabase client, auth, CRUD, helpers (parseTurns, parseRange)
├── types.ts                 # Shared types, enums (D1/D2/D3), alignment matrix
└── components/
    ├── Login.tsx             # Auth form
    ├── SeekerFirstForm.tsx   # Primary annotation form (seeker-first protocol)
    ├── CalibrationDashboard.tsx  # Batch/sequence browser with phase filters
    ├── AnnotationTable.tsx   # Data explorer with IRR mode and inline edit
    ├── TurningPointDashboard.tsx # Annotation analytics
    ├── CoderGuide.tsx        # Embedded codebook reference
    └── ExportButton.tsx      # Data export utility
```

## Setup

```bash
npm install
```

Create `.env` with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

```bash
npm run dev      # Start dev server with HMR
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Codebook Version

This app tracks **Codebook v0.2.2** (Protocol v0.2.2). The annotation schema maps to:

- **D1** — Support Type (Cutrona & Suhr 1992): Emotional, Informational, Esteem, Network, Tangible, Appraisal
- **D2** — Care Role (Biddle 1986 + Blumer 1969): Listener, Reflective Partner, Coach, Advisor, Navigator, Companion
- **D3** — Support Strategy (Hill 2009 + ESConv): Question, Restatement/Paraphrasing, Reflection of Feelings, Self-disclosure, Affirmation and Reassurance, Providing Suggestions, Information, Others
