import React, { useState, useEffect } from 'react';
import { 
  Droplet, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Leaf, 
  Layers, 
  RefreshCw,
  Wheat
} from 'lucide-react';

export default function FertilizerAdvisorPage({ lastPrediction, t }) {
  const [targetCrop, setTargetCrop] = useState(lastPrediction ? lastPrediction.recommended_crop : "rice");
  const [areaAcres, setAreaAcres] = useState(5.0);
  const [soilN, setSoilN] = useState(lastPrediction ? lastPrediction.inputs.N : 85);
  const [soilP, setSoilP] = useState(lastPrediction ? lastPrediction.inputs.P : 48);
  const [soilK, setSoilK] = useState(lastPrediction ? lastPrediction.inputs.K : 40);

  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);

  const crops = ["rice", "maize", "cotton", "wheat", "banana", "chickpea", "tomato", "potato", "sugarcane"];

  const fetchGuidance = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/fertilizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_crop: targetCrop,
          n: soilN,
          p: soilP,
          k: soilK,
          area_acres: areaAcres
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGuidance(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, [targetCrop, areaAcres]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Wheat className="w-3.5 h-3.5" />
            Nutrient Balancing & Fertilizer Dosing Protocol
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.fertilizerAdvisor} & Soil Deficit Balancer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Calculates commercial fertilizer dosage (Urea, DAP, MOP) based on crop uptake demand and soil test reserves.
          </p>
        </div>

        <button
          onClick={fetchGuidance}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Dosage
        </button>
      </div>

      {/* Inputs Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Target Field & Nutrient Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">Target Crop</label>
            <select
              value={targetCrop}
              onChange={(e) => setTargetCrop(e.target.value)}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold capitalize"
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Farm Area (Acres)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={areaAcres}
              onChange={(e) => setAreaAcres(parseFloat(e.target.value) || 1.0)}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Soil N (kg/ha)</label>
            <input
              type="number"
              value={soilN}
              onChange={(e) => setSoilN(parseFloat(e.target.value) || 0)}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Soil P (kg/ha)</label>
            <input
              type="number"
              value={soilP}
              onChange={(e) => setSoilP(parseFloat(e.target.value) || 0)}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Soil K (kg/ha)</label>
            <input
              type="number"
              value={soilK}
              onChange={(e) => setSoilK(parseFloat(e.target.value) || 0)}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Recommendation Results */}
      {guidance && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Banner Totals */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-300">
                  Total Commercial Requirements
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  Balanced Prescription for {guidance.farm_area_acres} Acres {guidance.crop}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Deficit accounted: N (-{guidance.nutrient_deficits_kg_ha.N} kg), P (-{guidance.nutrient_deficits_kg_ha.P} kg), K (-{guidance.nutrient_deficits_kg_ha.K} kg)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center min-w-[320px]">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Urea (46% N)</span>
                  <p className="text-xl font-black text-amber-300">{guidance.fertilizer_recommendation.urea_total_kg} kg</p>
                  <p className="text-[10px] text-slate-400">~{(guidance.fertilizer_recommendation.urea_total_kg / 45).toFixed(1)} bags</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">DAP (18-46-0)</span>
                  <p className="text-xl font-black text-emerald-400">{guidance.fertilizer_recommendation.dap_total_kg} kg</p>
                  <p className="text-[10px] text-slate-400">~{(guidance.fertilizer_recommendation.dap_total_kg / 50).toFixed(1)} bags</p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">MOP (60% K2O)</span>
                  <p className="text-xl font-black text-sky-400">{guidance.fertilizer_recommendation.mop_total_kg} kg</p>
                  <p className="text-[10px] text-slate-400">~{(guidance.fertilizer_recommendation.mop_total_kg / 50).toFixed(1)} bags</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Stage Application Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Stage-Wise Split Application Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guidance.application_schedule.map((stage, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-800 text-xs">{stage.stage}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {stage.timing}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 pt-1">
                    <p>• <strong>DAP:</strong> {stage.dap_amount_kg} kg ({stage.dap_percent})</p>
                    <p>• <strong>Urea:</strong> {stage.urea_amount_kg} kg ({stage.urea_percent})</p>
                    <p>• <strong>MOP:</strong> {stage.mop_amount_kg} kg ({stage.mop_percent})</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                    {stage.instructions}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Organic Alternatives */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Integrated Nutrient Management & Organic Substitutes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {guidance.organic_alternatives.map((alt, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{alt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
