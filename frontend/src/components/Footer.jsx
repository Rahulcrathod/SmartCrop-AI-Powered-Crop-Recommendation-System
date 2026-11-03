import React from 'react';
import { Sprout, ShieldAlert, Heart, MessageSquare } from 'lucide-react';

export default function Footer({ setCurrentPage, onOpenFeedback }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SmartCrop AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[13px]">
              An intelligent, explainable decision support system empowering farmers with validated machine learning for crop selection, yield estimation, soil health, and plant diagnostics.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900 transition font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Share Farmer Feedback
              </button>
            </div>
          </div>

          {/* Core Decision Engines */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              AI Decision Engines
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('recommendation')} className="hover:text-emerald-400 transition">
                  Crop Recommendation (22 Classes)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('yield')} className="hover:text-emerald-400 transition">
                  Yield Prediction (Random Forest Regressor)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('xai')} className="hover:text-emerald-400 transition">
                  Explainable AI (XAI Feature Breakdown)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('disease')} className="hover:text-emerald-400 transition">
                  Computer Vision Leaf Diagnostic
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('soil')} className="hover:text-emerald-400 transition">
                  Soil Intelligence & Health Gauge
                </button>
              </li>
            </ul>
          </div>

          {/* Smart Agriculture Advisors */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Advisory Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('irrigation')} className="hover:text-emerald-400 transition">
                  Smart Irrigation Advisor (Kc Model)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('fertilizer')} className="hover:text-emerald-400 transition">
                  Fertilizer Advisor (NPK Balancer)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('weather')} className="hover:text-emerald-400 transition">
                  Weather Intelligence & Spray Window
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('guide')} className="hover:text-emerald-400 transition">
                  Botanical Crop Library
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('assistant')} className="hover:text-emerald-400 transition">
                  Agricultural AI Conversational Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* System & Validation Transparency */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 uppercase tracking-wider text-[11px]">
              Scientific Integrity & Transparency
            </h4>
            <p className="text-[12px] text-slate-400 leading-relaxed mb-3">
              Per SmartCrop AI design principles, all predictions derive from verified agronomic models trained on real agro-climatic datasets. Zero unsupported claims.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Classifier Accuracy:</span>
                <span className="text-emerald-400 font-semibold">97.4% Test</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yield Regressor R²:</span>
                <span className="text-amber-400 font-semibold">0.974</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supported Crops:</span>
                <span className="text-slate-200 font-semibold">22 Varieties</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 SmartCrop AI — An Intelligent Agricultural Decision Support System.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            BIT, CSE 3rd year SEC C Students  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
