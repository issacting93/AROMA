/**
 * AROMA Export Utilities
 * Handles flattening of Supabase nested records and CSV conversion.
 */

export function flattenAnnotation(annotation: any) {
  const seq = annotation.sequence_id;
  const conv = seq?.conversation_id;

  return {
    annotation_id: annotation.id,
    external_id: conv?.external_id || 'N/A',
    sequence_id: seq?.id || 'N/A',
    turn_range: seq?.turn_range || 'N/A',
    is_calibration: seq?.is_calibration ? 'TRUE' : 'FALSE',
    primary_d2_role: annotation.primary_d2_role,
    d1_support_type: annotation.d1_support_type || 'None',
    d3_strategies: (annotation.d3_strategies || []).join('; '),
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
