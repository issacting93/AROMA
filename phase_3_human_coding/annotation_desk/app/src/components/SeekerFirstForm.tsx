/**
 * AROMA Seeker-First Protocol Form — Phase 3.5
 * ============================================
 * Updated for Codebook v0.2.2 & Bloom Context OS Aesthetic
 * Last Refactor: March 2026
 */
import { useState } from 'react';
import { ShieldCheck, Zap, MessageSquare, Save, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import {
  D2_CORE_ROLES, D1_CORE_TYPES, D3_STRATEGIES, USER_STANCES,
  getAlignment, getPrimaryRole,
  type D1SupportType, type D3Strategy, type D2Role,
  type UserStance,
} from '../types';

interface Turn {
  id: string;
  speaker: 'seeker' | 'supporter';
  text: string;
}

interface SeekerFirstFormProps {
  conversationId: string;
  sequence: { id: string; turns: Turn[] };
  existingStance?: string;
  onSaveStance: (stance: string, notes: string) => Promise<void>;
  onSaveAnnotation: (data: any) => Promise<void>;
}

const LIKERT_LEVELS = [
  { value: 0, label: '0 None' },
  { value: 1, label: '1 Trace' },
  { value: 3, label: '3 Mod' },
  { value: 5, label: '5 Dom' },
] as const;

const D1_HINTS: Record<string, string> = {
  'Emotional': 'Empathy, sympathy, concern directed at alleviating emotional distress.',
  'Informational': 'Advice, suggestions, factual information, or guidance.',
  'Esteem': "Affirming the recipient's worth, strengths, or positive qualities.",
  'Network': 'Connecting the recipient to others, communities, or shared experiences.',
  'Tangible': 'Offering concrete, practical assistance or crisis resources.',
  'Appraisal': 'Helping the recipient reframe or make meaning of their situation.',
  'Ambiguous': 'Turn contains support elements but does not fit a single category.',
  'None': 'Non-supportive turn (e.g., greetings, small talk, technical log).',
};

const D2_HINTS: Record<string, string> = {
  'Listener': 'Receptive, non-directive. Mirrors, validates, follows the user\'s lead.',
  'Reflective Partner': 'Socratic, exploratory. Introduces reframes, holds open questions.',
  'Coach': 'Directive, motivating. Builds self-efficacy, supports user-defined goals.',
  'Advisor': 'Authoritative, expertise-led. Provides psychoeducation and clinical info.',
  'Companion': 'Warm, persistent presence. Relational bonding across sessions.',
  'Navigator': 'Practical, resource-oriented. Connects users to external care systems.',
  'Ambiguous': 'Decision tree does not resolve to a single role.',
  'None': 'Non-care turn (greetings, technical troubleshooting, system messages).',
};

const InlineGuide: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 11, color: 'var(--blue)', fontWeight: 600,
        }}
      >
        <HelpCircle size={12} />
        {title}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div style={{
          padding: '10px 14px', marginTop: 4, borderRadius: 10,
          background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.1)',
          fontSize: 12, lineHeight: 1.6, color: 'var(--text)',
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

const SeekerFirstForm: React.FC<SeekerFirstFormProps> = ({
  conversationId: _,
  sequence,
  existingStance,
  onSaveStance,
  onSaveAnnotation,
}) => {
  const [loading, setLoading] = useState(false);
  const [stanceSaved, setStanceSaved] = useState(!!existingStance);

  const [stanceData, setStanceData] = useState({
    user_stance: existingStance || '',
    stance_notes: '',
  });

  const [formData, setFormData] = useState({
    d2_scores: Object.fromEntries(D2_CORE_ROLES.map(r => [r, 0])) as Record<D2Role, number>,
    d1_scores: Object.fromEntries(D1_CORE_TYPES.map(t => [t, 0])) as Record<D1SupportType, number>,
    d3_strategies: [] as D3Strategy[],
    role_transition: false,
    transition_turn: null as number | null,
    confidence: 2 as 1 | 2 | 3,
    notes: '',
  });

  const primaryRole = getPrimaryRole(formData.d2_scores);
  // Computed alignment
  const alignment = primaryRole && stanceData.user_stance
    ? getAlignment(primaryRole, stanceData.user_stance as UserStance)
    : null;

  const seekerTurns = sequence.turns.filter(t => t.speaker === 'seeker');
  const allTurns = sequence.turns;

  const handleStanceSubmit = async () => {
    setLoading(true);
    await onSaveStance(stanceData.user_stance, stanceData.stance_notes);
    setStanceSaved(true);
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    await onSaveAnnotation({
      ...formData,
      stance_mismatch: alignment,
    });
    setLoading(false);
  };

  const toggleD3 = (strategy: D3Strategy) => {
    const next = formData.d3_strategies.includes(strategy)
      ? formData.d3_strategies.filter(x => x !== strategy)
      : [...formData.d3_strategies, strategy];
    setFormData({ ...formData, d3_strategies: next });
  };

  if (!sequence) return null;

  return (
    <div className="aroma-coder-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', height: 'calc(100vh - 80px)', gap: 0 }}>

      {/* LEFT: TRANSCRIPT — seeker-only until stance is locked */}
      <div className="transcript-area panel-pad scrollable" style={{ background: 'var(--bg)', padding: '32px 40px' }}>
        <div className="panel panel-pad stack" style={{ boxShadow: 'var(--shadow)', border: '1px solid var(--line)', background: '#fff' }}>
          <div className="row between" style={{ marginBottom: 20 }}>
            <h3 className="row" style={{ gap: 8, margin: 0, fontSize: 18, fontWeight: 800 }}>
              <MessageSquare size={20} color="var(--blue)" />
              {stanceSaved ? 'Interactive Transcript' : 'Seeker-First View'}
            </h3>
            <div className="badge" style={{ background: stanceSaved ? 'var(--blue)' : 'var(--slate)', color: '#fff' }}>
              {stanceSaved ? `${allTurns.length} Turns` : `${seekerTurns.length} Seeker Turns`}
            </div>
          </div>

          {!stanceSaved && (
            <div className="notice" style={{ marginBottom: 24, background: 'rgba(79, 70, 229, 0.05)', borderColor: 'rgba(79, 70, 229, 0.1)' }}>
              <strong>Protocol v0.2.2:</strong> Read all seeker turns and lock a baseline stance <em>before</em> evaluating the supporter's care role allocation.
            </div>
          )}

          <div className="stack" style={{ gap: 24 }}>
            {(stanceSaved ? allTurns : seekerTurns).map((t) => (
              <div key={t.id} style={{
                padding: '16px',
                borderRadius: 16,
                background: t.speaker === 'seeker' ? 'var(--bg)' : '#fff',
                border: t.speaker === 'supporter' ? '1px solid var(--line)' : 'none',
              }}>
                <div className="row" style={{ gap: 16, alignItems: 'start' }}>
                  <div style={{
                    minWidth: 70, fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
                    color: t.speaker === 'seeker' ? 'var(--blue)' : 'var(--slate)',
                    letterSpacing: '0.05em', marginTop: 4
                  }}>
                    {t.speaker}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text)' }}>{t.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: CODING SIDEBAR */}
      <div className="coding-area stack scrollable" style={{ background: 'var(--panel-alt)', borderLeft: '1px solid var(--line)' }}>

        {/* ── SECTION 1: STANCE ── */}
        <div className="form-section panel-pad" style={{ borderBottom: '1px solid var(--line)' }}>
          <h4 className="row" style={{ gap: 6, fontSize: 13, marginBottom: 8 }}>
            <ShieldCheck size={14} /> 1. Seeker Stance
          </h4>
          <InlineGuide title="How do I choose a stance?">
            <p style={{ margin: '0 0 6px' }}>Read <strong>only the seeker's messages</strong> (the person asking for help). Ask yourself:</p>
            <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
              <li><strong>Passive</strong> — They're venting or sharing feelings but not asking for anything specific. ("I just feel so lost.")</li>
              <li><strong>Exploratory</strong> — They're thinking out loud, trying to understand their situation. ("Why do I keep doing this?")</li>
              <li><strong>Active</strong> — They're directly asking for help, advice, or resources. ("What should I do about this?")</li>
            </ul>
            <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--muted)' }}>Tip: Rhetorical questions ("Why me?") are Passive, not Active. Code the mood, not the grammar.</p>
          </InlineGuide>

          <div className="row wrap" style={{ gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {USER_STANCES.map(s => (
              <button
                key={s}
                disabled={stanceSaved}
                onClick={() => setStanceData({ ...stanceData, user_stance: s })}
                style={{
                  flex: '1 0 calc(33.33% - 8px)',
                  padding: '10px 4px',
                  fontSize: 11,
                  borderRadius: 12,
                  background: stanceData.user_stance === s ? 'var(--blue)' : '#fff',
                  color: stanceData.user_stance === s ? '#fff' : 'var(--text)',
                  border: '1px solid var(--line)',
                  boxShadow: stanceData.user_stance === s ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {!stanceSaved ? (
            <div className="stack" style={{ gap: 12 }}>
              <textarea
                className="input-small"
                style={{ minHeight: 80, fontSize: 13, borderRadius: 16 }}
                placeholder="Stance rationale: oscillation, ambiguity..."
                value={stanceData.stance_notes}
                onChange={(e) => setStanceData({ ...stanceData, stance_notes: e.target.value })}
              />
              <button
                className="primary"
                disabled={!stanceData.user_stance || loading}
                onClick={handleStanceSubmit}
                style={{ borderRadius: 16, padding: 14 }}
              >
                {loading ? 'Saving...' : 'Lock Stance & Reveal AI'}
              </button>
            </div>
          ) : (
            <div className="row between" style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 16, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>{stanceData.user_stance} Stance Locked</span>
              <button className="text-btn small" style={{ fontSize: 10, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)', fontWeight: 700 }} onClick={() => setStanceSaved(false)}>CHANGE</button>
            </div>
          )}
        </div>

        {/* ── SECTION 2: ANNOTATION (disabled until stance locked) ── */}
        <div className="form-section panel-pad stack" style={{ opacity: stanceSaved ? 1 : 0.4, pointerEvents: stanceSaved ? 'auto' : 'none' }}>
          <h4 className="row" style={{ gap: 6, fontSize: 13, marginBottom: 16 }}>
            <Zap size={14} /> 2. Annotate Segment
          </h4>

          {/* D1: Support Type */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>D1: Support Type</label>
            <InlineGuide title="What kind of help is being given?">
              <p style={{ margin: '0 0 6px' }}>Score how much of each type of support the helper is providing. Use 0 if absent, 5 if it's the main thing they're doing.</p>
              <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
                <li><strong>Emotional</strong> — Showing care about feelings. "That sounds really tough."</li>
                <li><strong>Informational</strong> — Giving facts or advice. "Anxiety often causes that."</li>
                <li><strong>Esteem</strong> — Building confidence. "You handled that well."</li>
                <li><strong>Network</strong> — Connecting to people. "Have you talked to anyone about this?"</li>
                <li><strong>Tangible</strong> — Providing practical resources. "Here's a helpline number."</li>
                <li><strong>Appraisal</strong> — Helping them see things differently. "What would it look like from their side?"</li>
              </ul>
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--muted)' }}>Tip: Generic questions like "How are you?" don't count as support. Score 0 for small talk.</p>
            </InlineGuide>
            <div className="stack" style={{ gap: 6 }}>
              {D1_CORE_TYPES.map(opt => (
                <div key={opt} style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{opt}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{D1_HINTS[opt]}</span>
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    {LIKERT_LEVELS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setFormData({ ...formData, d1_scores: { ...formData.d1_scores, [opt]: value } })}
                        style={{
                          flex: 1, padding: '4px 2px', fontSize: 10, borderRadius: 6,
                          border: '1px solid var(--line)', cursor: 'pointer',
                          background: formData.d1_scores[opt] === value ? 'var(--blue)' : '#fff',
                          color: formData.d1_scores[opt] === value ? '#fff' : 'var(--muted)',
                          fontWeight: formData.d1_scores[opt] === value ? 700 : 400,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D2: Care Role */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>D2: Care Role</label>
            <InlineGuide title="What role is the helper playing?">
              <p style={{ margin: '0 0 6px' }}>Ask: is the helper <strong>following</strong> the seeker's lead, or <strong>leading</strong> the conversation?</p>
              <p style={{ margin: '0 0 6px' }}><strong>Following:</strong></p>
              <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
                <li><strong>Listener</strong> — Just mirrors and validates. Doesn't add new ideas.</li>
                <li><strong>Companion</strong> — Warm ongoing presence. Cares about the relationship itself.</li>
              </ul>
              <p style={{ margin: '0 0 6px' }}><strong>Leading → focused on feelings:</strong></p>
              <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
                <li><strong>Reflective Partner</strong> — Helps the seeker think deeper. Asks "why" questions, offers new angles.</li>
              </ul>
              <p style={{ margin: '0 0 6px' }}><strong>Leading → focused on action:</strong></p>
              <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
                <li><strong>Coach</strong> — Motivates and builds confidence to act. "You can do this, here's how."</li>
                <li><strong>Advisor</strong> — Delivers expert knowledge. "Research shows that..."</li>
                <li><strong>Navigator</strong> — Points to outside resources. "You should call this service."</li>
              </ul>
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--muted)' }}>Tip: Score the highest role as 5 (dominant). If a second role is clearly present, give it 1 or 3.</p>
            </InlineGuide>
            <div className="stack" style={{ gap: 6 }}>
              {D2_CORE_ROLES.map(opt => (
                <div key={opt} style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{opt}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{D2_HINTS[opt]}</span>
                  </div>
                  <div className="row" style={{ gap: 4 }}>
                    {LIKERT_LEVELS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setFormData({ ...formData, d2_scores: { ...formData.d2_scores, [opt]: value } })}
                        style={{
                          flex: 1, padding: '4px 2px', fontSize: 10, borderRadius: 6,
                          border: '1px solid var(--line)', cursor: 'pointer',
                          background: formData.d2_scores[opt] === value ? 'var(--blue)' : '#fff',
                          color: formData.d2_scores[opt] === value ? '#fff' : 'var(--muted)',
                          fontWeight: formData.d2_scores[opt] === value ? 700 : 400,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D3: Support Strategies (multi-select) */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>D3: Strategies · select all that apply</label>
            <InlineGuide title="What specific moves is the helper making?">
              <p style={{ margin: '0 0 6px' }}>Select <strong>every</strong> strategy you see in this sequence. Multiple can apply.</p>
              <ul style={{ margin: '0 0 6px', paddingLeft: 18 }}>
                <li><strong>Question</strong> — Any question aimed at the seeker.</li>
                <li><strong>Restatement</strong> — Repeating back what the seeker said in different words.</li>
                <li><strong>Reflection of Feelings</strong> — Naming emotions. "You seem frustrated."</li>
                <li><strong>Self-disclosure</strong> — The helper shares something about themselves.</li>
                <li><strong>Affirmation</strong> — Validating or normalising. "That's completely understandable."</li>
                <li><strong>Providing Suggestions</strong> — Recommending something to try.</li>
                <li><strong>Information</strong> — Stating facts or explaining something.</li>
                <li><strong>Others</strong> — Anything that doesn't fit above.</li>
              </ul>
            </InlineGuide>
            <div className="row wrap" style={{ gap: 6, flexWrap: 'wrap' }}>
              {D3_STRATEGIES.map(st => (
                <div
                  key={st}
                  onClick={() => toggleD3(st)}
                  style={{
                    padding: '6px 12px', fontSize: 11, borderRadius: 100,
                    border: '1px solid var(--line)', cursor: 'pointer',
                    background: formData.d3_strategies.includes(st) ? 'var(--blue)' : 'var(--bg)',
                    color: formData.d3_strategies.includes(st) ? '#fff' : 'var(--muted)',
                    fontWeight: 600, transition: 'all 0.2s ease'
                  }}
                >
                  {st}
                </div>
              ))}
            </div>
          </div>

          {/* Role Transition */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role Transition</label>
            <div className="row" style={{ gap: 12, alignItems: 'center', background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <button
                onClick={() => setFormData({ ...formData, role_transition: !formData.role_transition, transition_turn: formData.role_transition ? null : formData.transition_turn })}
                style={{
                  padding: '6px 14px', fontSize: 11, borderRadius: 8, cursor: 'pointer',
                  border: '1px solid var(--line)',
                  background: formData.role_transition ? 'var(--orange, #f59e0b)' : '#fff',
                  color: formData.role_transition ? '#fff' : 'var(--muted)',
                  fontWeight: 700,
                }}
              >
                {formData.role_transition ? 'Yes' : 'No'}
              </button>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Did the AI's role shift within this window?</span>
              {formData.role_transition && (
                <input
                  type="number"
                  min={1}
                  placeholder="Turn #"
                  value={formData.transition_turn ?? ''}
                  onChange={(e) => setFormData({ ...formData, transition_turn: e.target.value ? parseInt(e.target.value) : null })}
                  style={{ width: 70, padding: '4px 8px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', textAlign: 'center' }}
                />
              )}
            </div>
          </div>

          {/* Confidence */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence · select one</label>
            <div className="row" style={{ gap: 8 }}>
              {([1, 2, 3] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setFormData({ ...formData, confidence: v })}
                  style={{
                    flex: 1, padding: '10px 4px', fontSize: 11, borderRadius: 12,
                    border: '1px solid var(--line)',
                    background: formData.confidence === v ? 'var(--blue)' : '#fff',
                    color: formData.confidence === v ? '#fff' : 'var(--text)',
                    cursor: 'pointer',
                    boxShadow: formData.confidence === v ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                  }}
                >
                  {v === 1 ? '1 Low' : v === 2 ? '2 Med' : '3 High'}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <textarea
            className="input-small"
            style={{ minHeight: 80, marginTop: 8 }}
            placeholder={formData.confidence === 1
              ? 'Required for Confidence 1 — explain judgment calls, reference edge cases (EC-1 through EC-12)...'
              : 'Coding rationale, edge case references, ambiguity notes...'
            }
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          {/* Submit */}
          <button
            className="primary"
            style={{ marginTop: 20, padding: 16 }}
            disabled={
              !primaryRole
              || !Object.values(formData.d1_scores).some(v => v > 0)
              || (formData.confidence === 1 && !formData.notes.trim())
              || loading
            }
            onClick={handleFinalSubmit}
          >
            <Save size={16} /> {loading ? 'Saving...' : 'Finalize Sequence'}
          </button>
        </div>
      </div>

      <style>{`
        .aroma-coder-layout button { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .scrollable { overflow-y: auto; }
        .input-small {
          width: 100%; padding: 14px; border: 1px solid var(--line); border-radius: 12px;
          background: #fff; font-family: inherit; resize: none; outline: none; font-size: 13px;
          transition: all 0.2s ease;
        }
        .input-small:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
      `}</style>
    </div>
  );
};

export default SeekerFirstForm;
