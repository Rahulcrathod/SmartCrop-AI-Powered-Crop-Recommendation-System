import React from 'react';
import { 
  Layers, 
  HelpCircle, 
  BarChart3, 
  CheckCircle2, 
  Info, 
  Sliders, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { ReadAloudButton } from '../components/VoiceInputButton';

export default function ExplainableAiPage({ lastPrediction, setCurrentPage, t }) {
  // Use last prediction if available, else standard demo state
  const demoXai = {
    recommended_crop: "rice",
    confidence_percentage: 94.2,
    top_driving_factor: "rainfall",
    explanation_summary: "Rice was selected with 94.2% model confidence because high rainfall (220mm) and high relative humidity (82%) strongly meet its wetland vegetative envelope, providing significant physiological advantage over Maize and Chickpea.",
    detailed_reasons: [
      "Rainfall (220 mm) matches the high moisture requirement of wetland paddy.",
      "Relative Humidity (82%) ensures optimal stomatal conductance without excessive transpirational shock.",
      "Soil Nitrogen (85 kg/ha) satisfies early tillering demand.",
      "Soil pH (6.5) falls squarely within the slightly acidic to neutral range where phosphorus availability is maximized."
    ],
    feature_contributions: [
      { feature: "rainfall", user_value: 220, ideal_range: [180, 300], alignment_status: "Optimal", impact_score: 24.5 },
      { feature: "humidity", user_value: 82, ideal_range: [80, 85], alignment_status: "Optimal", impact_score: 21.0 },
      { feature: "N", user_value: 85, ideal_range: [60, 100], alignment_status: "Optimal", impact_score: 18.2 },
      { feature: "temperature", user_value: 25.0, ideal_range: [20, 27], alignment_status: "Optimal", impact_score: 14.8 },
      { feature: "ph", user_value: 6.5, ideal_range: [5.0, 7.0], alignment_status: "Optimal", impact_score: 11.5 },
      { feature: "P", user_value: 48, ideal_range: [35, 60], alignment_status: "Optimal", impact_score: 9.8 },
      { feature: "K", user_value: 40, ideal_range: [35, 45], alignment_status: "Optimal", impact_score: 8.5 }
    ],
    global_importance: {
      "rainfall": 0.224,
      "humidity": 0.186,
      "N": 0.165,
      "P": 0.142,
      "K": 0.121,
      "temperature": 0.092,
      "ph": 0.070
    }
  };

  const xaiData = lastPrediction || demoXai;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            Explainable AI (XAI) & SHAP-Style Attributions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.explainableAi} & Decision Transparency
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Understand how our Random Forest decision trees evaluated your soil and climate metrics to reach the crop recommendation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReadAloudButton textToRead={xaiData.explanation_summary} />
          {!lastPrediction && (
            <button
              onClick={() => setCurrentPage('recommendation')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
            >
              Run Your Own Soil Test
            </button>
          )}
        </div>
      </div>

      {/* Summary Decision Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white border border-emerald-800/40 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Model Decision Justification
          </span>
          <span className="text-xs bg-emerald-800/80 px-2.5 py-0.5 rounded-full capitalize font-semibold text-emerald-200">
            Target: {xaiData.recommended_crop} ({xaiData.confidence_percentage}%)
          </span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-slate-200">
          {xaiData.explanation_summary}
        </p>

        <div className="pt-2 border-t border-slate-800/80">
          <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
            Key Biological Arguments
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {xaiData.detailed_reasons?.map((r, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Local Feature Impact Chart (SHAP Waterfall Style) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Local Feature Contribution Impact Score
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Positive impact signifies parameters aligning within the optimal biological band for this crop.
          </p>
        </div>

        <div className="space-y-3.5">
          {xaiData.feature_contributions.map((fc, i) => {
            const width = Math.min(100, Math.max(15, fc.impact_score * 3.5));
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 uppercase flex items-center gap-2">
                    {fc.feature}
                    <span className="text-[11px] font-normal text-slate-500">
                      (Input: {fc.user_value} | Ideal: [{fc.ideal_range[0]} - {fc.ideal_range[1]}])
                    </span>
                  </span>
                  <span className="font-bold text-emerald-700">+{fc.impact_score} pts</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full" 
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Model Feature Importances (Trained Random Forest Weights) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Global Random Forest Feature Importances
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized Gini impurity reduction across all 100 decision trees in the classifier.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(xaiData.global_importance || {}).map(([feat, imp]) => (
            <div key={feat} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">{feat}</span>
              <p className="text-base font-black text-slate-800 mt-1">{(imp * 100).toFixed(1)}%</p>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full" 
                  style={{ width: `${imp * 350}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
