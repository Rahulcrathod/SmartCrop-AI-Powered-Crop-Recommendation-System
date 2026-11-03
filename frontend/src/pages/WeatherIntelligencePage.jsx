import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  RefreshCw,
  Sun
} from 'lucide-react';

export default function WeatherIntelligencePage({ t }) {
  const [selectedRegion, setSelectedRegion] = useState("punjab");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const regions = [
    { id: "punjab", name: "Punjab (Ludhiana)" },
    { id: "maharashtra", name: "Maharashtra (Pune)" },
    { id: "karnataka", name: "Karnataka (Bengaluru)" },
    { id: "telangana", name: "Telangana (Hyderabad)" },
    { id: "uttar_pradesh", name: "Uttar Pradesh (Varanasi)" },
    { id: "gujarat", name: "Gujarat (Anand)" },
    { id: "tamil_nadu", name: "Tamil Nadu (Coimbatore)" },
    { id: "west_bengal", name: "West Bengal (Kolkata)" }
  ];

  const fetchWeather = async (regionId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather/current?region=${regionId}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedRegion);
  }, [selectedRegion]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            Agro-Meteorological Forecast Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.weather} Intelligence & Decision Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Location-specific 7-day forecast, spraying suitability windows, and weather-driven fungal risk alerts.
          </p>
        </div>

        {/* Region Dropdown */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Fetching agro-climatic readings...</span>
        </div>
      )}

      {weatherData && !loading && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Current Conditions Card */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-8 border border-sky-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-sky-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {weatherData.location}
              </span>
              <div className="flex items-baseline gap-4">
                <h2 className="text-4xl sm:text-5xl font-black">
                  {weatherData.current.temperature_c}°C
                </h2>
                <span className="text-lg text-slate-300 font-semibold">
                  {weatherData.current.condition}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Source: {weatherData.source} • Synced for farm field operations
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center min-w-[300px]">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Humidity</span>
                <p className="text-base font-bold text-white">{weatherData.current.humidity_pct}%</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <Wind className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Wind</span>
                <p className="text-base font-bold text-white">{weatherData.current.wind_speed_kmh} km/h</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <CloudSun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">Precipitation</span>
                <p className="text-base font-bold text-white">{weatherData.current.precipitation_mm} mm</p>
              </div>
            </div>
          </div>

          {/* Agricultural Action Advisories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Spray Window */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                weatherData.advisories.spray_badge === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {weatherData.advisories.spray_index}
              </span>
              <h4 className="font-bold text-sm text-slate-800">Foliar Spraying Window</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherData.advisories.spray_advisory}
              </p>
            </div>

            {/* Disease Risk */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {weatherData.advisories.disease_outbreak_risk}
              </span>
              <h4 className="font-bold text-sm text-slate-800">Fungal Pathogen Risk</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherData.advisories.disease_advisory}
              </p>
            </div>

            {/* Harvest Window */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Harvest Advisory
              </span>
              <h4 className="font-bold text-sm text-slate-800">Field Harvest Feasibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weatherData.advisories.harvest_advisory}
              </p>
            </div>

          </div>

          {/* 7-Day Forecast Row */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              7-Day Agricultural Field Outlook
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.forecast_7d.map((day, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs font-bold text-slate-700">{day.day}</span>
                  <p className="text-[11px] text-slate-500">{day.condition}</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {day.temp_max}° <span className="text-xs font-normal text-slate-400">/ {day.temp_min}°</span>
                  </p>
                  <div className="text-[10px] text-sky-600 font-semibold pt-1">
                    💧 {day.rain_prob}% rain
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
