import React, { useState, useEffect } from 'react';
import { supabase, parseRange } from '../supabase';
import { Play, CheckCircle, Clock, Search, Layers, UserCheck } from 'lucide-react';

interface CalibrationDashboardProps {
  onSelectSequence: (sequence: any) => void;
  currentSequenceId?: string;
}

const CalibrationDashboard: React.FC<CalibrationDashboardProps> = ({ onSelectSequence, currentSequenceId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

  const fetchSequences = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('conversations')
      .select('*, sequences(*, annotations(*)), conversation_stances(*)')
      .order('external_id', { ascending: true });

    if (data) {
      const flattened = data.flatMap(conv => 
        conv.sequences.map((seq: any) => {
          const userStanceRow = conv.conversation_stances?.find((s: any) => s.coder_id === user.id);
          const turnsRaw = Array.isArray(conv.raw_json) 
            ? conv.raw_json 
            : (conv.raw_json.dialog || conv.raw_json.messages || []);

          const [lower, upperInclusive] = parseRange(seq.turn_range);
          const upper = upperInclusive + 1; // parseRange returns inclusive upper, filter below uses exclusive
          
          // Map to Turn objects and filter by range
          const turns = turnsRaw.map((t: any, i: number) => ({
            id: `t${i + 1}`,
            speaker: t.speaker === 'supporter' || t.role === 'supporter' ? 'supporter' : 'seeker',
            text: t.text || t.content || '',
            turn_number: i + 1,
          })).filter((_: any, i: number) => i >= lower && i < upper);

          return {
            ...seq,
            external_id: conv.external_id,
            conversation_db_id: conv.id,
            conversation_stance: userStanceRow?.user_stance || null,
            turns: turns, // Correctly filtered turns
            annotation_count: seq.annotations?.length || 0,
            is_coded: seq.annotations?.some((a: any) => a.coder_id === user.id)
          };
        })
      );
      setItems(flattened);
    }
    setLoading(false);
  };

  const calculateStats = () => {
    const totalSequences = filteredItems.length;
    const codedByAnyone = filteredItems.filter(i => i.annotation_count > 0).length;
    const codedByMe = filteredItems.filter(i => i.is_coded).length;
    
    // Remaining for current user
    const remainingSequences = totalSequences - codedByMe;
    const remainingTurns = filteredItems
      .filter(i => !i.is_coded)
      .reduce((acc, i) => acc + i.turns.length, 0);

    return { totalSequences, codedByAnyone, codedByMe, remainingSequences, remainingTurns };
  };

  useEffect(() => {
    fetchSequences();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.external_id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Phase logic: 
    // Phase 1 = ESConv_0 to ESConv_24 (50 seqs)
    // Phase 2 = ESConv_25 to ESConv_29 (10 seqs)
    // Phase 3 = ESConv_30 to ESConv_34 (10 seqs)
    const num = parseInt(item.external_id.split('_')[1] || '0');
    if (activePhase === 1) return num < 25;
    if (activePhase === 2) return num >= 25 && num < 30;
    return num >= 30;
  });

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row between">
        <h2 style={{ fontSize: 20, fontWeight: 900 }}>Calibration Batch Manager</h2>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <div className="row" style={{ background: 'var(--panel-alt)', padding: 3, borderRadius: 8 }}>
            <button 
              className={activePhase === 1 ? 'primary small' : 'secondary small'} 
              style={{ border: 'none', background: activePhase === 1 ? 'var(--blue)' : 'transparent', color: activePhase === 1 ? 'white' : 'var(--muted)' }}
              onClick={() => setActivePhase(1)}
            >
              Phase 1
            </button>
            <button 
              className={activePhase === 2 ? 'primary small' : 'secondary small'} 
              style={{ border: 'none', background: activePhase === 2 ? 'var(--blue)' : 'transparent', color: activePhase === 2 ? 'white' : 'var(--muted)' }}
              onClick={() => setActivePhase(2)}
            >
              Phase 2
            </button>
            <button 
              className={activePhase === 3 ? 'primary small' : 'secondary small'} 
              style={{ border: 'none', background: activePhase === 3 ? 'var(--blue)' : 'transparent', color: activePhase === 3 ? 'white' : 'var(--muted)' }}
              onClick={() => setActivePhase(3)}
            >
              Phase 3
            </button>
          </div>
          <div className="search-box row" style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
            <Search size={14} color="var(--muted)" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, marginLeft: 8 }}
            />
          </div>
          <button className="secondary small" onClick={fetchSequences}><Clock size={14} /> Refresh</button>
        </div>
      </div>

      {!loading && (
        <div className="grid-3" style={{ gap: 16 }}>
          <div className="panel panel-pad row" style={{ gap: 16, alignItems: 'center' }}>
            <div className="brand-icon" style={{ background: 'var(--blue)', width: 40, height: 40 }}>
              <Layers size={20} color="white" />
            </div>
            <div>
              <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Batch Progress</h4>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                {Math.round((calculateStats().codedByAnyone / calculateStats().totalSequences) * 100) || 0}%
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                {calculateStats().codedByAnyone} / {calculateStats().totalSequences} sequences coded
              </p>
            </div>
          </div>

          <div className="panel panel-pad row" style={{ gap: 16, alignItems: 'center' }}>
            <div className="brand-icon" style={{ background: 'var(--green)', width: 40, height: 40 }}>
              <UserCheck size={20} color="white" />
            </div>
            <div>
              <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Your Progress</h4>
              <div style={{ fontSize: 20, fontWeight: 900 }}>
                {calculateStats().codedByMe} / {calculateStats().totalSequences}
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>sequences completed</p>
            </div>
          </div>

          <div className="panel panel-pad row" style={{ gap: 16, alignItems: 'center', background: 'var(--bg-alt)' }}>
            <div className="brand-icon" style={{ background: 'var(--orange)', width: 40, height: 40 }}>
              <Clock size={20} color="white" />
            </div>
            <div>
              <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Remaining Work</h4>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--orange)' }}>
                {calculateStats().remainingTurns} <span style={{fontSize: 12, fontWeight: 400}}>Turns</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>Across {calculateStats().remainingSequences} sequences</p>
            </div>
          </div>
        </div>
      )}

      <div className="panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--panel-alt)', textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '12px 20px', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Sequence ID</th>
              <th style={{ padding: '12px 20px', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Turn Range</th>
              <th style={{ padding: '12px 20px', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Global Stance</th>
              <th style={{ padding: '12px 20px', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)' }}>Status</th>
              <th style={{ padding: '12px 20px', fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center' }}>Loading sequences...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center' }}>No conversations found.</td></tr>
            ) : filteredItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--line-alt)', background: currentSequenceId === item.id ? 'rgba(52, 115, 230, 0.05)' : 'white' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{item.external_id}</div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 12 }}>{item.turn_range}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div className="badge" style={{ background: item.conversation_stance ? 'var(--green)' : 'var(--line-alt)', color: item.conversation_stance ? '#fff' : 'var(--muted)' }}>
                    {item.conversation_stance || 'Pending'}
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div className="stack" style={{ gap: 4 }}>
                    {item.annotations && item.annotations.length > 0 ? (
                      <div className="row" style={{ gap: 4 }}>
                        {item.annotations.map((a: any, idx: number) => (
                          <div 
                            key={a.id} 
                            className="dot" 
                            title={`Coder ${a.coder_id}`}
                            style={{ 
                              background: ['var(--blue)', 'var(--green)', 'var(--orange)', 'var(--purple)'][idx % 4],
                              width: 8, height: 8, borderRadius: '50%'
                            }} 
                          />
                        ))}
                        <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>
                          {item.annotation_count} Coder(s)
                        </span>
                      </div>
                    ) : (
                      <div className="row" style={{ gap: 6, color: 'var(--muted)', fontSize: 11 }}>
                        <Clock size={12} /> Pending
                      </div>
                    )}
                    {item.is_coded && (
                      <div className="row" style={{ gap: 4, color: 'var(--green)', fontSize: 10, fontWeight: 700 }}>
                        <CheckCircle size={10} /> COMPLETED BY YOU
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button 
                    className={currentSequenceId === item.id ? 'primary small' : 'secondary small'}
                    onClick={() => onSelectSequence(item)}
                  >
                    {currentSequenceId === item.id ? 'Coding Now' : 'Code Sequence'} <Play size={12} style={{ marginLeft: 6 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalibrationDashboard;
