-- AROMA Annotation Desk Schema v0.3.1 (PERMISSION SYNC)
-- Run this in the Supabase SQL Editor to fix 404/400 errors.

-- 1. CLEAN RESET (DESTRUCTIVE)
DROP TABLE IF EXISTS public.annotations;
DROP TABLE IF EXISTS public.conversation_stances;
DROP TABLE IF EXISTS public.sequences;
DROP TABLE IF EXISTS public.conversations;

-- 2. CORE TABLES
CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    raw_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.sequences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    turn_range int4range NOT NULL,
    is_calibration BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(conversation_id, turn_range)
);

CREATE TABLE public.conversation_stances (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    coder_id uuid REFERENCES auth.users(id),
    user_stance TEXT NOT NULL CHECK (user_stance IN ('Passive', 'Exploratory', 'Active')),
    stance_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(conversation_id, coder_id)
);

CREATE TABLE public.annotations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id uuid REFERENCES public.sequences(id) ON DELETE CASCADE,
    coder_id uuid REFERENCES auth.users(id),

    primary_d2_role TEXT NOT NULL CHECK (primary_d2_role IN (
        'Listener', 'Reflective Partner', 'Coach', 'Advisor',
        'Companion', 'Navigator', 'Ambiguous', 'None'
    )),

    d1_support_type TEXT CHECK (d1_support_type IN (
        'Emotional', 'Informational', 'Esteem', 'Network', 'Tangible', 'Appraisal'
    )),

    d3_strategies TEXT[],
    stance_mismatch TEXT CHECK (
        stance_mismatch IS NULL OR stance_mismatch IN (
            'aligned', 'mild_misfit', 'misfit',
            'misaligned', 'misaligned_paradox_risk'
        )
    ),

    confidence INT NOT NULL CHECK (confidence BETWEEN 1 AND 3),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(sequence_id, coder_id)
);

-- 3. PERMISSIONS (Ensures PostgREST can see the tables)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Ensure future tables have permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- 4. ROW-LEVEL SECURITY
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_stances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read conversations" ON public.conversations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read sequences" ON public.sequences FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coders manage own stances" ON public.conversation_stances FOR ALL TO authenticated
    USING (auth.uid() = coder_id) WITH CHECK (auth.uid() = coder_id);

CREATE POLICY "Coders manage own annotations" ON public.annotations FOR ALL TO authenticated
    USING (auth.uid() = coder_id) WITH CHECK (auth.uid() = coder_id);

-- 5. INDEXES
CREATE INDEX idx_sequences_conversation ON public.sequences(conversation_id);
CREATE INDEX idx_stances_conversation_coder ON public.conversation_stances(conversation_id, coder_id);
CREATE INDEX idx_annotations_sequence_coder ON public.annotations(sequence_id, coder_id);
CREATE INDEX idx_annotations_coder ON public.annotations(coder_id);
