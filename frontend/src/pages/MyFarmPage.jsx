import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Droplets, 
  CheckCircle2, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function MyFarmPage({ farms, setFarms, selectedFarmId, setSelectedFarmId, user, t }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFarm, setNewFarm] = useState({
    farm_name: "",
    location: "Punjab",
    area_acres: 5.0,
    soil_type: "Alluvial Loam",
    water_source: "Canal & Borewell",
    current_crop: "Rice",
    sowing_date: "2026-06-15",
    growth_stage: "vegetative"
  });

  const activeFarm = farms?.find(f => f.id === selectedFarmId) || farms?.[0] || {
    farm_name: "Green Valley Agro Farm",
    location: "Ludhiana, Punjab",
    area_acres: 6.5,
    soil_type: "Alluvial Loam",
    water_source: "Canal & Tube Well",
    current_crop: "Rice",
    sowing_date: "2026-06-15",
    growth_stage: "flowering"
  };

  const stages = [
    { id: "germination", label: "Germination / Seeding", days: "0 - 15" },
    { id: "vegetative", label: "Vegetative / Tillering", days: "16 - 45" },
    { id: "flowering", label: "Flowering / Panicle", days: "46 - 75" },
    { id: "grain_filling", label: "Grain Filling", days: "76 - 105" },
    { id: "maturity", label: "Harvest Maturity", days: "106 - 120" }
  ];

  const handleUpdateStage = async (stageId) => {
    try {
      await fetch(`/api/farms/${activeFarm.id}/stage?stage=${stageId}`, { method: 'PATCH' });
      setFarms(prev => prev.map(f => f.id === activeFarm.id ? { ...f, growth_stage: stageId } : f));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFarm = async (e) => {
    e.preventDefault();
    if (!newFarm.farm_name) return;

    try {
      const res = await fetch('/api/farms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFarm, user_id: user?.id || 1 })
      });
      if (res.ok) {
        const data = await res.json();
        const created = { ...newFarm, id: data.farm_id };
        setFarms(prev => [created, ...prev]);
        setSelectedFarmId(data.farm_id);
        setShowAddModal(false);
        setNewFarm({
          farm_name: "",
          location: "Punjab",
          area_acres: 5.0,
          soil_type: "Alluvial Loam",
          water_source: "Canal & Borewell",
          current_crop: "Rice",
          sowing_date: "2026-06-15",
          growth_stage: "vegetative"
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentStageIndex = stages.findIndex(s => s.id === (activeFarm.growth_stage || 'vegetative'));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5" />
            Farm Profile & Crop Phenology Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t.myFarm} & Field Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track active crop lifecycle stages, acreage, soil types, and scheduled agronomic field activities.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add New Farm Plot
        </button>
      </div>

      {/* Active Farm Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 border border-emerald-800/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-emerald-400">
              Active Plot Profile
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {activeFarm.farm_name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> {activeFarm.location} • {activeFarm.area_acres} Acres
            </p>
          </div>

          <div className="bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800 text-center min-w-[140px]">
            <span className="text-[10px] text-slate-400 uppercase">Current Crop</span>
            <p className="text-xl font-bold text-amber-300 capitalize">{activeFarm.current_crop}</p>
            <p className="text-[10px] text-emerald-400">Sown: {activeFarm.sowing_date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Soil Classification</span>
            <strong className="text-white">{activeFarm.soil_type}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Water Infrastructure</span>
            <strong className="text-white">{activeFarm.water_source}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Current Growth Stage</span>
            <strong className="text-emerald-400 capitalize">{activeFarm.growth_stage}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Harvest Window</span>
            <strong className="text-amber-300">~60 Days Remaining</strong>
          </div>
        </div>
      </div>

      {/* Crop Growth Lifecycle Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Crop Lifecycle Progression (Click stage to update)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronizes water requirements (Kc) and fertilizer schedules to current vegetative state.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleUpdateStage(stage.id)}
                className={`p-4 rounded-xl border text-left transition ${
                  isCurrent 
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300' 
                    : (isCompleted ? 'bg-slate-50 border-emerald-200 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400')
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase">Stage 0{idx + 1}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />}
                </div>
                <h4 className="font-bold text-xs text-slate-800 leading-tight">{stage.label}</h4>
                <p className="text-[10px] text-slate-500 mt-1">Day {stage.days}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Field Activity Journal */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          Recent Farm Field Journal
        </h3>

        <div className="space-y-2.5 text-xs">
          {[
            { date: "Yesterday", action: "Irrigation Logged", desc: "Applied 4.5 hours drip irrigation following SmartCrop water demand alert.", badge: "Water" },
            { date: "3 Days Ago", action: "Fertilizer Top-Dress", desc: "Top-dressed 45 kg Urea split dose at vegetative tillering stage.", badge: "Nutrient" },
            { date: "Last Week", action: "Foliar Scouting", desc: "Conducted leaf disease scouting with CV diagnostic tool; no fungal blight detected.", badge: "Protection" }
          ].map((act, i) => (
            <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">{act.action}</span>
                <p className="text-slate-600 text-[11px]">{act.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {act.badge}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1">{act.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Farm Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Register New Farm Plot</h3>
            
            <form onSubmit={handleCreateFarm} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Farm / Field Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Paddy Basin"
                  value={newFarm.farm_name}
                  onChange={(e) => setNewFarm(p => ({ ...p, farm_name: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plot Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newFarm.area_acres}
                    onChange={(e) => setNewFarm(p => ({ ...p, area_acres: parseFloat(e.target.value) || 1 }))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Crop</label>
                  <input
                    type="text"
                    value={newFarm.current_crop}
                    onChange={(e) => setNewFarm(p => ({ ...p, current_crop: e.target.value }))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soil Type</label>
                  <select
                    value={newFarm.soil_type}
                    onChange={(e) => setNewFarm(p => ({ ...p, soil_type: e.target.value }))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  >
                    <option value="Alluvial Loam">Alluvial Loam</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Laterite Soil">Red Laterite Soil</option>
                    <option value="Sandy Soil">Sandy Soil</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Water Source</label>
                  <select
                    value={newFarm.water_source}
                    onChange={(e) => setNewFarm(p => ({ ...p, water_source: e.target.value }))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50"
                  >
                    <option value="Canal & Borewell">Canal & Borewell</option>
                    <option value="Drip System">Drip System</option>
                    <option value="Rainfed Only">Rainfed Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
