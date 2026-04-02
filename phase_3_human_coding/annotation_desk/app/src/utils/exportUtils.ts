/**
 * AROMA Export Utilities
 * Handles flattening of Supabase nested records and CSV conversion.
 */

import { getPrimaryRole } from '../types';

export function flattenAnnotation(annotation: any, stances: any[] = []) {
  const seq = annotation.sequence_id;
  const conv = seq?.conversation_id;

  const seekerStance = stances.find(s => 
    s.conversation_id === conv?.id && s.coder_id === annotation.coder_id
  )?.user_stance || 'N/A';

  // Use conversation DB id (UUID) instead of external_id to blind source
  return {
    annotation_id: annotation.id,
    conversation_id: conv?.id || 'N/A',
    sequence_id: seq?.id || 'N/A',
    turn_range: seq?.turn_range || 'N/A',
    is_calibration: seq?.is_calibration ? 'TRUE' : 'FALSE',
    seeker_stance: seekerStance,
    primary_d2_role: getPrimaryRole(annotation.d2_scores || {}) || 'None',
    d2_scores: JSON.stringify(annotation.d2_scores || {}),
    d1_scores: JSON.stringify(annotation.d1_scores || {}),
    d3_strategies: (annotation.d3_strategies || []).join('; '),
    role_transition: annotation.role_transition ? 'TRUE' : 'FALSE',
    transition_turn: annotation.transition_turn ?? '',
    stance_mismatch: annotation.stance_mismatch || 'N/A',
    confidence: annotation.confidence,
    notes: annotation.notes || '',
    coder_id: annotation.coder_id,
    created_at: annotation.created_at,
  };
}


export function convertToCSV(data: any[]) {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
