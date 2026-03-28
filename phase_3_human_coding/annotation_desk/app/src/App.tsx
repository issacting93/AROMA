/**
 * AROMA Researcher Suite — Phase 3.5 Harmonized
 * ============================================
 * Updated for Codebook v0.2.2 & Bloom Context OS Aesthetic
 * Last Refactor: March 2026
 */
import { useState, useEffect } from 'react';
import SeekerFirstForm from './components/SeekerFirstForm';
import TurningPointDashboard from './components/TurningPointDashboard';
import CalibrationDashboard from './components/CalibrationDashboard';
import Login from './components/Login';
import * as api from './supabase';
import CoderGuide from './components/CoderGuide';
import AnnotationTable from './components/AnnotationTable';
import { LogOut, Loader2, Database, BarChart3, Edit3, BookOpen, Table2 } from 'lucide-react';
import type { Conversation, Sequence, ConversationStance, User as SupaUser, Turn } from './types';

function App() {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [activeTab, setActiveTab] = useState<'annotate' | 'batch' | 'insights' | 'guide' | 'data'>('annotate');
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [coderStance, setCoderStance] = useState<ConversationStance | null>(null);
  const [loading, setLoading] = useState(true);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, remainingSeqs: 0, remainingTurns: 0 });

  // Auth Initialization
  useEffect(() => {
    api.getUser().then(setUser);
    const { data: { subscription } } = api.supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchNext = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const conv = await api.fetchNextConversation(user.id);
      if (conv) {
        setCurrentConversation(conv);
        // Automatically start with the first sequence
        setCurrentSequence(conv.sequences[0] || null);
        // Fetch existing stance if any
        const stance = await api.fetchStance(user.id, conv.id);
        setCoderStance(stance);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const { data } = await api.supabase.from('annotations').select('*, sequence_id(conversation_id)');
    if (data) setAnnotations(data);
  };

  const fetchStats = async () => {
    if (!user) return;
    const s = await api.fetchRemainingWork(user.id);
    setStats(s);
  };

  useEffect(() => {
    if (user) {
      if (!currentConversation) fetchNext();
      fetchDashboardData();
      fetchStats();
    }
  }, [user]);

  const navigateToSequence = async (sequenceId: string, conversationId: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: convRow, error: convErr } = await api.supabase
        .from('conversations')
        .select('id, external_id, raw_json')
        .eq('id', conversationId)
        .single();
      if (convErr) { console.error('Failed to fetch conversation:', convErr); return; }

      const { data: seqRow, error: seqErr } = await api.supabase
        .from('sequences')
        .select('id, conversation_id, turn_range, is_calibration')
        .eq('id', sequenceId)
        .single();
      if (seqErr) { console.error('Failed to fetch sequence:', seqErr); return; }

      if (convRow && seqRow) {
        const turns = api.parseTurns(convRow.raw_json);
        const range = api.parseRange(seqRow.turn_range);
        const seq: Sequence = {
          id: seqRow.id,
          conversation_id: seqRow.conversation_id,
          turn_range: range,
          is_calibration: seqRow.is_calibration,
          turns: turns.filter((t: Turn) => t.turn_number >= range[0] && t.turn_number <= range[1]),
        };

        // Fetch all sequences for sidebar context
        const { data: allSeqRows } = await api.supabase
          .from('sequences')
          .select('id, conversation_id, turn_range, is_calibration')
          .eq('conversation_id', conversationId)
          .order('turn_range', { ascending: true });

        const sequences: Sequence[] = (allSeqRows ?? []).map((s: any) => {
          const r = api.parseRange(s.turn_range);
          return {
            id: s.id,
            conversation_id: s.conversation_id,
            turn_range: r,
            is_calibration: s.is_calibration,
            turns: turns.filter((t: Turn) => t.turn_number >= r[0] && t.turn_number <= r[1]),
          };
        });

        setCurrentConversation({ id: convRow.id, external_id: convRow.external_id, turns, sequences });
        setCurrentSequence(seq);
        const stance = await api.fetchStance(user.id, convRow.id);
        setCoderStance(stance);
        setActiveTab('annotate');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSequence = async (seq: any) => {
    await navigateToSequence(seq.id, seq.conversation_id);
  };

  if (!user) return <Login />;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="row">
            <div className="brand-icon">A</div>
            <h1>AROMA Annotation</h1>
          </div>
          <p>Laboratory Session · v0.2.2</p>
        </div>

        <div className="topnav">
           <button 
             className={activeTab === 'annotate' ? 'primary' : ''} 
             onClick={() => setActiveTab('annotate')}
            >
              <Edit3 size={14} style={{ marginRight: 6 }} /> Annotate
            </button>
           <button 
             className={activeTab === 'batch' ? 'primary' : ''} 
             onClick={() => setActiveTab('batch')}
            >
              <Database size={14} style={{ marginRight: 6 }} /> Batch
            </button>
           <button 
             className={activeTab === 'insights' ? 'primary' : ''} 
             onClick={() => setActiveTab('insights')}
            >
              <BarChart3 size={14} style={{ marginRight: 6 }} /> Insights
            </button>
           <button
             className={activeTab === 'data' ? 'primary' : ''}
             onClick={() => setActiveTab('data')}
            >
              <Table2 size={14} style={{ marginRight: 6 }} /> Data
            </button>
           <button
             className={activeTab === 'guide' ? 'primary' : ''}
             onClick={() => setActiveTab('guide')}
            >
              <BookOpen size={14} style={{ marginRight: 6 }} /> Guide
            </button>
        </div>

        <div className="row">
          <div className="brand" style={{textAlign: 'right'}}>
            <p>RESEARCHER</p>
            <h1 style={{fontSize: 13}}>{user.email}</h1>
          </div>
          <button onClick={() => api.signOut()} style={{padding: 8}}><LogOut size={16}/></button>
        </div>
      </header>

      <main className="layout-2" style={{ padding: 0, gap: 0 }}>
        <aside className="sidebar stack" style={{ borderRight: '1px solid var(--line)' }}>
          <div className="panel panel-pad stack" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0, gap: 16 }}>
            <h3 className="sidebar-title">Active Session</h3>
            <div className="stack" style={{ gap: 12 }}>
               <div className="sidebar-card">
                 <h4>Conversation</h4>
                 <div className="sidebar-card-value">
                   {currentConversation?.external_id || 'None Selected'}
                 </div>
               </div>
               <div className="sidebar-card">
                 <h4>Sequence</h4>
                 <div className="sidebar-card-value">
                   {currentSequence && currentConversation
                     ? `${currentConversation.sequences.findIndex(s => s.id === currentSequence.id) + 1} / ${currentConversation.sequences.length} · Turns ${currentSequence.turn_range[0]}-${currentSequence.turn_range[1]}`
                     : '—'}
                 </div>
               </div>
               <div className="sidebar-card">
                 <h4>Stance</h4>
                 <div className="sidebar-card-value" style={{ color: coderStance ? 'var(--green)' : 'var(--muted)' }}>
                    {coderStance?.user_stance || 'PENDING'}
                 </div>
               </div>
            </div>
            {activeTab !== 'batch' && (
              <button 
                className="secondary small" 
                style={{ width: '100%', borderRadius: 12 }}
                onClick={() => setActiveTab('batch')}
              >
                Switch Transcript
              </button>
            )}
          </div>

          <div className="calibration-banner" style={{ marginTop: 'auto' }}>
             <h3>Calibration Progress</h3>
             <div className="kpi">
                {stats.total > 0 ? Math.round(((stats.total - stats.remainingSeqs) / stats.total) * 100) : 0}%
             </div>
             <p>{stats.remainingSeqs} SEQS REMAINING</p>
             <p style={{fontSize: 10, opacity: 0.8}}>{stats.remainingTurns} TURNS LEFT</p>
          </div>
        </aside>

        <div className="workspace">
          {loading ? (
             <div className="loading-workspace">
                <Loader2 className="animate-spin" style={{color: 'var(--blue)', marginBottom: 12}} />
                <p className="subtle">Hydrating Laboratory Workspace...</p>
             </div>
          ) : activeTab === 'annotate' ? (
             currentConversation && currentSequence ? (
               <SeekerFirstForm
                  key={currentSequence.id}
                  conversationId={currentConversation.external_id}
                  sequence={currentSequence}
                  existingStance={coderStance?.user_stance}
                  onSaveStance={async (s: any, n: string) => {
                    await api.saveStance(user.id, { 
                      conversation_id: currentConversation.id, 
                      user_stance: s, 
                      stance_notes: n 
                    });
                    setCoderStance({ conversation_id: currentConversation.id, user_stance: s, stance_notes: n });
                  }}
                  onSaveAnnotation={async (data: any) => {
                    const { error } = await api.saveAnnotation(
                      user.id, 
                      currentSequence.id, 
                      coderStance?.user_stance || '', 
                      data
                    );
                    if (!error) {
                      fetchDashboardData();
                      fetchStats();
                      // Advance to next sequence in this conversation, or next conversation
                      const seqs = currentConversation.sequences;
                      const idx = seqs.findIndex(s => s.id === currentSequence.id);
                      if (idx >= 0 && idx < seqs.length - 1) {
                        setCurrentSequence(seqs[idx + 1]);
                      } else {
                        fetchNext();
                      }
                    } else {
                      alert(error.message);
                    }
                  }} 
                />
             ) : (
                <div className="panel panel-pad stack" style={{ alignItems: 'center', justifyContent: 'center', height: 400, gap: 12 }}>
                   <Database size={40} color="var(--line)" />
                   <p className="subtle">No sequence selected.</p>
                   <button className="primary" onClick={() => setActiveTab('batch')}>Browse Calibration Batch</button>
                </div>
             )
          ) : activeTab === 'batch' ? (
             <CalibrationDashboard 
               onSelectSequence={handleSelectSequence} 
               currentSequenceId={currentSequence?.id} 
             />
          ) : activeTab === 'data' ? (
             <AnnotationTable onNavigateToSequence={navigateToSequence} />
          ) : activeTab === 'guide' ? (
             <CoderGuide />
          ) : (
             <TurningPointDashboard annotations={annotations} />
          )}
        </div>
      </main>

      <div className="footer-note">
        © 2026 AROMA Research Lab · CHI '26 Submission Draft · Protocol v0.2.2
      </div>
    </div>
  );
}

export default App;
