import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  FlaskConical, 
  CloudRain, 
  Thermometer, 
  Droplet, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  RefreshCw,
  TrendingUp,
  Volume2,
  AlertCircle
} from 'lucide-react';
import VoiceInputButton, { ReadAloudButton } from '../components/VoiceInputButton';

export default function CropRecommendationPage({ setCurrentPage, setLastPrediction, t }) {
  const [formData, setFormData] = useState({
    n: 85,
    p: 48,
    k: 40,
    temperature: 25.0,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 220.0,
    soil_type: "Alluvial Loam",
    season: "Kharif (Monsoon)",
    location: "Ludhiana, Punjab"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const regionalPresets = [
    {
      name: "Punjab Rice Belt",
      desc: "High N, high rainfall & humidity",
      data: { n: 85, p: 48, k: 40, temperature: 25.0, humidity: 82.0, ph: 6.5, rainfall: 220.0, soil_type: "Alluvial Loam", season: "Kharif", location: "Ludhiana, Punjab" }
    },
    {
      name: "Maharashtra Vidarbha Cotton",
      desc: "High N, moderate rain, black clay",
      data: { n: 120, p: 45, k: 20, temperature: 25.5, humidity: 78.0, ph: 7.2, rainfall: 80.0, soil_type: "Black Cotton Soil", season: "Kharif", location: "Nagpur, Maharashtra" }
    },
    {
      name: "Rajasthan Arid Chickpea",
      desc: "Low N, high K, low humidity & rain",
      data: { n: 35, p: 68, k: 80, temperature: 19.5, humidity: 17.0, ph: 7.5, rainfall: 75.0, soil_type: "Sandy Arid Soil", season: "Rabi", location: "Bikaner, Rajasthan" }
    },
    {
      name: "Karnataka Coorg Plantation",
      desc: "Slightly acidic loam, hill climate",
      data: { n: 95, p: 30, k: 32, temperature: 24.5, humidity: 68.0, ph: 6.2, rainfall: 160.0, soil_type: "Red Laterite Soil", season: "Rabi", location: "Coorg, Karnataka" }
    },
    {
      name: "Kerala Banana Garden",
      desc: "High NPK, tropical warm climate",
      data: { n: 105, p: 82, k: 50, temperature: 27.5, humidity: 80.0, ph: 6.0, rainfall: 110.0, soil_type: "Coastal Alluvium", season: "Zaid/Summer", location: "Thrissur, Kerala" }
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(value) || value }));
  };

  const handleLoadPreset = (preset) => {
    setFormData(preset.data);
    setResult(null);
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/predict/crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Failed to generate recommendation");
      const data = await res.json();
      setResult(data);
      if (setLastPrediction) setLastPrediction(data);
    } catch (err) {
      setError(err.message || "An error occurred during prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            Random Forest Crop Recommendation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.cropRecommendation}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Input soil nutrient assay and local environmental data to evaluate crop suitability across 22 verified varieties.
          </p>
        </div>

        {/* Quick Voice Prompt Helper */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <VoiceInputButton 
            onSpeechResult={(spokenText) => {
              // Attempt to parse numbers from spoken text
              const nums = spokenText.match(/\d+(\.\d+)?/g);
              if (nums && nums.length >= 1) {
                alert(`Voice detected: "${spokenText}". Tip: You can adjust numeric sliders directly.`);
              }
            }} 
          />
          <div className="text-xs">
            <p className="font-semibold text-slate-800">Voice Assistant Ready</p>
            <p className="text-slate-500 text-[11px]">Click mic to dictate values</p>
          </div>
        </div>
      </div>

      {/* Preset Region Shortcuts */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t.quickPresets} (1-Click Test Scenarios)
          </span>
          <span className="text-[11px] text-slate-400">Click any preset to fill form</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {regionalPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 transition group"
            >
              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                {preset.name}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & Parameters */}
      <form onSubmit={handlePredict} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Soil Nutrients Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{t.soilNutrients}</h3>
                <p className="text-[11px] text-slate-500">From lab soil health card (kg/ha)</p>
              </div>
            </div>

            {/* Nitrogen */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.nitrogen}</label>
                <span className="text-emerald-700 font-bold">{formData.n} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="160"
                step="1"
                value={formData.n}
                onChange={(e) => handleInputChange('n', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 (Deficient)</span>
                <span>80 (Optimal)</span>
                <span>160 (High)</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.phosphorus}</label>
                <span className="text-emerald-700 font-bold">{formData.p} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="1"
                value={formData.p}
                onChange={(e) => handleInputChange('p', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span>50</span>
                <span>150</span>
              </div>
            </div>

            {/* Potassium */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.potassium}</label>
                <span className="text-emerald-700 font-bold">{formData.k} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="210"
                step="1"
                value={formData.k}
                onChange={(e) => handleInputChange('k', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span>100</span>
                <span>210</span>
              </div>
            </div>

            {/* Soil pH */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.ph}</label>
                <span className="text-emerald-700 font-bold">{formData.ph}</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="9.5"
                step="0.1"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3.5 (Acidic)</span>
                <span>6.5 - 7.5 (Neutral)</span>
                <span>9.5 (Alkaline)</span>
              </div>
            </div>

          </div>

          {/* Environmental Conditions Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{t.environmentalFactors}</h3>
                <p className="text-[11px] text-slate-500">Local climatic conditions during growing cycle</p>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.temperature}</label>
                <span className="text-sky-700 font-bold">{formData.temperature} °C</span>
              </div>
              <input
                type="range"
                min="8"
                max="45"
                step="0.5"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>8°C (Cool)</span>
                <span>25°C (Mild)</span>
                <span>45°C (Warm)</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.humidity}</label>
                <span className="text-sky-700 font-bold">{formData.humidity} %</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={formData.humidity}
                onChange={(e) => handleInputChange('humidity', e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Dry Arid)</span>
                <span>60% (Moderate)</span>
                <span>100% (Tropical)</span>
              </div>
            </div>

            {/* Rainfall */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <label>{t.rainfall}</label>
                <span className="text-sky-700 font-bold">{formData.rainfall} mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="320"
                step="5"
                value={formData.rainfall}
                onChange={(e) => handleInputChange('rainfall', e.target.value)}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20 mm (Arid)</span>
                <span>150 mm (Monsoon)</span>
                <span>320 mm (Submerged)</span>
              </div>
            </div>

            {/* Farm Context metadata */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Soil Type</label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => handleInputChange('soil_type', e.target.value)}
                  className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 border focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Laterite Soil">Red Laterite Soil</option>
                  <option value="Sandy Arid Soil">Sandy Arid Soil</option>
                  <option value="Clayey Loam">Clayey Loam</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  className="w-full text-xs rounded-lg border-slate-300 bg-slate-50 p-2 border focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                  <option value="Rabi (Winter)">Rabi (Winter)</option>
                  <option value="Zaid / Summer">Zaid / Summer</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Submit Prediction Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-base shadow-xl shadow-emerald-900/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Random Forest Decision Trees...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.predictCrop}</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 max-w-lg mx-auto shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

      </form>

      {/* Prediction Output & Explainable AI Summary */}
      {result && (
        <div className="rounded-3xl bg-white border border-emerald-500/40 shadow-xl overflow-hidden animate-fadeIn">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Validated Decision Output
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold capitalize flex items-center gap-3">
                {result.recommended_crop}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                  Rank 1
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                {result.explanation_summary}
              </p>
            </div>

            {/* Validated Confidence Metric Box */}
            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-700/50 text-center min-w-[160px] space-y-1">
              <p className="text-xs text-slate-300 font-medium">Model Probability</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-300">
                {result.confidence_percentage}%
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold">
                Random Forest Verified
              </p>
              <div className="pt-2">
                <ReadAloudButton textToRead={`SmartCrop AI recommends ${result.recommended_crop} with ${result.confidence_percentage}% model confidence. ${result.explanation_summary}`} />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Top 3 Alternative Candidates */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                Crop Suitability Ranking (Top Candidates)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {result.candidates.map((c, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border ${
                      i === 0 
                        ? 'bg-emerald-50 border-emerald-300' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 capitalize text-sm">
                        #{i + 1} {c.crop}
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        {c.match_percent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${i === 0 ? 'bg-emerald-600' : 'bg-slate-400'}`} 
                        style={{ width: `${c.match_percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Contributions Grid (XAI) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Feature Alignment & Biological Envelope Match
                </h3>
                <span className="text-xs text-slate-500">
                  Primary factor: <strong className="text-emerald-700 uppercase">{result.top_driving_factor}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.feature_contributions.map((fc, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase">{fc.feature}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        fc.alignment_status === 'Optimal' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : (fc.alignment_status === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')
                      }`}>
                        {fc.alignment_status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Your input: <strong>{fc.user_value}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Ideal range: [{fc.ideal_range[0]} - {fc.ideal_range[1]}]
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Next-Action Bridges */}
            <div className="border-t border-slate-200 pt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-600">
                Ready to take agricultural action with this recommendation?
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage('yield')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Estimate Harvest Yield for <span className="capitalize">{result.recommended_crop}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage('fertilizer')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  Calculate Fertilizer Dose
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage('xai')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Detailed XAI Breakdown
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
