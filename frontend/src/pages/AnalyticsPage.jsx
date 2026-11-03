import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  FlaskConical, 
  CloudRain,
  Activity
} from 'lucide-react';

export default function AnalyticsPage({ t }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/summary')
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Decision Intelligence & System Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.analytics} & Agricultural Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Historical soil assays, crop recommendation distributions, yield trajectories, and model validation telemetry.
          </p>
        </div>
      </div>

      {summary && (
        <div className="space-y-6">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Predictions</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{summary.stats.total_predictions}</p>
              <span className="text-[11px] text-emerald-600 font-bold">100% Validated ML</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Yield Forecasts</span>
              <p className="text-3xl font-black text-amber-500 mt-1">{summary.stats.total_yield_estimates}</p>
              <span className="text-[11px] text-slate-400">Random Forest Regressor</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Disease Scans</span>
              <p className="text-3xl font-black text-rose-500 mt-1">{summary.stats.total_disease_scans}</p>
              <span className="text-[11px] text-slate-400">CV Spectral Classifier</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Classifier Accuracy</span>
              <p className="text-3xl font-black text-emerald-600 mt-1">{summary.stats.test_accuracy}</p>
              <span className="text-[11px] text-emerald-700 font-bold">22 Crop Classes</span>
            </div>
          </div>

          {/* Crop Distribution Bars */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Crop Recommendation Frequency Across Farm Queries
            </h3>

            <div className="space-y-3">
              {summary.crop_distribution.map((cd, i) => {
                const pct = Math.min(100, (cd.count / (summary.stats.total_predictions || 1)) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 capitalize">🌱 {cd.crop}</span>
                      <span className="text-slate-500 font-semibold">{cd.count} recommendations ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full" 
                        style={{ width: `${Math.max(10, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Predictions Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 overflow-x-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Recent Soil & Crop Decision Records
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Recommended Crop</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">N-P-K (kg/ha)</th>
                  <th className="py-2.5 px-3">Temp (°C)</th>
                  <th className="py-2.5 px-3">Rain (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recent_predictions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 text-slate-700">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {p.created_at.split('T')[0]}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800 capitalize">
                      {p.recommended_crop}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {(p.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {p.n} - {p.p} - {p.k}
                    </td>
                    <td className="py-2.5 px-3">
                      {p.temperature}°C
                    </td>
                    <td className="py-2.5 px-3">
                      {p.rainfall} mm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
