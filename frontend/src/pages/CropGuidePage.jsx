import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Thermometer, 
  Droplet, 
  CloudRain, 
  FlaskConical, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

export default function CropGuidePage({ setCurrentPage, t }) {
  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/crops')
      .then(res => res.json())
      .then(data => {
        if (data.crops) setCrops(data.crops);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = crops.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Agronomic Library • 22 Supported Crop Profiles
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.cropGuide} & Botanical Reference
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified biological requirements, soil tolerance thresholds, and benchmark productivity metrics for all supported agricultural crops.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crops (e.g. Rice, Cotton)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((crop) => (
          <div 
            key={crop.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-extrabold text-slate-800 capitalize">
                  🌱 {crop.name}
                </h3>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  {crop.base_yield_t_ha} t/ha base
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Temperature
                  </span>
                  <span className="font-semibold text-slate-800">{crop.optimal_temp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Droplet className="w-3.5 h-3.5 text-sky-500" /> Humidity
                  </span>
                  <span className="font-semibold text-slate-800">{crop.optimal_humidity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" /> Rainfall
                  </span>
                  <span className="font-semibold text-slate-800">{crop.optimal_rainfall}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-500" /> Soil pH
                  </span>
                  <span className="font-semibold text-slate-800">{crop.optimal_ph}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentPage('yield')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <TrendingUp className="w-3.5 h-3.5" /> Estimate Yield
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('recommendation')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Test in AI Model <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
