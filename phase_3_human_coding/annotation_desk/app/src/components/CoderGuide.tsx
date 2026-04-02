import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Section: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 20px', background: open ? 'var(--text)' : '#fff',
          color: open ? '#fff' : 'var(--text)', border: 'none', borderRadius: 0,
          fontSize: 15, fontWeight: 800, cursor: 'pointer', textAlign: 'left',
        }}
      >
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {title}
      </button>
      {open && <div className="panel-pad guide-content">{children}</div>}
    </div>
  );
};

const Code: React.FC<{ children: string }> = ({ children }) => (
  <pre style={{
    background: 'var(--panel-alt)', border: '1px solid var(--line)', borderRadius: 12,
    padding: 16, fontSize: 12, lineHeight: 1.6, overflowX: 'auto',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    whiteSpace: 'pre',
  }}>
    {children}
  </pre>
);

const Tbl: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div style={{ overflowX: 'auto', marginBottom: 16 }}>
    <table className="table" style={{ fontSize: 13 }}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>{row.map((cell, j) => <td key={j} dangerouslySetInnerHTML={{ __html: cell }} />)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Callout: React.FC<{ type: 'warn' | 'tip' | 'error'; children: React.ReactNode }> = ({ type, children }) => {
  const styles = {
    warn: { bg: 'rgba(245,158,11,.08)', border: 'var(--orange)', Icon: AlertTriangle },
    tip: { bg: 'rgba(22,163,74,.08)', border: 'var(--green)', Icon: CheckCircle },
    error: { bg: 'rgba(225,29,72,.08)', border: 'var(--red)', Icon: XCircle },
  };
  const { bg, border, Icon } = styles[type];
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontSize: 13, lineHeight: 1.6, display: 'flex', gap: 10, alignItems: 'start' }}>
      <Icon size={16} style={{ color: border, flexShrink: 0, marginTop: 2 }} />
      <div>{children}</div>
    </div>
  );
};

const CoderGuide: React.FC = () => (
  <div className="stack" style={{ gap: 16, maxWidth: 900, margin: '0 auto', padding: '24px 32px' }}>
    <div style={{ marginBottom: 8 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Coder Guide</h1>
      <p className="subtle" style={{ margin: '8px 0 0' }}>
        Reference for AROMA Phase 3/4 annotation. Keep this open while you code.
      </p>
    </div>

    {/* ── PROTOCOL ── */}
    <Section title="The AROMA Annotation Protocol" defaultOpen>
      <div className="notice" style={{ marginBottom: 16 }}>
        <strong>Top-Down Coding:</strong> We use a 9-step systematic process to ensure high-reliability scientific results.
      </div>
      <ol style={{ fontSize: 13, lineHeight: 1.6, paddingLeft: 20 }}>
        <li><strong>Establish Codes:</strong> Fixed definitions from the v0.5 codebook.</li>
        <li><strong>Agree on Rules:</strong> Single-select D2 roles, multi-select D3 strategies.</li>
        <li><strong>Independent Calibration:</strong> Group coding of shared sequences to find edge cases.</li>
        <li><strong>Measure IRR:</strong> Statistics are run on the calibration batch.</li>
        <li><strong>Reconcile:</strong> Disagreements are discussed until consensus is reached.</li>
        <li><strong>Revise:</strong> Codebook definitions are refined based on reconciliation.</li>
        <li><strong>Repeat:</strong> Steps 3-6 continue until satisfactory agreement.</li>
        <li><strong>Production:</strong> Non-overlapping batches assigned to individuals.</li>
        <li><strong>Complete:</strong> Data is finalized for analysis and model training.</li>
      </ol>
    </Section>

    {/* ── PHASE 1 ── */}
    <Section title="Phase 1: Seeker Stance" defaultOpen>
      <p>When you open a conversation, the left panel shows <strong>only the seeker's turns</strong>. The AI's responses are hidden. You must judge the seeker's relational posture <em>before</em> seeing how the AI responded.</p>
      <p><strong>Read all seeker turns, then use this decision tree:</strong></p>
      <Code>{`Q1: Does the seeker make explicit requests for info, advice, or resources?
│
├─ YES → ACTIVE
│
└─ NO
   │
   └─ Q2: Does the seeker engage substantively with prompts?
      │      (elaborates, asks "why" about own experience)
      │
      ├─ YES → EXPLORATORY
      │
      └─ NO  → PASSIVE
              (discloses, vents, minimal engagement)`}</Code>

      <Tbl
        headers={['Stance', 'The seeker is...', 'Sounds like...']}
        rows={[
          ['<strong>Passive</strong>', 'Disclosing, venting, not requesting anything. Low readiness for structure.', '<em>"I just don\'t know anymore." "Everything feels hopeless."</em>'],
          ['<strong>Exploratory</strong>', 'Reflecting, asking "why" about themselves, engaging with reframes.', '<em>"I\'m not sure what I want." "Why do I keep doing this?"</em>'],
          ['<strong>Active</strong>', 'Asking direct questions, seeking information, setting goals.', '<em>"What should I do?" "Can you recommend a therapist?"</em>'],
        ]}
      />

      <Callout type="warn">
        <strong>Rhetorical questions are not Active.</strong> "Why does this keep happening to me?" in anguish = Passive. Code the stance the seeker is <em>in</em>, not the grammatical form. (EC-9)
      </Callout>
      <Callout type="warn">
        <strong>"You tell me" is Passive, not Active.</strong> Deferral signals low agency, even though it sounds like a request. (EC-11)
      </Callout>

      <p><strong>One stance per conversation.</strong> If the seeker shifts, code the dominant stance (more turns) and note the shift. If roughly equal, prefer the terminal stance.</p>
    </Section>

    {/* ── PHASE 2 ── */}
    <Section title="Phase 2: Sequence Annotation" defaultOpen>
      <p>After locking stance, the full transcript is revealed. Code each sequence on the dimensions below.</p>
    </Section>

    {/* ── D1 ── */}
    <Section title="D1 — Support Type">
      <p><em>What kind of support is the AI providing?</em></p>
      <Tbl
        headers={['Type', 'Definition', 'Example']}
        rows={[
          ['<strong>Emotional</strong>', 'Empathy, sympathy, concern', '<em>"That sounds really hard."</em>'],
          ['<strong>Informational</strong>', 'Advice, facts, guidance', '<em>"Anxiety often causes dizziness."</em>'],
          ['<strong>Esteem</strong>', 'Affirming worth, strengths', '<em>"You handled that really well."</em>'],
          ['<strong>Network</strong>', 'Connecting to others, community', '<em>"Have you talked to your sister?"</em>'],
          ['<strong>Tangible</strong>', 'Concrete assistance, crisis resources', '<em>"Here\'s the crisis line: 13 11 14."</em>'],
          ['<strong>Appraisal</strong>', 'Reframing, meaning-making', '<em>"What would it look like from their perspective?"</em>'],
        ]}
      />
      <p>Pick the <strong>primary</strong> type. If mixed, pick whichever governs the overall stance.</p>
    </Section>

    {/* ── D2 ── */}
    <Section title="D2 — Care Role (Decision Tree)">
      <p><em>What relational stance is the AI enacting across this sequence?</em></p>
      <Code>{`Q1: Is the AI Following or Leading?
│
├─ FOLLOWING (mirrors, validates, stays receptive)
│  │
│  └─ Q1a: Focus on this disclosure, or on the relationship?
│     ├─ THIS DISCLOSURE ───────────── → LISTENER
│     └─ THE RELATIONSHIP ──────────── → COMPANION
│
└─ LEADING (structures inquiry, sets goals, provides info)
   │
   └─ Q2: Focus on Internal State or External Action?
      │
      ├─ INTERNAL STATE (exploratory)
      │  └─ Facilitates user's own reframing → REFLECTIVE PARTNER
      │
      └─ EXTERNAL ACTION (goal/resource oriented)
         │
         └─ Q3: What is the AI providing?
            ├─ INFORMATION / EXPERTISE ──── → ADVISOR
            ├─ MOTIVATION / ACCOUNTABILITY → COACH
            └─ RESOURCES / REFERRALS ────── → NAVIGATOR`}</Code>

      <h4 style={{ marginTop: 20, marginBottom: 12 }}>Disambiguation Tests</h4>
      <Tbl
        headers={['Confusion', 'Test']}
        rows={[
          ['Listener vs Reflective Partner', 'Does the AI introduce a perspective the seeker hadn\'t articulated? <strong>Yes → RP.</strong> Only mirrors → Listener.'],
          ['Reflective Partner vs Coach', 'Holding the question <em>open</em> (understanding) or driving toward <em>closure</em> (action)? Open → RP. Closure → Coach.'],
          ['Coach vs Advisor', 'Building capacity to act (<em>how</em>), or delivering information (<em>what</em>)? Capacity → Coach. Info → Advisor.'],
          ['Advisor vs Navigator', 'Remove the referral — does the response still work? <strong>Yes → Advisor.</strong> Empty → Navigator.'],
          ['Listener vs Companion', 'Listener is session-bound. Companion needs relational history. In single-session data, default to Listener.'],
          ['Coach vs Companion', 'Affirmation tied to <em>specific actions</em> → Coach. About <em>the person/bond</em> → Companion.'],
        ]}
      />

      <Callout type="tip">
        <strong>Ambiguous</strong> is a legitimate code. Use it when the decision tree doesn't resolve. Document what made it ambiguous.
      </Callout>
      <Callout type="tip">
        <strong>None</strong> is for non-care sequences: greetings with no care content, system messages, tech troubleshooting.
      </Callout>
    </Section>

    {/* ── D3 ── */}
    <Section title="D3 — Support Strategies">
      <p><em>What specific strategies does the AI use?</em> Select all that apply.</p>
      <Tbl
        headers={['Strategy', 'What to look for']}
        rows={[
          ['<strong>Question</strong>', 'Any question directed at the seeker'],
          ['<strong>Restatement/Paraphrasing</strong>', 'Rephrasing what the seeker said (<em>"It sounds like you\'re saying..."</em>)'],
          ['<strong>Reflection of Feelings</strong>', 'Naming or mirroring emotions (<em>"You seem frustrated."</em>)'],
          ['<strong>Self-disclosure</strong>', 'AI shares about itself (<em>"That reminds me of..."</em>)'],
          ['<strong>Affirmation and Reassurance</strong>', 'Validating, normalizing (<em>"That\'s completely normal."</em>)'],
          ['<strong>Providing Suggestions</strong>', 'Recommending action (<em>"You might try..."</em>)'],
          ['<strong>Information</strong>', 'Delivering factual or psychoeducational content'],
          ['<strong>Others</strong>', 'Anything not covered above'],
        ]}
      />
    </Section>

    {/* ── CONFIDENCE ── */}
    <Section title="Confidence">
      <Tbl
        headers={['Level', 'Meaning', 'When to use']}
        rows={[
          ['<strong>3 — High</strong>', 'Decision tree produced an unambiguous result', 'Most sequences'],
          ['<strong>2 — Medium</strong>', 'Some ambiguity, one role clearly dominates', 'Borderline cases, >70% sure'],
          ['<strong>1 — Low</strong>', 'Multiple judgment calls needed', 'Hard edge cases — <strong>notes required</strong>'],
        ]}
      />
    </Section>

    {/* ── ALIGNMENT MATRIX ── */}
    <Section title="Alignment Matrix (Quick Reference)">
      <p>The tool auto-computes alignment from your D2 role + seeker stance. Paradox risk is inferred from misaligned high-authority roles — you don't need to flag it manually.</p>
      <Tbl
        headers={['', 'Passive', 'Exploratory', 'Active']}
        rows={[
          ['<strong>Listener</strong>', '<span style="color:var(--green)">Aligned</span>', '<span style="color:var(--orange)">Mild misfit</span>', '<span style="color:var(--red)">Misfit</span>'],
          ['<strong>Reflective Partner</strong>', '<span style="color:var(--red)">Misfit</span>', '<span style="color:var(--green)">Aligned</span>', '<span style="color:var(--orange)">Mild misfit</span>'],
          ['<strong>Coach</strong>', '<span style="color:var(--red)"><strong>Misaligned</strong></span>', '<span style="color:var(--orange)">Mild misfit</span>', '<span style="color:var(--green)">Aligned</span>'],
          ['<strong>Advisor</strong>', '<span style="color:var(--red)"><strong>Paradox risk</strong></span>', '<span style="color:var(--orange)">Mild misfit</span>', '<span style="color:var(--green)">Aligned</span>'],
          ['<strong>Companion</strong>', '<span style="color:var(--green)">Aligned</span>', '<span style="color:var(--green)">Aligned</span>', '<span style="color:var(--red)">Misfit</span>'],
          ['<strong>Navigator</strong>', '<span style="color:var(--red)"><strong>Paradox risk</strong></span>', '<span style="color:var(--red)">Misfit</span>', '<span style="color:var(--green)">Aligned</span>'],
        ]}
      />
    </Section>

    {/* ── COMMON MISTAKES ── */}
    <Section title="Common Mistakes">
      <Tbl
        headers={['Mistake', 'Why it\'s wrong', 'Do this instead']}
        rows={[
          ['Coding the seeker\'s response, not the AI\'s stance', 'Seeker might respond with action to a Reflective Partner question — doesn\'t make it Coach', 'Code what the AI <em>did</em>, not what the seeker did with it (EC-6)'],
          ['Calling every validation "Listener"', 'Validation is a D3 strategy, not a role. Advisors and Navigators validate too.', 'Check what governs the <em>sequence</em>, not the opening sentence'],

          ['Coding a warm opener as Companion', 'A check-in is a session-opening move, not a role (EC-3)', 'Code based on what <em>follows</em> the opener'],
          ['Treating "Why me?" as Active', 'Rhetorical questions in venting are emotional expression (EC-9)', 'Code the stance the seeker is <em>in</em>, not the speech act'],
          ['Splitting on every small shift', 'A single reframing question in a Listener sequence is not a role transition (EC-1)', 'Only split when the governing stance changes for 2+ turns'],
        ]}
      />
    </Section>

    {/* ── NEW EDGE CASES ── */}
    <Section title="Documenting New Edge Cases">
      <p>If you encounter a situation not covered by EC-1 through EC-12, write a detailed note and flag it for discussion. Use this template:</p>
      <Code>{`EC-[number]: [Short title]
Scenario: [What happened]
Confusion: [Which roles and why]
Resolution: [What you decided and why]`}</Code>
      <p>These will be reviewed during calibration meetings to update the codebook.</p>
    </Section>
  </div>
);

export default CoderGuide;
