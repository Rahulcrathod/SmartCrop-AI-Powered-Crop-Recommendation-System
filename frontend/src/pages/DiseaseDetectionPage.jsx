import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Camera, 
  RefreshCw,
  FlaskConical,
  Activity
} from 'lucide-react';
import { ReadAloudButton } from '../components/VoiceInputButton';

export default function DiseaseDetectionPage({ t }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [samples, setSamples] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample library
  useEffect(() => {
    fetch('/api/disease/samples')
      .then(res => res.json())
      .then(data => {
        if (data.samples) setSamples(data.samples);
      })
      .catch(console.error);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedSample(null);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
    }
  };

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
  };

  const handleRunDiagnosis = async () => {
    if (!selectedFile && !selectedSample) {
      alert("Please upload a leaf photo or pick a sample leaf from the library.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (selectedSample) {
        formData.append('sample_id', selectedSample.id);
        formData.append('crop_hint', selectedSample.crop);
      }

      const res = await fetch('/api/disease/detect', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error("Diagnosis analysis failed");
      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      setError(err.message || "Failed to analyze leaf image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold mb-2">
            <Bug className="w-3.5 h-3.5" />
            Computer Vision Leaf Disease Diagnostic Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.diseaseDetection} & Pathogen Classifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Detect leaf chlorosis, necrotic lesion patterns, and fungal pustules with validated agronomic spray protocols.
          </p>
        </div>

        {diagnosis && (
          <ReadAloudButton textToRead={`SmartCrop AI detected ${diagnosis.disease_name}. Severity is ${diagnosis.severity}. Chemical remedy: ${diagnosis.chemical_treatment}`} />
        )}
      </div>

      {/* Main Upload / Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            Option 1: Upload Field Leaf Photo
          </h3>

          <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition text-center min-h-[180px]">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            {previewUrl ? (
              <div className="space-y-2">
                <img src={previewUrl} alt="Leaf Preview" className="h-32 object-contain rounded-lg mx-auto shadow" />
                <p className="text-xs text-emerald-700 font-bold">{selectedFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-500">
                <Upload className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="text-xs font-semibold">Click to browse or take photo with phone</p>
                <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP (Max 10MB)</p>
              </div>
            )}
          </label>
        </div>

        {/* Preset Sample Gallery */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Option 2: Select Standard Sample Case
          </h3>

          <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSample(s)}
                className={`text-left p-3 rounded-xl border text-xs transition ${
                  selectedSample?.id === s.id
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <p className="font-bold text-slate-800">{s.crop}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.name}</p>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                  {s.pathogen}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Run Diagnosis CTA */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleRunDiagnosis}
          disabled={loading || (!selectedFile && !selectedSample)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-red-900/20 transition disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Leaf Pixel Spectra...</span>
            </>
          ) : (
            <>
              <Bug className="w-4 h-4" />
              <span>Run Plant Disease Diagnostic</span>
            </>
          )}
        </button>
      </div>

      {/* Diagnosis Report */}
      {diagnosis && (
        <div className="rounded-3xl bg-white border border-red-300 shadow-xl overflow-hidden animate-fadeIn space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full inline-block ${
                diagnosis.severity === 'Severe' 
                  ? 'bg-red-500 text-white' 
                  : (diagnosis.severity === 'Moderate' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white')
              }`}>
                Severity: {diagnosis.severity}
              </span>
              <h2 className="text-3xl font-extrabold capitalize">
                {diagnosis.disease_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Target Crop: <strong>{diagnosis.crop}</strong> • Pathogen: <strong>{diagnosis.pathogen}</strong>
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-red-800/40 text-center min-w-[150px]">
              <span className="text-[10px] text-slate-400">Diagnosis Confidence</span>
              <p className="text-3xl font-black text-amber-300">{diagnosis.confidence_percent}%</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Validated Model</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Visual Symptoms */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Observed Leaf Symptoms</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{diagnosis.symptoms}</p>
            </div>

            {/* Treatment Protocol (Chemical & Organic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chemical Treatment */}
              <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                  Immediate Chemical Remedy
                </span>
                <h4 className="font-bold text-sm text-slate-800">Targeted Fungicide / Agrochemical</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{diagnosis.chemical_treatment}</p>
              </div>

              {/* Organic Treatment */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                  Biological & Organic Control
                </span>
                <h4 className="font-bold text-sm text-slate-800">Bio-Agent & Botanical Solution</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{diagnosis.organic_treatment}</p>
              </div>

            </div>

            {/* Prevention Protocol */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800">Long-Term Agronomic Prevention</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{diagnosis.prevention}</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
