import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Play, CheckCircle, Clock, Search } from 'lucide-react';

interface CalibrationDashboardProps {
  onSelectSequence: (sequence: any) => void;
  currentSequenceId?: string;
}

const CalibrationDashboard: React.FC<CalibrationDashboardProps> = ({ onSelectSequence, currentSequenceId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSequences = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('conversations')
      .select('*, sequences(*, annotations(*))')
      .order('external_id', { ascending: true });

    if (data) {
      const flattened = data.flatMap(conv => 
        conv.sequences.map((seq: any) => ({
          ...seq,
          external_id: conv.external_id,
          conversation_db_id: conv.id,
          conversation_stance: conv.user_stance,
          turns: conv.raw_json.dialog || [],
          annotation_count: seq.annotations?.length || 0,
          is_coded: seq.annotations?.length > 0
        }))
      );
      setItems(flattened);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSequences();
  }, []);

  const filteredItems = items.filter(item => 
    item.external_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="row between">
        <h2 style={{ fontSize: 20, fontWeight: 900 }}>Calibration Batch Manager</h2>
        <div className="row" style={{ gap: 10 }}>
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
                  {item.is_coded ? (
                    <div className="row" style={{ gap: 6, color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>
                      <CheckCircle size={14} /> {item.annotation_count} Coder(s)
                    </div>
                  ) : (
                    <div className="row" style={{ gap: 6, color: 'var(--muted)', fontSize: 12 }}>
                      <Clock size={14} /> Pending
                    </div>
                  )}
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
