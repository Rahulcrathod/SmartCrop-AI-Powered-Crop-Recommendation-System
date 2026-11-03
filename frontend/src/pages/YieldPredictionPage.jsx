import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Wheat, 
  Droplets, 
  MapPin, 
  BarChart, 
  AlertCircle, 
  RefreshCw,
  Compass
} from 'lucide-react';
import { ReadAloudButton } from '../components/VoiceInputButton';

export default function YieldPredictionPage({ setCurrentPage, lastPrediction, t }) {
  const [formData, setFormData] = useState({
    crop_name: lastPrediction ? lastPrediction.recommended_crop : "rice",
    area_acres: 5.0,
    n: lastPrediction ? lastPrediction.inputs.N : 85.0,
    p: lastPrediction ? lastPrediction.inputs.P : 48.0,
    k: lastPrediction ? lastPrediction.inputs.K : 40.0,
    rainfall: lastPrediction ? lastPrediction.inputs.rainfall : 210.0,
    temperature: lastPrediction ? lastPrediction.inputs.temperature : 25.0,
    irrigation_type: "canal"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const supportedCrops = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "cotton",
    "banana", "mango", "grapes", "watermelon", "apple", "orange", "coffee", "jute"
  ];

  const handlePredictYield = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/predict/yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Yield estimation failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to calculate yield");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Random Forest Regressor • R² = 0.974
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.yieldPrediction} (Tonnes / Hectare)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Estimate expected agricultural yield based on crop type, acreage, irrigation efficiency, and nutrient factors.
          </p>
        </div>

        {lastPrediction && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
            <span className="font-bold">Active Recommendation:</span>
            <p className="capitalize font-semibold text-emerald-700">🌱 {lastPrediction.recommended_crop}</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handlePredictYield} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Target Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Target Crop Variety
            </label>
            <select
              value={formData.crop_name}
              onChange={(e) => setFormData(p => ({ ...p, crop_name: e.target.value }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 capitalize focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {supportedCrops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>

          {/* Farm Plot Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Farm Area (Acres)
            </label>
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.5"
              value={formData.area_acres}
              onChange={(e) => setFormData(p => ({ ...p, area_acres: parseFloat(e.target.value) || 1.0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Irrigation System */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Irrigation Method
            </label>
            <select
              value={formData.irrigation_type}
              onChange={(e) => setFormData(p => ({ ...p, irrigation_type: e.target.value }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="drip">Drip Irrigation (+25% Efficiency)</option>
              <option value="sprinkler">Micro-Sprinkler (+15% Efficiency)</option>
              <option value="canal">Canal / Furrow (Standard 1.0x)</option>
              <option value="rainfed">Rainfed / Dryland (0.8x Factor)</option>
            </select>
          </div>

          {/* Soil Nitrogen */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Soil Nitrogen (N kg/ha)
            </label>
            <input
              type="number"
              value={formData.n}
              onChange={(e) => setFormData(p => ({ ...p, n: parseFloat(e.target.value) || 0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Soil Phosphorus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Soil Phosphorus (P kg/ha)
            </label>
            <input
              type="number"
              value={formData.p}
              onChange={(e) => setFormData(p => ({ ...p, p: parseFloat(e.target.value) || 0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Soil Potassium */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Soil Potassium (K kg/ha)
            </label>
            <input
              type="number"
              value={formData.k}
              onChange={(e) => setFormData(p => ({ ...p, k: parseFloat(e.target.value) || 0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Expected Rainfall */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Seasonal Rainfall (mm)
            </label>
            <input
              type="number"
              value={formData.rainfall}
              onChange={(e) => setFormData(p => ({ ...p, rainfall: parseFloat(e.target.value) || 0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Average Temperature */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Mean Temperature (°C)
            </label>
            <input
              type="number"
              value={formData.temperature}
              onChange={(e) => setFormData(p => ({ ...p, temperature: parseFloat(e.target.value) || 0 }))}
              className="w-full text-sm rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            <span>Calculate Expected Yield</span>
          </button>
        </div>

      </form>

      {/* Yield Results Box */}
      {result && (
        <div className="bg-white rounded-3xl border border-amber-300/60 shadow-xl overflow-hidden animate-fadeIn">
          
          <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Validated Yield Estimation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold capitalize">
                {result.crop} Yield Forecast
              </h2>
              <p className="text-xs text-slate-300">
                Calculated over {result.area_acres} acres ({result.area_hectares} hectares)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-600/40 text-center min-w-[140px]">
                <p className="text-[11px] text-slate-300">Productivity</p>
                <p className="text-3xl font-black text-amber-400">
                  {result.yield_tonnes_per_hectare} <span className="text-sm font-semibold">t/ha</span>
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  {result.yield_gap_percentage >= 0 ? `+${result.yield_gap_percentage}% vs baseline` : `${result.yield_gap_percentage}% vs baseline`}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-600/40 text-center min-w-[140px]">
                <p className="text-[11px] text-slate-300">Total Harvest</p>
                <p className="text-3xl font-black text-emerald-400">
                  {result.total_yield_tonnes} <span className="text-sm font-semibold">t</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ~{(result.total_yield_tonnes * 10).toFixed(0)} Quintals
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Factors */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Agronomic Contributing Factors
              </h3>
              <div className="space-y-2">
                {result.supporting_factors.map((fac, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Benchmark Baseline</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{result.benchmark_yield_t_ha} t/ha</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Performance Status</span>
                <p className="text-xl font-bold text-emerald-700 mt-1">{result.performance_rating}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs text-slate-500">Model Reliability (R²)</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{result.model_r2_score}</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
