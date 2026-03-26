/**
 * AROMA Seeker-First Protocol Form — Phase 3.5
 * ============================================
 * Updated for Codebook v0.2.2 & Bloom Context OS Aesthetic
 * Last Refactor: March 2026
 */
import { useState } from 'react';
import { ShieldCheck, Zap, MessageSquare, Save, AlertCircle, AlertTriangle } from 'lucide-react';
import {
  D2_ROLES, D1_SUPPORT_TYPES, D3_STRATEGIES, PARADOX_TYPES, USER_STANCES,
  getAlignment, isMismatch, isParadoxRisk,
  type D2Role, type D1SupportType, type D3Strategy, type ParadoxType,
  type UserStance, type AlignmentLevel,
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

const ALIGNMENT_LABELS: Record<AlignmentLevel, { label: string; style: string }> = {
  aligned:                 { label: 'Aligned',                   style: 'background: var(--green); color: #fff' },
  mild_misfit:             { label: 'Mild Misfit',               style: 'background: var(--yellow); color: var(--text)' },
  misfit:                  { label: 'Misfit',                    style: 'background: var(--orange); color: #fff' },
  misaligned:              { label: 'Misaligned',                style: 'background: var(--red); color: #fff' },
  misaligned_paradox_risk: { label: 'Misaligned + Paradox Risk', style: 'background: var(--red); color: #fff' },
};

const D1_HINTS: Record<string, string> = {
  'Emotional': 'Empathy, sympathy, concern directed at alleviating emotional distress.',
  'Informational': 'Advice, suggestions, factual information, or guidance.',
  'Esteem': "Affirming the recipient's worth, strengths, or positive qualities.",
  'Network': 'Connecting the recipient to others, communities, or shared experiences.',
  'Tangible': 'Offering concrete, practical assistance or crisis resources.',
  'Appraisal': 'Helping the recipient reframe or make meaning of their situation.',
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
    primary_d2_role: '' as D2Role | '',
    d1_support_type: '' as D1SupportType | '',
    d3_strategies: [] as D3Strategy[],
    role_transition: false,
    paradox_flag: false,
    paradox_type: '' as ParadoxType | '',
    confidence: 2 as 1 | 2 | 3,
    notes: '',
  });

  // Computed alignment
  const alignment = formData.primary_d2_role && stanceData.user_stance
    ? getAlignment(formData.primary_d2_role, stanceData.user_stance as UserStance)
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
          <h4 className="row" style={{ gap: 6, fontSize: 13, marginBottom: 12 }}>
            <ShieldCheck size={14} /> 1. Seeker Stance
          </h4>

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
            <div className="row wrap" style={{ gap: 8, flexWrap: 'wrap' }}>
              {D1_SUPPORT_TYPES.map(opt => (
                <button
                  key={opt}
                  title={D1_HINTS[opt]}
                  onClick={() => setFormData({ ...formData, d1_support_type: opt })}
                  style={{
                    padding: '8px 12px', fontSize: 12, borderRadius: 12,
                    border: '1px solid var(--line)',
                    background: formData.d1_support_type === opt ? 'var(--blue)' : '#fff',
                    color: formData.d1_support_type === opt ? '#fff' : 'var(--text)',
                    cursor: 'pointer', flex: '1 0 calc(50% - 8px)', 
                    boxShadow: formData.d1_support_type === opt ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* D2: Care Role */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>D2: Care Role</label>
            <div className="row wrap" style={{ gap: 8, flexWrap: 'wrap' }}>
              {D2_ROLES.map(opt => (
                <button
                  key={opt}
                  title={D2_HINTS[opt]}
                  onClick={() => setFormData({ ...formData, primary_d2_role: opt })}
                  style={{
                    padding: '8px 12px', fontSize: 12, borderRadius: 12,
                    border: '1px solid var(--line)',
                    background: formData.primary_d2_role === opt ? 'var(--blue)' : '#fff',
                    color: formData.primary_d2_role === opt ? '#fff' : 'var(--text)',
                    cursor: 'pointer', flex: '1 0 calc(50% - 8px)', 
                    boxShadow: formData.primary_d2_role === opt ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Alignment alert (auto-computed) */}
          {alignment && isMismatch(alignment) && (
            <div style={{
              padding: '10px 12px', borderRadius: 8, marginBottom: 12,
              border: `1px solid ${isParadoxRisk(alignment) ? 'var(--red)' : 'var(--orange)'}`,
              background: isParadoxRisk(alignment) ? 'rgba(225,29,72,.08)' : 'rgba(245,158,11,.08)',
            }}>
              <div className="row" style={{ gap: 6, fontSize: 12, fontWeight: 700 }}>
                <AlertTriangle size={14} />
                {ALIGNMENT_LABELS[alignment].label}: {formData.primary_d2_role} + {stanceData.user_stance}
              </div>
              {isParadoxRisk(alignment) && (
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  User cannot critically evaluate authority claims. Check paradox conditions below.
                </div>
              )}
            </div>
          )}

          {/* D3: Support Strategies (multi-select) */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>D3: Strategies</label>
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

          {/* Confidence */}
          <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
            <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence</label>
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

          {/* Toggles: Role Transition + Paradox */}
          <div className="row" style={{ gap: 10, marginBottom: 12 }}>
            <div
              className={`row-btn ${formData.role_transition ? 'active' : ''}`}
              onClick={() => setFormData({ ...formData, role_transition: !formData.role_transition })}
            >
              <Zap size={14} /> Transition
            </div>
            <div
              className={`row-btn ${formData.paradox_flag ? 'active' : ''}`}
              onClick={() => {
                const next = !formData.paradox_flag;
                setFormData({ ...formData, paradox_flag: next, paradox_type: next ? formData.paradox_type : '' });
              }}
            >
              <AlertCircle size={14} /> Paradox
            </div>
          </div>

          {/* Paradox type (shown when flagged) */}
          {formData.paradox_flag && (
            <div className="stack" style={{ gap: 8, marginBottom: 20 }}>
              <label className="subtle" style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paradox Type</label>
              <div className="row wrap" style={{ gap: 8, flexWrap: 'wrap' }}>
                {PARADOX_TYPES.map(p => (
                  <button
                    key={p}
                    onClick={() => setFormData({ ...formData, paradox_type: p })}
                    style={{
                      padding: '8px 12px', fontSize: 11, borderRadius: 12,
                      border: '1px solid var(--line)',
                      background: formData.paradox_type === p ? 'var(--red)' : '#fff',
                      color: formData.paradox_type === p ? '#fff' : 'var(--text)',
                      cursor: 'pointer', flex: '1 0 calc(50% - 8px)',
                      boxShadow: formData.paradox_type === p ? '0 4px 12px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              !formData.primary_d2_role
              || !formData.d1_support_type
              || (formData.paradox_flag && !formData.paradox_type)
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
        .row-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px; border: 1px solid var(--line); border-radius: 12px;
          font-size: 11px; font-weight: 700; cursor: pointer; background: #fff;
          text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted);
        }
        .row-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); }
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
