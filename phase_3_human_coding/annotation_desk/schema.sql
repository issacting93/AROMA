-- AROMA 'NUCLEAR' SCHEMA RESET (v0.3.3)
-- ======================================
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX 404/400/RLS ERRORS.
-- WARNING: This will delete ALL existing annotation data.

-- 1. CLEAN RESET
DROP TABLE IF EXISTS public.annotations CASCADE;
DROP TABLE IF EXISTS public.conversation_stances CASCADE;
DROP TABLE IF EXISTS public.sequences CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

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
    coder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    user_stance TEXT NOT NULL CHECK (user_stance IN ('Passive', 'Exploratory', 'Active')),
    stance_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_conv_coder UNIQUE(conversation_id, coder_id)
);

CREATE TABLE public.annotations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id uuid REFERENCES public.sequences(id) ON DELETE CASCADE,
    coder_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,

    d2_scores JSONB DEFAULT '{}'::jsonb,
    d1_scores JSONB DEFAULT '{}'::jsonb,

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
    CONSTRAINT unique_seq_coder UNIQUE(sequence_id, coder_id)
);

-- 3. PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- 4. ROW-LEVEL SECURITY
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_stances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

-- 5. RELAXED POLICIES for Researcher Seeding
-- We allow 'anon' and 'authenticated' to INSERT for now during setup.
CREATE POLICY "Allow All Conversations" ON public.conversations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Sequences" ON public.sequences FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Stance CRUD" ON public.conversation_stances FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Annotation CRUD" ON public.annotations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. INDEXES for Performance
CREATE INDEX idx_seq_conv ON public.sequences(conversation_id);
CREATE INDEX idx_ant_seq ON public.annotations(sequence_id);
CREATE INDEX idx_ant_coder ON public.annotations(coder_id);
