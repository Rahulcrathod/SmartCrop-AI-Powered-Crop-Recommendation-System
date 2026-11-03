import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  RefreshCw,
  Gauge
} from 'lucide-react';

export default function IrrigationAdvisorPage({ t }) {
  const [inputs, setInputs] = useState({
    crop_name: "Rice",
    growth_stage: "vegetative",
    soil_moisture_pct: 38.0,
    temp_c: 28.0,
    rainfall_forecast_mm: 5.0
  });

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advisor/irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      if (res.ok) {
        const data = await res.json();
        setAdvice(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <Droplets className="w-3.5 h-3.5" />
            FAO-56 Penman-Monteith Crop Evapotranspiration Advisor
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.irrigationAdvisor} & Water Budgeting
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Combines dynamic crop growth stage coefficient (Kc), volumetric soil moisture, and rainfall forecast to prevent over-irrigation.
          </p>
        </div>

        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-md transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Water Demand
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Field Water Balance Inputs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600">Crop</label>
            <select
              value={inputs.crop_name}
              onChange={(e) => setInputs(p => ({ ...p, crop_name: e.target.value }))}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            >
              <option value="Rice">Rice (Paddy)</option>
              <option value="Maize">Maize (Corn)</option>
              <option value="Cotton">Cotton</option>
              <option value="Wheat">Wheat</option>
              <option value="Banana">Banana</option>
              <option value="Tomato">Tomato</option>
              <option value="Chickpea">Chickpea</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Growth Stage</label>
            <select
              value={inputs.growth_stage}
              onChange={(e) => setInputs(p => ({ ...p, growth_stage: e.target.value }))}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            >
              <option value="germination">Germination / Seeding</option>
              <option value="vegetative">Vegetative (Tillering/Branching)</option>
              <option value="flowering">Flowering / Heading (Peak Kc)</option>
              <option value="grain_filling">Grain Filling / Fruit Setting</option>
              <option value="maturity">Maturity / Ripening</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Soil Moisture (%)</label>
            <input
              type="number"
              value={inputs.soil_moisture_pct}
              onChange={(e) => setInputs(p => ({ ...p, soil_moisture_pct: parseFloat(e.target.value) || 0 }))}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Day Temperature (°C)</label>
            <input
              type="number"
              value={inputs.temp_c}
              onChange={(e) => setInputs(p => ({ ...p, temp_c: parseFloat(e.target.value) || 0 }))}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600">Rainfall Forecast (mm)</label>
            <input
              type="number"
              value={inputs.rainfall_forecast_mm}
              onChange={(e) => setInputs(p => ({ ...p, rainfall_forecast_mm: parseFloat(e.target.value) || 0 }))}
              className="mt-1 w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Advisory Output */}
      {advice && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 border border-sky-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full inline-block ${
                advice.urgency === 'High' ? 'bg-red-500/30 text-red-300 border border-red-500/40' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}>
                Urgency: {advice.urgency}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                {advice.status}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {advice.action_advisory}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center min-w-[260px]">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Net Deficit</span>
                <p className="text-xl font-black text-sky-400">{advice.net_water_deficit_mm_day} mm/d</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Volume / Acre</span>
                <p className="text-xl font-black text-amber-300">{(advice.daily_volume_liters_acre).toLocaleString()} L</p>
              </div>
            </div>
          </div>

          {/* Irrigation Method Runtimes */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              System Run-Time Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advice.irrigation_methods.map((im, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{im.method}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {im.efficiency}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black text-slate-900">{im.runtime_hours}</span>
                    <span className="text-xs text-slate-500">hours recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Calculated for standard flow emitter delivery rate.
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
