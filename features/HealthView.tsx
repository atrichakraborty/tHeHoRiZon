import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, FileText, HeartPulse, Stethoscope } from 'lucide-react';
import { analyzeHealthRisks } from '../services/gemini';
import { LoadingDots } from '../components/LoadingDots';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { UndoRedoToolbar } from '../components/UndoRedoToolbar';

interface RiskAnalysis {
  riskLevel: "Low" | "Moderate" | "High" | "Critical";
  riskScore: number;
  identifiedRisks: string[];
  alerts: string[];
  recommendations: string[];
  summary: string;
}

export const HealthView = () => {
  const { state: patientData, setState: setPatientData, undo, redo, canUndo, canRedo } = useUndoRedo('');
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!patientData.trim()) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const data = await analyzeHealthRisks(patientData);
      setAnalysis(data);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level?: string) => {
    switch(level) {
      case 'Low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-red-400 mb-2 flex items-center gap-2">
          <Activity className="w-8 h-8" />
          Predictive Health Monitor
        </h2>
        <p className="text-slate-400">Analyze patient vitals and history to identify risks and alert providers.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
        {/* Input Section */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <label className="block text-sm font-medium text-slate-300">Patient Data / History</label>
              </div>
              <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <textarea
              value={patientData}
              onChange={(e) => setPatientData(e.target.value)}
              placeholder="Enter vitals, symptoms, and medical history...&#10;e.g., Male 55, BP 145/95, resting HR 88, diabetic, reports shortness of breath."
              className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none mb-4 font-mono text-sm"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !patientData}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              <HeartPulse className="w-5 h-5" />
              Analyze Risks
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 overflow-y-auto relative">
           {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10 backdrop-blur-sm rounded-2xl">
              <LoadingDots />
            </div>
          )}

          {!analysis && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
              <Stethoscope className="w-16 h-16 mb-4" />
              <p>Enter patient data to begin analysis</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Score Header */}
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={analysis.riskLevel === 'Critical' ? '#f87171' : analysis.riskLevel === 'High' ? '#fb923c' : analysis.riskLevel === 'Moderate' ? '#facc15' : '#34d399'}
                      strokeWidth="3"
                      strokeDasharray={`${analysis.riskScore}, 100`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{analysis.riskScore}</span>
                    <span className="text-[10px] text-slate-400">SCORE</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Risk Level</h3>
                  <span className={`text-2xl font-bold px-3 py-1 rounded-lg border ${getRiskColor(analysis.riskLevel)}`}>
                    {analysis.riskLevel}
                  </span>
                </div>
              </div>

              {/* Alerts */}
              {analysis.alerts && analysis.alerts.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    Critical Alerts
                  </h4>
                  <ul className="space-y-2">
                    {analysis.alerts.map((alert, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-200 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Identified Risks */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-slate-300 font-semibold mb-3">Identified Factors</h4>
                  <ul className="space-y-2">
                    {analysis.identifiedRisks.map((risk, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-600" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-slate-300 font-semibold mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500/50" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <p className="text-sm text-slate-300 leading-relaxed italic">"{analysis.summary}"</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};