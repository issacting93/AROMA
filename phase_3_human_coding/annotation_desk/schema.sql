-- AROMA Annotation Desk Schema v0.3
-- Aligned with Codebook v0.2 (Parts 4 + 6)

-- 1. Core Tables

CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    raw_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sequences (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    turn_range int4range NOT NULL,
    is_calibration BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(conversation_id, turn_range)
);

-- Conversation-level stance (Codebook §4.2: "One label per conversation")
-- Separate table so multiple coders can independently code stance for IRR.
CREATE TABLE IF NOT EXISTS public.conversation_stances (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    coder_id uuid REFERENCES auth.users(id),
    user_stance TEXT NOT NULL CHECK (user_stance IN ('Passive', 'Exploratory', 'Active')),
    stance_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(conversation_id, coder_id)
);

-- Sequence-level annotations (Codebook Part 6 coding sheet)
CREATE TABLE IF NOT EXISTS public.annotations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id uuid REFERENCES public.sequences(id) ON DELETE CASCADE,
    coder_id uuid REFERENCES auth.users(id),

    -- D2: Care Role (Codebook Part 2)
    primary_d2_role TEXT NOT NULL CHECK (primary_d2_role IN (
        'Listener', 'Reflective Partner', 'Coach', 'Advisor',
        'Companion', 'Navigator', 'Ambiguous', 'None'
    )),

    -- D1: Support Type (Cutrona & Suhr 1992 + Appraisal extension)
    d1_support_type TEXT CHECK (d1_support_type IN (
        'Emotional', 'Informational', 'Esteem', 'Network', 'Tangible', 'Appraisal'
    )),

    -- D3: Support Strategy (Hill 2009 + ESConv)
    d3_strategies TEXT[],

    -- Role transition (Codebook §1.3)
    role_transition BOOLEAN DEFAULT false,

    -- Paradox flagging (Codebook §1.4)
    paradox_flag BOOLEAN DEFAULT false,
    paradox_type TEXT CHECK (
        paradox_type IS NULL OR paradox_type IN (
            'Authority-Agency gap', 'Therapeutic misconception',
            'Obligation gap', 'Paradox-potential'
        )
    ),

    -- Stance mismatch — derived from alignment matrix §4.5
    -- Stored as the 4-level codebook gradient, not a boolean.
    stance_mismatch TEXT CHECK (
        stance_mismatch IS NULL OR stance_mismatch IN (
            'aligned', 'mild_misfit', 'misfit',
            'misaligned', 'misaligned_paradox_risk'
        )
    ),

    -- Confidence (Codebook coding rule 4: 1=Low, 2=Medium, 3=High)
    confidence INT NOT NULL CHECK (confidence BETWEEN 1 AND 3),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    UNIQUE(sequence_id, coder_id)
);

-- 2. Row-Level Security

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_stances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

-- Conversations + sequences: all authenticated users can read
CREATE POLICY "Authenticated read conversations"
    ON public.conversations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read sequences"
    ON public.sequences FOR SELECT TO authenticated USING (true);

-- Stances: coders read/write their own
CREATE POLICY "Coders manage own stances"
    ON public.conversation_stances FOR ALL TO authenticated
    USING (auth.uid() = coder_id)
    WITH CHECK (auth.uid() = coder_id);

-- Annotations: coders read/write their own
CREATE POLICY "Coders manage own annotations"
    ON public.annotations FOR ALL TO authenticated
    USING (auth.uid() = coder_id)
    WITH CHECK (auth.uid() = coder_id);

-- 3. Indexes

CREATE INDEX IF NOT EXISTS idx_sequences_conversation
    ON public.sequences(conversation_id);
CREATE INDEX IF NOT EXISTS idx_stances_conversation_coder
    ON public.conversation_stances(conversation_id, coder_id);
CREATE INDEX IF NOT EXISTS idx_annotations_sequence_coder
    ON public.annotations(sequence_id, coder_id);
CREATE INDEX IF NOT EXISTS idx_annotations_coder
    ON public.annotations(coder_id);
