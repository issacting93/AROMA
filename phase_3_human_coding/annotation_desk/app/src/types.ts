import type { User as SupaUser } from '@supabase/supabase-js';

// --- Enums ---

export const D2_ROLES = [
  'Listener', 'Reflective Partner', 'Coach', 'Advisor',
  'Companion', 'Navigator', 'Ambiguous', 'None',
] as const;
export type D2Role = typeof D2_ROLES[number];

export const USER_STANCES = ['Passive', 'Exploratory', 'Active'] as const;
export type UserStance = typeof USER_STANCES[number];

export const D1_SUPPORT_TYPES = [
  'Emotional', 'Informational', 'Esteem', 'Network', 'Tangible', 'Appraisal',
  'Ambiguous', 'None',
] as const;
export type D1SupportType = typeof D1_SUPPORT_TYPES[number];

export const D3_STRATEGIES = [
  'Question',
  'Restatement/Paraphrasing',
  'Reflection of Feelings',
  'Self-disclosure',
  'Affirmation and Reassurance',
  'Providing Suggestions',
  'Information',
  'Others',
] as const;
export type D3Strategy = typeof D3_STRATEGIES[number];

// --- Alignment Matrix (Codebook §4.5) ---

export type AlignmentLevel =
  | 'aligned'
  | 'mild_misfit'
  | 'misfit'
  | 'misaligned'
  | 'misaligned_paradox_risk';

// Only the 6 named care roles have alignment semantics.
// Ambiguous / None are excluded — no mismatch computation.
export const ALIGNMENT_MATRIX: Record<string, Record<UserStance, AlignmentLevel>> = {
  'Listener':           { Passive: 'aligned',                 Exploratory: 'mild_misfit', Active: 'misfit' },
  'Reflective Partner': { Passive: 'misfit',                  Exploratory: 'aligned',     Active: 'mild_misfit' },
  'Coach':              { Passive: 'misaligned',              Exploratory: 'mild_misfit', Active: 'aligned' },
  'Advisor':            { Passive: 'misaligned_paradox_risk', Exploratory: 'mild_misfit', Active: 'aligned' },
  'Companion':          { Passive: 'aligned',                 Exploratory: 'aligned',     Active: 'misfit' },
  'Navigator':          { Passive: 'misaligned_paradox_risk', Exploratory: 'misfit',      Active: 'aligned' },
};

export function getAlignment(role: string, stance: UserStance): AlignmentLevel | null {
  return ALIGNMENT_MATRIX[role]?.[stance] ?? null;
}

export function isMismatch(level: AlignmentLevel | null): boolean {
  if (!level) return false;
  return level !== 'aligned';
}

export function isParadoxRisk(level: AlignmentLevel | null): boolean {
  return level === 'misaligned_paradox_risk';
}

// --- Data Models ---

export interface Turn {
  id: string;
  speaker: 'seeker' | 'supporter';
  text: string;
  turn_number: number;
}

export interface Sequence {
  id: string;
  conversation_id: string;
  turn_range: [number, number];
  turns: Turn[];
  is_calibration: boolean;
}

export interface Conversation {
  id: string;
  external_id: string;
  turns: Turn[];
  sequences: Sequence[];
}

export interface ConversationStance {
  conversation_id: string;
  user_stance: UserStance;
  stance_notes: string;
}

export interface AnnotationFormData {
  primary_d2_role: D2Role | '';
  d1_support_type: D1SupportType | '';
  d3_strategies: D3Strategy[];
  stance_mismatch: AlignmentLevel | null;
  confidence: 1 | 2 | 3;
  notes: string;
}

export type { SupaUser as User };
