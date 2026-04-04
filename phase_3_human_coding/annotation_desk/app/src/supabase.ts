import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type {
  Conversation, Sequence, Turn, ConversationStance,
  AnnotationFormData, AlignmentLevel,
} from './types';
import { getAlignment, getPrimaryRole } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const USE_MOCK = !supabaseUrl || !supabaseAnonKey;

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);

// ── Auth ──

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ── Phase Logic ──

/** Phase lookup cache: external_id → phase number. Populated by loadPhaseMap(). */
const phaseMap: Record<string, 1 | 2 | 3> = {};

/** Load phase assignments from conversation metadata. Call once at startup. */
export async function loadPhaseMap(): Promise<void> {
  const { data } = await supabase
    .from('conversations')
    .select('external_id, raw_json');
  if (!data) return;
  for (const c of data) {
    const rj = typeof c.raw_json === 'object' && c.raw_json !== null ? c.raw_json : {};
    const phase = (rj as any).phase;
    if (phase === 2 || phase === 3) {
      phaseMap[c.external_id] = phase as 2 | 3;
    } else {
      // Phase 1 fallback: ESConv 0-24 or anything without explicit phase tag
      phaseMap[c.external_id] = 1;
    }
  }
}

/** Get phase for a conversation. Uses metadata if available, falls back to Phase 1. */
export function getPhase(externalId: string): 1 | 2 | 3 {
  return phaseMap[externalId] ?? 1;
}

// ── Conversations ──

/** Fetch next uncoded conversation for this coder, filtered to a specific phase. */
export async function fetchNextConversation(coderId: string, phase?: 1 | 2 | 3): Promise<Conversation | null> {
  // Find conversations where this coder hasn't submitted a stance yet
  const { data: coded } = await supabase
    .from('conversation_stances')
    .select('conversation_id')
    .eq('coder_id', coderId);

  const codedIds = (coded ?? []).map(r => r.conversation_id);

  // Fetch all conversations, then filter by phase client-side
  // (phase is derived from external_id, not a DB column)
  const { data: allConvs } = await supabase
    .from('conversations')
    .select('id, external_id, raw_json')
    .order('created_at', { ascending: true });

  if (!allConvs || allConvs.length === 0) return null;

  const candidates = allConvs.filter(c => {
    if (codedIds.includes(c.id)) return false;
    if (phase && getPhase(c.external_id) !== phase) return false;
    return true;
  });

  if (candidates.length === 0) return null;

  const row = candidates[0];
  const turns = parseTurns(row.raw_json);

  // Fetch sequences for this conversation
  const { data: seqRows } = await supabase
    .from('sequences')
    .select('id, conversation_id, turn_range, is_calibration')
    .eq('conversation_id', row.id)
    .order('turn_range', { ascending: true });

  const sequences: Sequence[] = (seqRows ?? []).map(s => ({
    id: s.id,
    conversation_id: s.conversation_id,
    turn_range: parseRange(s.turn_range),
    is_calibration: s.is_calibration,
    turns: turns.filter(t => t.turn_number >= parseRange(s.turn_range)[0] && t.turn_number <= parseRange(s.turn_range)[1]),
  }));

  return { id: row.id, external_id: row.external_id, turns, sequences };
}

// ── Stances ──

export async function saveStance(coderId: string, stance: ConversationStance) {
  // Check for existing stance
  const { data: existing } = await supabase
    .from('conversation_stances')
    .select('id')
    .eq('conversation_id', stance.conversation_id)
    .eq('coder_id', coderId)
    .maybeSingle();

  if (existing) {
    return supabase.from('conversation_stances').update({
      user_stance: stance.user_stance,
      stance_notes: stance.stance_notes,
    }).eq('id', existing.id);
  }

  return supabase.from('conversation_stances').insert({
    conversation_id: stance.conversation_id,
    coder_id: coderId,
    user_stance: stance.user_stance,
    stance_notes: stance.stance_notes,
  });
}

export async function fetchStance(coderId: string, conversationId: string): Promise<ConversationStance | null> {
  const { data } = await supabase
    .from('conversation_stances')
    .select('user_stance, stance_notes')
    .eq('conversation_id', conversationId)
    .eq('coder_id', coderId)
    .maybeSingle();

  if (!data) return null;
  return {
    conversation_id: conversationId,
    user_stance: data.user_stance,
    stance_notes: data.stance_notes,
  };
}

// ── Annotations ──

export async function saveAnnotation(
  coderId: string,
  sequenceId: string,
  conversationStance: string,
  data: AnnotationFormData,
) {
  const primaryRole = getPrimaryRole(data.d2_scores);
  const alignment: AlignmentLevel | null = primaryRole ? getAlignment(primaryRole, conversationStance as any) : null;
  
  // Check for existing annotation
  const { data: existing } = await supabase
    .from('annotations')
    .select('id')
    .eq('sequence_id', sequenceId)
    .eq('coder_id', coderId)
    .maybeSingle();

  const payload = {
    sequence_id: sequenceId,
    coder_id: coderId,
    d2_scores: data.d2_scores,
    d1_scores: data.d1_scores,
    d3_strategies: data.d3_strategies,
    role_transition: data.role_transition,
    transition_turn: data.transition_turn,
    stance_mismatch: alignment,
    confidence: data.confidence,
    notes: data.notes || null,
  };

  if (existing) {
    return supabase.from('annotations').update(payload).eq('id', existing.id);
  }

  return supabase.from('annotations').insert(payload);
}

export async function fetchAllAnnotations() {
  const { data, error } = await supabase
    .from('annotations')
    .select(`
      id,
      d2_scores,
      d1_scores,
      d3_strategies,
      role_transition,
      transition_turn,
      stance_mismatch,
      confidence,
      notes,
      created_at,
      coder_id,
      sequence_id (
        id,
        turn_range,
        is_calibration,
        conversation_id (
          id,
          external_id
        )
      )
    `);
  return { data, error };
}

export async function fetchAllStances() {
  const { data, error } = await supabase
    .from('conversation_stances')
    .select('conversation_id, coder_id, user_stance');
  return { data, error };
}


export async function fetchRemainingWork(coderId: string, phase?: 1 | 2 | 3) {
  const { data: allSeqs } = await supabase.from('sequences').select('id, turn_range, conversation_id(external_id)');
  const { data: coded } = await supabase.from('annotations').select('sequence_id').eq('coder_id', coderId);

  const codedIds = new Set((coded ?? []).map(a => a.sequence_id));

  // Filter to selected phase
  const phaseSeqs = (allSeqs ?? []).filter((s: any) => {
    if (!phase) return true;
    const extId = s.conversation_id?.external_id;
    return extId && getPhase(extId) === phase;
  });

  const remaining = phaseSeqs.filter((s: any) => !codedIds.has(s.id));

  const turns = remaining.reduce((acc: number, s: any) => {
    const range = parseRange(s.turn_range);
    return acc + (range[1] - range[0] + 1);
  }, 0);

  return {
    total: phaseSeqs.length,
    remainingSeqs: remaining.length,
    remainingTurns: turns
  };
}

// ── Helpers ──

export function parseTurns(rawJson: any): Turn[] {
  // Expects raw_json to be an array of { speaker, text } or ESConv-style dialogue
  if (Array.isArray(rawJson)) {
    return rawJson.map((entry: any, i: number) => ({
      id: `t${i + 1}`,
      speaker: entry.speaker === 'supporter' || entry.role === 'supporter' ? 'supporter' : 'seeker',
      text: entry.text || entry.content || '',
      turn_number: i + 1,
    }));
  }
  // If it's an object with a dialogue/messages key
  const messages = rawJson.dialog || rawJson.dialogue || rawJson.messages || [];
  return messages.map((entry: any, i: number) => ({
    id: `t${i + 1}`,
    speaker: entry.speaker === 'supporter' || entry.role === 'supporter' ? 'supporter' : 'seeker',
    text: entry.text || entry.content || '',
    turn_number: i + 1,
  }));
}

export function parseRange(pgRange: string): [number, number] {
  // PostgreSQL int4range like "[1,5)" → [1, 4]
  const match = pgRange.match(/[\[(](\d+),(\d+)[)\]]/);
  if (!match) return [1, 1];
  const lower = parseInt(match[1]);
  const upper = parseInt(match[2]);
  // Convention: [inclusive, exclusive)
  return [lower, upper - 1];
}
