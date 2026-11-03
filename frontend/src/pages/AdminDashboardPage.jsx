import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Star, 
  RefreshCw, 
  Lock,
  Layers,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage({ user, t }) {
  const [metrics, setMetrics] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/metrics').then(r => r.json()),
      fetch('/api/feedback').then(r => r.json())
    ]).then(([m, f]) => {
      setMetrics(m);
      setFeedbacks(f.feedback || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 my-12">
        <Lock className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Authorization Required</h2>
        <p className="text-xs text-slate-600">
          This portal is reserved for ICAR Agricultural Researchers & System Administrators. Switch role to "Demo Agri-Admin" from the top navigation profile menu to inspect.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrative Telemetry & Model Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.adminDashboard}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Production machine learning models, system datasets, farmer feedback reviews, and security audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-emerald-700">Cluster Status: Healthy (99.98%)</span>
        </div>
      </div>

      {metrics && (
        <div className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Users</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{metrics.kpis.total_users}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Farmers & Agronomists</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Registered Farms</span>
              <p className="text-3xl font-black text-emerald-600 mt-1">{metrics.kpis.registered_farms}</p>
              <span className="text-[11px] text-slate-500">Active Field Plots</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Predictions</span>
              <p className="text-3xl font-black text-amber-500 mt-1">{metrics.kpis.total_predictions}</p>
              <span className="text-[11px] text-slate-500">Processed Inferences</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Farmer Rating</span>
              <p className="text-3xl font-black text-yellow-500 mt-1 flex items-baseline gap-1">
                {metrics.kpis.avg_farmer_rating} <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 inline" />
              </p>
              <span className="text-[11px] text-slate-500">Verified User Reviews</span>
            </div>
          </div>

          {/* Machine Learning Model Registry */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Production Model Registry & Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metrics.model_registry.map((model, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{model.name}</h4>
                      <p className="text-[11px] text-slate-500">{model.type}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {model.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs pt-2 border-t border-slate-200 text-slate-700">
                    {model.accuracy && <p>• <strong>Accuracy:</strong> <span className="text-emerald-700 font-bold">{model.accuracy}</span></p>}
                    {model.r2_score && <p>• <strong>R² Score:</strong> <span className="text-amber-700 font-bold">{model.r2_score}</span></p>}
                    {model.rmse && <p>• <strong>RMSE:</strong> {model.rmse}</p>}
                    {model.dataset_size && <p>• <strong>Dataset:</strong> {model.dataset_size}</p>}
                    <p className="text-[10px] text-slate-400 pt-1">Retrained: {model.last_retrained}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Feedback Inbox */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Farmer Feedback & Quality Assurance Log
            </h3>

            <div className="divide-y divide-slate-100">
              {feedbacks.map((f) => (
                <div key={f.id} className="py-3.5 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{f.user_name} ({f.category})</span>
                    <span className="text-amber-500 font-bold flex items-center gap-1">
                      {f.rating} <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{f.comments}</p>
                  <span className="text-[10px] text-slate-400">{f.created_at.split('T')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              System & Model Audit Trail
            </h3>

            <div className="space-y-2 text-xs">
              {metrics.audit_logs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-800 uppercase mr-2">{log.action}</span>
                    <span className="text-slate-700">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp.split('T')[0]}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
