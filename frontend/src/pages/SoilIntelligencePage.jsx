import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Droplet
} from 'lucide-react';

export default function SoilIntelligencePage({ lastPrediction, t }) {
  const [soilInputs, setSoilInputs] = useState({
    n: lastPrediction ? lastPrediction.inputs.N : 85,
    p: lastPrediction ? lastPrediction.inputs.P : 48,
    k: lastPrediction ? lastPrediction.inputs.K : 40,
    ph: lastPrediction ? lastPrediction.inputs.ph : 6.5,
    moisture: 48.0,
    organic_carbon: 0.65
  });

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const fetchSoilAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/soil/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(soilInputs)
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilAnalysis();
  }, []);

  const handleUpdateParam = (field, val) => {
    setSoilInputs(p => ({ ...p, [field]: parseFloat(val) || 0 }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            Nutrient Assay & Soil Conditioning Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.soilIntelligence} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time evaluation of soil fertility index, macronutrient reserves, and corrective chemical/organic amendments.
          </p>
        </div>

        <button
          onClick={fetchSoilAnalysis}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Soil Health
        </button>
      </div>

      {/* Input Sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Adjust Soil Test Parameters
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">Nitrogen (N)</label>
            <input
              type="number"
              value={soilInputs.n}
              onChange={(e) => handleUpdateParam('n', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Phosphorus (P)</label>
            <input
              type="number"
              value={soilInputs.p}
              onChange={(e) => handleUpdateParam('p', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Potassium (K)</label>
            <input
              type="number"
              value={soilInputs.k}
              onChange={(e) => handleUpdateParam('k', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Soil pH</label>
            <input
              type="number"
              step="0.1"
              value={soilInputs.ph}
              onChange={(e) => handleUpdateParam('ph', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Moisture (%)</label>
            <input
              type="number"
              value={soilInputs.moisture}
              onChange={(e) => handleUpdateParam('moisture', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600">Org. Carbon (%)</label>
            <input
              type="number"
              step="0.05"
              value={soilInputs.organic_carbon}
              onChange={(e) => handleUpdateParam('organic_carbon', e.target.value)}
              className="mt-1 w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Analysis Output */}
      {analysis && (
        <div className="space-y-6">
          
          {/* Health Score Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Overall Soil Fertility Index
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
                {analysis.overall_health_score} / 100
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  {analysis.health_tier}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Classification: <strong>{analysis.soil_class}</strong> • Optimal for active root nutrient uptake
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center min-w-[240px]">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Soil pH Index</span>
                <p className="text-lg font-black text-amber-300">{analysis.parameters.ph.value}</p>
                <p className="text-[10px] text-emerald-400">{analysis.parameters.ph.status}</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Volumetric Moisture</span>
                <p className="text-lg font-black text-sky-400">{analysis.parameters.moisture.value}%</p>
                <p className="text-[10px] text-slate-400">{analysis.parameters.moisture.status}</p>
              </div>
            </div>
          </div>

          {/* Parameter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['nitrogen', 'phosphorus', 'potassium'].map((key) => {
              const p = analysis.parameters[key];
              return (
                <div key={key} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-800 uppercase">{key}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900">
                    {p.value} <span className="text-xs font-normal text-slate-500">{p.unit}</span>
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                    {p.action}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Corrective Amendments List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Agronomic Soil Conditioning Protocol
            </h3>
            <div className="space-y-2.5">
              {analysis.actionable_recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
