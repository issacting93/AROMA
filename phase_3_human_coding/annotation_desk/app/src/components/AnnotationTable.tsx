/**
 * AnnotationTable — Tabular view of all annotations with coder tabs and inline editing.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Save, X, Pencil, Filter, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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

interface AnnotationTableProps {
  onNavigateToSequence?: (sequenceId: string, conversationId: string) => void;
}

export default function AnnotationTable({ onNavigateToSequence }: AnnotationTableProps) {
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
  const [irrMode, setIrrMode] = useState(false);

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

  // IRR Statistics & Grouping
  const irrStats = useMemo(() => {
    if (!rows.length) return { total: 0, shared: 0, d1_kappa: 0, d2_kappa: 0, groups: [] };

    const groups: Record<string, AnnotationRow[]> = {};
    rows.forEach(r => {
      if (!groups[r.sequence_id]) groups[r.sequence_id] = [];
      groups[r.sequence_id].push(r);
    });

    const sharedGroups = Object.entries(groups).filter(([_, annos]) => annos.length > 1);
    
    let d1_agreed = 0;
    let d2_agreed = 0;

    const irrGroups = sharedGroups.map(([sid, annos]) => {
      const d1s = new Set(annos.map(a => a.d1_support_type));
      const d2s = new Set(annos.map(a => a.primary_d2_role));
      
      const d1_agree = d1s.size === 1;
      const d2_agree = d2s.size === 1;

      if (d1_agree) d1_agreed++;
      if (d2_agree) d2_agreed++;

      return {
        sequence_id: sid,
        external_id: annos[0].external_id,
        turn_range: annos[0].turn_range,
        conversation_id: annos[0].conversation_id,
        annotations: annos,
        d1_agreement: d1_agree,
        d2_agreement: d2_agree
      };
    });

    return {
      total: Object.keys(groups).length,
      shared: sharedGroups.length,
      d1_agreement_rate: sharedGroups.length ? (d1_agreed / sharedGroups.length) * 100 : 0,
      d2_agreement_rate: sharedGroups.length ? (d2_agreed / sharedGroups.length) * 100 : 0,
      groups: irrGroups
    };
  }, [rows]);

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
        <h2 style={{ margin: 0, fontSize: 18 }}>Annotation {irrMode ? 'IRR Analysis' : 'Data Explorer'}</h2>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <div className="search-box row" style={{ background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
            <Filter size={14} color="var(--muted)" />
            <input
              type="text"
              placeholder="Filter by conversation..."
              value={filterConv}
              onChange={e => setFilterConv(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, marginLeft: 8, width: 200 }}
            />
          </div>
          <button 
            className={irrMode ? 'primary' : ''} 
            onClick={() => setIrrMode(!irrMode)}
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            {irrMode ? 'Exit IRR Mode' : 'Measure IRR'}
          </button>
        </div>
      </div>

      {/* IRR Summary Card */}
      {irrMode && (
        <div className="grid-3" style={{ gap: 12 }}>
          <div className="panel panel-pad stack" style={{ gap: 8, border: '1px solid var(--line)', background: 'rgba(79, 70, 229, 0.03)' }}>
             <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>Shared Sequences</h4>
             <div style={{ fontSize: 24, fontWeight: 900 }}>{irrStats.shared} <span style={{fontSize: 14, fontWeight: 500, color: 'var(--muted)'}}>of {irrStats.total}</span></div>
          </div>
          <div className="panel panel-pad stack" style={{ gap: 8, border: '1px solid var(--line)', background: 'rgba(16, 185, 129, 0.03)' }}>
             <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>D1 Agreement</h4>
             <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>{Math.round(Number(irrStats.d1_agreement_rate || 0))}%</div>
             <p style={{fontSize: 10, color: 'var(--muted)', margin: 0}}>Support Type Concordance</p>
          </div>
          <div className="panel panel-pad stack" style={{ gap: 8, border: '1px solid var(--line)', background: 'rgba(79, 70, 229, 0.03)' }}>
             <h4 style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0 }}>D2 Agreement</h4>
             <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--blue)' }}>{Math.round(Number(irrStats.d2_agreement_rate || 0))}%</div>
             <p style={{fontSize: 10, color: 'var(--muted)', margin: 0}}>Care Role Concordance</p>
          </div>
        </div>
      )}

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
              {irrMode && <th style={thStyle}>Coder</th>}
              <Th field="primary_d2_role" label="D2 Role" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <Th field="d1_support_type" label="D1 Type" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <th style={thStyle}>D3 Strategies</th>
              <Th field="confidence" label="Conf" onSort={handleSort} sortField={sortField} sortAsc={sortAsc} />
              <th style={thStyle}>Notes</th>
              <th style={{ ...thStyle, width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {(irrMode ? irrStats.groups : displayed).map(itemOrGroup => {
              if (irrMode) {
                const group = itemOrGroup as typeof irrStats.groups[0];
                return (
                  <React.Fragment key={group.sequence_id}>
                    {/* Header for group */}
                    <tr style={{ background: (group.d1_agreement && group.d2_agreement) ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)' }}>
                      <td style={{ ...tdStyle, fontWeight: '900', color: 'var(--text)' }} colSpan={2}>
                        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: 13 }}>{group.external_id}</span>
                          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>({group.turn_range})</span>
                        </div>
                      </td>
                      <td colSpan={7} style={{ ...tdStyle, textAlign: 'right' }}>
                        <div className="row" style={{ gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <span className="badge" style={{ 
                            background: (group.d1_agreement && group.d2_agreement) ? 'var(--green)' : 'var(--red)',
                            color: '#fff', fontSize: 10
                          }}>
                            {(group.d1_agreement && group.d2_agreement) ? 'AGREEMENT' : 'RECONCILE'}
                          </span>
                          {onNavigateToSequence && (
                            <button 
                              className="secondary small"
                              onClick={() => onNavigateToSequence(group.sequence_id, group.conversation_id)}
                              style={{ padding: '2px 8px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <ExternalLink size={12} /> Open to Reconcile
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {group.annotations.map(row => (
                      <AnnotationRowComponent 
                        key={row.id} 
                        row={row} 
                        isEditing={editingId === row.id}
                        editData={editData}
                        saving={saving}
                        irrMode={true}
                        d1_conflict={!group.d1_agreement}
                        d2_conflict={!group.d2_agreement}
                        onEdit={startEdit}
                        onCancel={cancelEdit}
                        onSave={saveEdit}
                        onSetEditData={setEditData}
                        onToggleD3={toggleD3}
                        onNavigate={onNavigateToSequence}
                        coders={coders}
                      />
                    ))}
                  </React.Fragment>
                );
              } else {
                const row = itemOrGroup as AnnotationRow;
                return (
                  <AnnotationRowComponent 
                    key={row.id} 
                    row={row} 
                    isEditing={editingId === row.id}
                    editData={editData}
                    saving={saving}
                    irrMode={false}
                    onEdit={startEdit}
                    onCancel={cancelEdit}
                    onSave={saveEdit}
                    onSetEditData={setEditData}
                    onToggleD3={toggleD3}
                    onNavigate={onNavigateToSequence}
                    coders={coders}
                  />
                );
              }
            })}
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

interface AnnotationRowComponentProps {
  row: AnnotationRow;
  isEditing: boolean;
  editData: Partial<AnnotationRow>;
  saving: boolean;
  irrMode: boolean;
  d1_conflict?: boolean;
  d2_conflict?: boolean;
  onEdit: (row: AnnotationRow) => void;
  onCancel: () => void;
  onSave: (row: AnnotationRow) => Promise<void>;
  onSetEditData: (data: Partial<AnnotationRow>) => void;
  onToggleD3: (strat: D3Strategy) => void;
  onNavigate?: (sid: string, cid: string) => void;
  coders: CoderInfo[];
}

function AnnotationRowComponent({ 
  row, isEditing, editData, saving, irrMode, d1_conflict, d2_conflict,
  onEdit, onCancel, onSave, onSetEditData, onToggleD3, onNavigate, coders 
}: AnnotationRowComponentProps) {
  const coder = coders.find(c => c.id === row.coder_id);
  const coderName = coder ? coder.label.split(' ')[1] : '?';

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--line)',
        background: isEditing ? 'rgba(79, 70, 229, 0.05)' : undefined,
      }}
    >
      {!irrMode && <td style={tdStyle}>{row.external_id.replace('ESConv_', '#')}</td>}
      {!irrMode && <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{row.turn_range}</td>}
      
      {irrMode && (
        <td style={{ ...tdStyle, color: 'var(--muted)', fontWeight: 700 }}>
          {coderName}
        </td>
      )}

      {/* D2 Role */}
      <td style={{ 
        ...tdStyle, 
        background: (irrMode && d2_conflict) ? 'rgba(239, 68, 68, 0.03)' : undefined,
        borderLeft: (irrMode && d2_conflict) ? '2px solid var(--red)' : undefined
      }}>
        {isEditing ? (
          <select
            value={editData.primary_d2_role ?? ''}
            onChange={e => onSetEditData({ ...editData, primary_d2_role: e.target.value })}
            style={editSelectStyle}
          >
            <option value="">—</option>
            {D2_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        ) : (
          <span style={{ color: (irrMode && d2_conflict) ? 'var(--red)' : 'inherit', fontWeight: (irrMode && d2_conflict) ? 700 : 400 }}>
            {row.primary_d2_role || '—'}
          </span>
        )}
      </td>

      {/* D1 Type */}
      <td style={{ 
        ...tdStyle, 
        background: (irrMode && d1_conflict) ? 'rgba(239, 68, 68, 0.03)' : undefined,
        borderLeft: (irrMode && d1_conflict) ? '2px solid var(--red)' : undefined
      }}>
        {isEditing ? (
          <select
            value={editData.d1_support_type ?? ''}
            onChange={e => onSetEditData({ ...editData, d1_support_type: e.target.value as any })}
            style={editSelectStyle}
          >
            <option value="">—</option>
            {D1_SUPPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        ) : (
          <span style={{ color: (irrMode && d1_conflict) ? 'var(--red)' : 'inherit', fontWeight: (irrMode && d1_conflict) ? 700 : 400 }}>
            {row.d1_support_type || '—'}
          </span>
        )}
      </td>

      {/* D3 Strategies */}
      <td style={{ ...tdStyle, maxWidth: 220 }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {D3_STRATEGIES.map(s => (
              <label
                key={s}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '2px 6px', borderRadius: 4, fontSize: 11, cursor: 'pointer',
                  background: (editData.d3_strategies ?? []).includes(s) ? 'var(--blue)' : 'var(--bg)',
                  color: (editData.d3_strategies ?? []).includes(s) ? 'white' : 'var(--muted)',
                  border: '1px solid var(--line)',
                }}
              >
                <input
                  type="checkbox"
                  checked={(editData.d3_strategies ?? []).includes(s)}
                  onChange={() => onToggleD3(s)}
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
                    background: 'var(--bg)', border: '1px solid var(--line)', color: 'var(--muted)'
                  }}>{s}</span>
                ))
              : <span style={{ color: 'var(--muted)' }}>—</span>
            }
          </div>
        )}
      </td>

      {/* Confidence */}
      <td style={{ ...tdStyle, textAlign: 'center' }}>
        {isEditing ? (
          <select
            value={editData.confidence ?? 2}
            onChange={e => onSetEditData({ ...editData, confidence: Number(e.target.value) as 1 | 2 | 3 })}
            style={{ ...editSelectStyle, width: 50 }}
          >
            {[1, 2, 3].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        ) : row.confidence}
      </td>

      {/* Notes */}
      <td style={{ ...tdStyle, maxWidth: 200, fontSize: 11, color: 'var(--muted)' }}>
        {isEditing ? (
          <textarea
            value={editData.notes ?? ''}
            onChange={e => onSetEditData({ ...editData, notes: e.target.value })}
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
        {isEditing ? (
          <div className="row" style={{ gap: 4, justifyContent: 'center' }}>
            <button
              onClick={() => onSave(row)}
              disabled={saving}
              style={{ padding: 4, borderRadius: 6, background: 'var(--green)', color: 'white', border: 'none', cursor: 'pointer' }}
              title="Save"
            >
              <Save size={14} />
            </button>
            <button
              onClick={onCancel}
              style={{ padding: 4, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--line)', cursor: 'pointer' }}
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="row" style={{ gap: 4, justifyContent: 'center' }}>
            <button
              onClick={() => onEdit(row)}
              style={{ padding: 4, borderRadius: 6, background: 'transparent', border: '1px solid var(--line)', cursor: 'pointer' }}
              title="Edit inline"
            >
              <Pencil size={14} />
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate(row.sequence_id, row.conversation_id)}
                style={{ padding: 4, borderRadius: 6, background: 'var(--blue)', color: 'white', border: 'none', cursor: 'pointer' }}
                title="Open in Annotate view"
              >
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

function Th({ field, label, onSort, sortField, sortAsc }: {
  field: SortField; label: string;
  onSort: (f: SortField) => void;
  sortField: SortField | undefined; sortAsc: boolean;
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
