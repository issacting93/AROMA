import React, { useState, useEffect } from 'react';

/**
 * AROMA Seeker-First Annotation Form
 * Enforces the multi-step reveal to prevent Halo Effect.
 */
const SeekerFirstForm = ({ sequence, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    user_stance: '',
    primary_d2_role: '',
    d3_strategies: [],
    paradox_flag: false,
    confidence: 2,
    notes: ''
  });

  const ALIGNMENT_MATRIX = {
    'Advisor': { 'Passive': 'mismatch', 'Exploratory': 'mismatch', 'Active': 'aligned' },
    'Navigator': { 'Passive': 'mismatch', 'Exploratory': 'mismatch', 'Active': 'aligned' },
    'Coach': { 'Passive': 'mismatch', 'Exploratory': 'mismatch', 'Active': 'aligned' },
    'Reflective Partner': { 'Passive': 'mismatch', 'Exploratory': 'aligned', 'Active': 'mismatch' },
    'Listener': { 'Passive': 'aligned', 'Exploratory': 'mismatch', 'Active': 'mismatch' },
    'Companion': { 'Passive': 'aligned', 'Exploratory': 'aligned', 'Active': 'mismatch' }
  };

  const isMismatch = (role, stance) => {
    return ALIGNMENT_MATRIX[role]?.[stance] === 'mismatch';
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Sequence {sequence.id}</h2>
        <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
          Step {step} of 3
        </span>
      </div>

      {/* --- STEP 1: SEEKER ONLY --- */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-xs font-bold text-blue-600 uppercase mb-2">Seeker Context</p>
            {sequence.turns.filter(t => t.speaker === 'seeker').map(t => (
              <p key={t.id} className="text-slate-700 italic">"{t.text}"</p>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Q1: What is the User Stance?
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Passive', 'Exploratory', 'Active'].map(s => (
                <button
                  key={s}
                  onClick={() => setFormData({...formData, user_stance: s})}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.user_stance === s 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!formData.user_stance}
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50"
          >
            Reveal AI Response
          </button>
        </div>
      )}

      {/* --- STEP 2: AI REVEAL --- */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-400">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-2">AI Response</p>
            {sequence.turns.filter(t => t.speaker === 'supporter').map(t => (
              <p key={t.id} className="text-slate-800 font-medium">"{t.text}"</p>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">D2 Care Role</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-lg"
              value={formData.primary_d2_role}
              onChange={(e) => setFormData({...formData, primary_d2_role: e.target.value})}
            >
              <option value="">Select a role...</option>
              {Object.keys(ALIGNMENT_MATRIX).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex gap-4">
            <button onClick={handleBack} className="flex-1 py-3 border border-slate-200 rounded-lg">Back</button>
            <button 
              disabled={!formData.primary_d2_role} 
              onClick={handleNext} 
              className="flex-[2] py-3 bg-blue-600 text-white rounded-lg font-bold"
            >
              Final Review
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: MISMATCH & PARADOX --- */}
      {step === 3 && (
        <div className="space-y-6">
          {isMismatch(formData.primary_d2_role, formData.user_stance) && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-amber-800 font-bold mb-1">⚠️ Stance Mismatch Detected</p>
              <p className="text-sm text-amber-700">
                AI acted as {formData.primary_d2_role} while User was {formData.user_stance}. 
                Please explain why this role was chosen in the notes.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
            <input 
              type="checkbox" 
              checked={formData.paradox_flag}
              onChange={(e) => setFormData({...formData, paradox_flag: e.target.checked})}
              className="w-5 h-5"
            />
            <label className="font-bold text-slate-700">Flag as Authority-Agency Paradox</label>
          </div>

          <textarea 
            placeholder="Coding rationale / notes..."
            className="w-full p-3 border border-slate-200 rounded-lg h-32"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />

          <div className="flex gap-4">
            <button onClick={handleBack} className="flex-1 py-3 border border-slate-200 rounded-lg">Back</button>
            <button 
              onClick={() => onSave(formData)}
              className="flex-[2] py-3 bg-slate-900 text-white rounded-lg font-bold"
            >
              Save Annotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerFirstForm;
