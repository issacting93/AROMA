import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { fetchAllAnnotations, fetchAllStances } from '../supabase';
import { flattenAnnotation, convertToCSV, downloadFile } from '../utils/exportUtils';

interface ExportButtonProps {
  format: 'json' | 'csv';
}

const ExportButton: React.FC<ExportButtonProps> = ({ format }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data: annotations, error: annError } = await fetchAllAnnotations();
      const { data: stances, error: stanceError } = await fetchAllStances();
      
      if (annError || stanceError) {
        alert(`Export failed: ${annError?.message || stanceError?.message}`);
        return;
      }

      if (!annotations || annotations.length === 0) {
        alert('No data to export.');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `aroma_annotations_${timestamp}.${format}`;

      if (format === 'json') {
        const content = JSON.stringify({ annotations, stances }, null, 2);
        downloadFile(content, fileName, 'application/json');
      } else {
        const flattenedData = annotations.map(ann => flattenAnnotation(ann, stances || []));
        const csvContent = convertToCSV(flattenedData);
        downloadFile(csvContent, fileName, 'text/csv');
      }
    } catch (err: any) {

      alert(`Export error: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={exporting}
      className="secondary small"
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
    >
      {exporting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
      Export {format.toUpperCase()}
    </button>
  );
};

export default ExportButton;
