import React from 'react';
import { D2_ROLES, getPrimaryRole, type D2Role } from '../types';
import ExportButton from './ExportButton';

interface Annotation {
  d2_scores: Record<D2Role, number>;
  stance_mismatch: string;
}

interface TurningPointDashboardProps {
  annotations: Annotation[];
}

const TurningPointDashboard: React.FC<TurningPointDashboardProps> = ({ annotations }) => {
  // Logic: Calculate "Effectiveness" per D2 Role
  const roles = D2_ROLES.filter(r => r !== 'Ambiguous' && r !== 'None');
  
  const calculateEffectiveness = (role: string) => {
    const roleOccurrences = annotations.filter(a => getPrimaryRole(a.d2_scores) === role);
    if (roleOccurrences.length === 0) return 0;
    
    // For v0.2.2 calibration, "Effectiveness" is defined as % Aligned or Mild Misfit (Harmonious Interaction)
    const success = roleOccurrences.filter(a => 
      ['aligned', 'mild_misfit'].includes(a.stance_mismatch?.toLowerCase())
    ).length;
    
    return Math.round((success / roleOccurrences.length) * 100);
  };

  const getRoleStatus = (effectiveness: number) => {
    if (effectiveness >= 70) return { label: 'CATALYST', color: 'var(--green)' };
    if (effectiveness >= 40) return { label: 'RELIABLE', color: 'var(--blue)' };
    return { label: 'RISK', color: 'var(--orange)' };
  };

  return (
    <div className="stack" style={{gap: 20}}>
      <div className="row between">
        <h2 style={{fontSize: 20, fontWeight: 900}}>Relational Catalyst Dashboard</h2>
        <div className="pill">
          <div className="dot" style={{background: 'var(--blue)'}} />
          Live Metrics
        </div>
      </div>

      <div className="grid-3">
        {roles.map(role => {
          const effectiveness = calculateEffectiveness(role);
          const status = getRoleStatus(effectiveness);
          return (
            <div key={role} className="panel panel-pad stack" style={{gap: 12}}>
              <h3 style={{fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', margin: 0}}>{role}</h3>
              <div className="row between" style={{alignItems: 'baseline'}}>
                <div className="kpi">{effectiveness}%</div>
                <div className="badge" style={{ background: status.color, color: '#fff' }}>
                  {status.label}
                </div>
              </div>
              
              <div className="bar-stack shadow-sm" style={{marginTop: 8}}>
                 <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: `${effectiveness}%`, 
                      background: status.color
                    }} />
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel panel-pad section">
        <div className="row between" style={{alignItems: 'center'}}>
          <div>
            <h2>Turning Point Summary</h2>
            <p className="subtle">This view correlates AI Care Roles (D2) with User Stance (Codebook §4), identifying the 'Relational Catalysts' in the annotation corpus.</p>
          </div>
          <div className="row" style={{gap: 8}}>
            <ExportButton format="json" />
            <ExportButton format="csv" />
          </div>
        </div>
        
        <div className="notice" style={{marginTop: 12}}>
           <strong>Protocol v0.2.2:</strong> Effectiveness represents the observed frequency of 'aligned' or 'mild_misfit' states. 
           Strategic goals prioritize minimizing 'misfit' and 'paradox_risk' (misaligned) interactions.
        </div>
      </div>
    </div>
  );
};

export default TurningPointDashboard;
