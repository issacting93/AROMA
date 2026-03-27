/**
 * AnnotationTable — Tabular view of all annotations with coder tabs and inline editing.
 */
import { useState, useEffect, useMemo } from 'react';
import { Save, X, Pencil, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import * as api from '../supabase';
import {
  D2_ROLES, D1_SUPPORT_TYPES, D3_STRATEGIES,
  type D3Strategy,
} from '../types';

interface AnnotationRow {
  id: string;
  external_id: string;
  turn_range: string;
  sequence_id: string;
  conversation_id: string;
  coder_id: string;
  primary_d2_role: string;
  d1_support_type: string;
  d3_strategies: string[];
  stance_mismatch: string;
  confidence: number;
  notes: string;
  created_at: string;
}

type SortField = 'external_id' | 'turn_range' | 'primary_d2_role' | 'd1_support_type' | 'confidence' | 'created_at';

// All known coders — will be populated dynamically
interface CoderInfo {
  id: string;
  label: string;
}

export default function AnnotationTable() {
  const [rows, setRows] = useState<AnnotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [coders, setCoders] = useState<CoderInfo[]>([]);
  const [activeCoder, setActiveCoder] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AnnotationRow>>({});
  const [saving, setSaving] = useState(false);
  const [sortField, setSortField] = useState<SortField>('external_id');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterConv, setFilterConv] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await api.supabase
      .from('annotations')
      .select(`
        id,
        primary_d2_role,
        d1_support_type,
        d3_strategies,
        stance_mismatch,
        confidence,
        notes,
        created_at,
        coder_id,
        sequence_id,
        sequences!inner (
          id,
          turn_range,
          conversation_id,
          conversations!inner (
            id,
            external_id
          )
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch annotations:', error);
      setLoading(false);
      return;
    }

    const mapped: AnnotationRow[] = (data ?? []).map((r: any) => ({
      id: r.id,
      external_id: r.sequences?.conversations?.external_id ?? '?',
      turn_range: r.sequences?.turn_range ?? '?',
      sequence_id: r.sequence_id,
      conversation_id: r.sequences?.conversation_id ?? '',
      coder_id: r.coder_id,
      primary_d2_role: r.primary_d2_role ?? '',
      d1_support_type: r.d1_support_type ?? '',
      d3_strategies: Array.isArray(r.d3_strategies) ? r.d3_strategies : [],
      stance_mismatch: r.stance_mismatch ?? '',
      confidence: r.confidence ?? 2,
      notes: r.notes ?? '',
      created_at: r.created_at,
    }));

    setRows(mapped);

    // Extract unique coders
    const coderIds = [...new Set(mapped.map(r => r.coder_id))];
    setCoders(coderIds.map((id, i) => ({
      id,
      label: `Coder ${String.fromCharCode(65 + i)} (${id.slice(0, 6)})`,
    })));

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Filtered & sorted rows
  const displayed = useMemo(() => {
    let result = rows;
    if (activeCoder !== 'all') {
      result = result.filter(r => r.coder_id === activeCoder);
    }
    if (filterConv.trim()) {
      const q = filterConv.trim().toLowerCase();
      result = result.filter(r => r.external_id.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      let va = (a as any)[sortField] ?? '';
      let vb = (b as any)[sortField] ?? '';
      if (sortField === 'confidence') {
        va = Number(va); vb = Number(vb);
      } else if (sortField === 'external_id') {
        // Sort ESConv_0, ESConv_1, ..., ESConv_24 numerically
        const na = parseInt(va.split('_')[1] ?? '0');
        const nb = parseInt(vb.split('_')[1] ?? '0');
        va = na; vb = nb;
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      // Secondary sort by turn range
      if (sortField !== 'turn_range') {
        const ta = a.turn_range; const tb = b.turn_range;
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      }
      return 0;
    });
    return result;
  }, [rows, activeCoder, filterConv, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const startEdit = (row: AnnotationRow) => {
    setEditingId(row.id);
    setEditData({
      primary_d2_role: row.primary_d2_role,
      d1_support_type: row.d1_support_type,
      d3_strategies: [...row.d3_strategies],
      confidence: row.confidence,
      notes: row.notes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (row: AnnotationRow) => {
    setSaving(true);
    const { error } = await api.supabase
      .from('annotations')
      .update({
        primary_d2_role: editData.primary_d2_role,
        d1_support_type: editData.d1_support_type || null,
        d3_strategies: editData.d3_strategies,
        confidence: editData.confidence,
        notes: editData.notes || null,
      })
      .eq('id', row.id);

    if (error) {
      alert(`Save failed: ${error.message}`);
    } else {
      setEditingId(null);
      setEditData({});
      await fetchData();
    }
    setSaving(false);
  };

  const toggleD3 = (strat: D3Strategy) => {
    const current = editData.d3_strategies ?? [];
    if (current.includes(strat)) {
      setEditData({ ...editData, d3_strategies: current.filter(s => s !== strat) });
    } else {
      setEditData({ ...editData, d3_strategies: [...current, strat] });
    }
  };

  const stanceBadge = (s: string) => {
    const colors: Record<string, string> = {
      aligned: 'var(--green)',
      mild_misfit: '#C5C56A',
      misfit: '#DDAA33',
      misaligned: '#DD8452',
      misaligned_paradox_risk: 'var(--red)',
    };
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        background: colors[s] ? `${colors[s]}22` : 'var(--surface)',
        color: colors[s] || 'var(--muted)',
        border: `1px solid ${colors[s] || 'var(--line)'}`,
      }}>
        {s || '—'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="panel panel-pad" style={{ textAlign: 'center', padding: 40 }}>
        <p className="subtle">Loading annotations...</p>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 16, padding: 20 }}>
      {/* Header */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Annotation Data</h2>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <Filter size={14} color="var(--muted)" />
          <input
            type="text"
            placeholder="Filter by conversation..."
            value={filterConv}
            onChange={e => setFilterConv(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)', fontSize: 13, width: 200 }}
          />
        </div>
      </div>

      {/* Coder tabs */}
      <div className="row" style={{ gap: 4, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
        <button
          className={activeCoder === 'all' ? 'primary' : ''}
          style={{ borderRadius: '8px 8px 0 0', fontSize: 13, padding: '8px 16px' }}
          onClick={() => setActiveCoder('all')}
        >
          All ({rows.length})
        </button>
        {coders.map(c => (
          <button
            key={c.id}
            className={activeCoder === c.id ? 'primary' : ''}
            style={{ borderRadius: '8px 8px 0 0', fontSize: 13, padding: '8px 16px' }}
            onClick={() => setActiveCoder(c.id)}
          >
            {c.label} ({rows.filter(r => r.coder_id === c.id).length})
          </button>
        ))}
      </div>

      {/* Summary */}
      <p className="subtle" style={{ margin: 0, fontSize: 12 }}>
        Showing {displayed.length} annotation{displayed.length !== 1 ? 's' : ''}
        {activeCoder !== 'all' ? ` for ${coders.find(c => c.id === activeCoder)?.label}` : ''}
        {filterConv ? ` matching "${filterConv}"` : ''}
      </p>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--line)', textAlign: 'left' }}>
              <Th field="external_id" label="Conv" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <Th field="turn_range" label="Turns" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <Th field="primary_d2_role" label="D2 Role" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <Th field="d1_support_type" label="D1 Type" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <th style={thStyle}>D3 Strategies</th>
              <th style={thStyle}>Stance</th>
              <Th field="confidence" label="Conf" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <th style={thStyle}>Notes</th>
              <th style={{ ...thStyle, width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(row => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid var(--line)',
                  background: editingId === row.id ? 'var(--surface)' : undefined,
                }}
              >
                <td style={tdStyle}>{row.external_id.replace('ESConv_', '#')}</td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{row.turn_range}</td>

                {/* D2 Role */}
                <td style={tdStyle}>
                  {editingId === row.id ? (
                    <select
                      value={editData.primary_d2_role ?? ''}
                      onChange={e => setEditData({ ...editData, primary_d2_role: e.target.value })}
                      style={editSelectStyle}
                    >
                      <option value="">—</option>
                      {D2_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : row.primary_d2_role || '—'}
                </td>

                {/* D1 Type */}
                <td style={tdStyle}>
                  {editingId === row.id ? (
                    <select
                      value={editData.d1_support_type ?? ''}
                      onChange={e => setEditData({ ...editData, d1_support_type: e.target.value })}
                      style={editSelectStyle}
                    >
                      <option value="">—</option>
                      {D1_SUPPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : row.d1_support_type || '—'}
                </td>

                {/* D3 Strategies */}
                <td style={{ ...tdStyle, maxWidth: 220 }}>
                  {editingId === row.id ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {D3_STRATEGIES.map(s => (
                        <label
                          key={s}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            padding: '2px 6px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                            background: (editData.d3_strategies ?? []).includes(s) ? 'var(--blue)' : 'var(--surface)',
                            color: (editData.d3_strategies ?? []).includes(s) ? 'white' : 'var(--fg)',
                            border: '1px solid var(--line)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={(editData.d3_strategies ?? []).includes(s)}
                            onChange={() => toggleD3(s)}
                            style={{ display: 'none' }}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {row.d3_strategies.length > 0
                        ? row.d3_strategies.map(s => (
                            <span key={s} style={{
                              padding: '1px 6px', borderRadius: 4, fontSize: 11,
                              background: 'var(--surface)', border: '1px solid var(--line)',
                            }}>{s}</span>
                          ))
                        : <span style={{ color: 'var(--muted)' }}>—</span>
                      }
                    </div>
                  )}
                </td>

                {/* Stance */}
                <td style={tdStyle}>{stanceBadge(row.stance_mismatch)}</td>

                {/* Confidence */}
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {editingId === row.id ? (
                    <select
                      value={editData.confidence ?? 2}
                      onChange={e => setEditData({ ...editData, confidence: Number(e.target.value) as 1 | 2 | 3 })}
                      style={{ ...editSelectStyle, width: 50 }}
                    >
                      {[1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : row.confidence}
                </td>

                {/* Notes */}
                <td style={{ ...tdStyle, maxWidth: 200, fontSize: 11, color: 'var(--muted)' }}>
                  {editingId === row.id ? (
                    <textarea
                      value={editData.notes ?? ''}
                      onChange={e => setEditData({ ...editData, notes: e.target.value })}
                      rows={2}
                      style={{ width: '100%', fontSize: 11, borderRadius: 6, border: '1px solid var(--line)', padding: 4, resize: 'vertical' }}
                    />
                  ) : (
                    row.notes ? (
                      <span title={row.notes}>
                        {row.notes.length > 60 ? row.notes.slice(0, 60) + '...' : row.notes}
                      </span>
                    ) : '—'
                  )}
                </td>

                {/* Actions */}
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {editingId === row.id ? (
                    <div className="row" style={{ gap: 4, justifyContent: 'center' }}>
                      <button
                        onClick={() => saveEdit(row)}
                        disabled={saving}
                        style={{ padding: 4, borderRadius: 6, background: 'var(--green)', color: 'white', border: 'none', cursor: 'pointer' }}
                        title="Save"
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{ padding: 4, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--line)', cursor: 'pointer' }}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(row)}
                      style={{ padding: 4, borderRadius: 6, background: 'transparent', border: '1px solid var(--line)', cursor: 'pointer' }}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayed.length === 0 && (
        <p className="subtle" style={{ textAlign: 'center', padding: 20 }}>
          No annotations found{filterConv ? ` matching "${filterConv}"` : ''}.
        </p>
      )}
    </div>
  );
}

// --- Sortable header cell ---
function Th({ field, label, onSort, sortField, sortAsc }: {
  field: SortField; label: string;
  onSort: (f: SortField) => void;
  sortField: SortField; sortAsc: boolean;
}) {
  return (
    <th
      style={{ ...thStyle, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onSort(field)}
    >
      <span className="row" style={{ gap: 2, alignItems: 'center' }}>
        {label}
        {sortField === field && (sortAsc
          ? <ChevronUp size={12} />
          : <ChevronDown size={12} />
        )}
      </span>
    </th>
  );
}

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--muted)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '8px 10px',
  verticalAlign: 'top',
};

const editSelectStyle: React.CSSProperties = {
  padding: '4px 6px',
  borderRadius: 6,
  border: '1px solid var(--line)',
  fontSize: 12,
  width: '100%',
};
