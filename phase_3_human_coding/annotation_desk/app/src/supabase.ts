import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type {
  Conversation, Sequence, Turn, ConversationStance,
  AnnotationFormData, AlignmentLevel,
} from './types';
import { getAlignment } from './types';

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

// ── Conversations ──

/** Fetch next uncoded conversation for this coder. */
export async function fetchNextConversation(coderId: string): Promise<Conversation | null> {
  // Find conversations where this coder hasn't submitted a stance yet
  const { data: coded } = await supabase
    .from('conversation_stances')
    .select('conversation_id')
    .eq('coder_id', coderId);

  const codedIds = (coded ?? []).map(r => r.conversation_id);

  let query = supabase
    .from('conversations')
    .select('id, external_id, raw_json')
    .order('created_at', { ascending: true })
    .limit(1);

  if (codedIds.length > 0) {
    query = query.not('id', 'in', `(${codedIds.join(',')})`);
  }

  const { data } = await query;
  if (!data || data.length === 0) return null;

  const row = data[0];
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
  return supabase.from('conversation_stances').upsert({
    conversation_id: stance.conversation_id,
    coder_id: coderId,
    user_stance: stance.user_stance,
    stance_notes: stance.stance_notes,
  }, { onConflict: 'conversation_id,coder_id' });
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
  const alignment: AlignmentLevel | null = getAlignment(data.primary_d2_role, conversationStance as any);
  return supabase.from('annotations').upsert({
    sequence_id: sequenceId,
    coder_id: coderId,
    primary_d2_role: data.primary_d2_role,
    d1_support_type: data.d1_support_type || null,
    d3_strategies: data.d3_strategies,
    role_transition: data.role_transition,
    paradox_flag: data.paradox_flag,
    paradox_type: data.paradox_flag ? data.paradox_type || null : null,
    stance_mismatch: alignment,
    confidence: data.confidence,
    notes: data.notes || null,
  }, { onConflict: 'sequence_id,coder_id' });
}

// ── Helpers ──

function parseTurns(rawJson: any): Turn[] {
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

function parseRange(pgRange: string): [number, number] {
  // PostgreSQL int4range like "[1,5)" → [1, 4]
  const match = pgRange.match(/[\[(](\d+),(\d+)[)\]]/);
  if (!match) return [1, 1];
  const lower = parseInt(match[1]);
  const upper = parseInt(match[2]);
  // Convention: [inclusive, exclusive)
  return [lower, upper - 1];
}
