import React, { useState } from 'react';
import { 
  Sprout, 
  Layers, 
  TrendingUp, 
  Compass, 
  Droplets, 
  FlaskConical, 
  Bug, 
  CloudSun, 
  BarChart3, 
  MessageSquareCode, 
  ShieldCheck, 
  BookOpen, 
  Globe, 
  Menu, 
  X,
  ChevronDown,
  User,
  Check,
  Smartphone,
  LogOut,
  LogIn,
  ArrowRight
} from 'lucide-react';
import { LANGUAGES } from '../i18n';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  currentLang, 
  setCurrentLang, 
  user, 
  setUser,
  farms,
  selectedFarmId,
  setSelectedFarmId,
  onOpenAuth,
  t 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Essential top-level navigation links visible on top
  const primaryLinks = [
    { id: 'home', label: t.home, icon: Sprout },
    { id: 'recommendation', label: t.cropRecommendation, icon: Compass },
    { id: 'yield', label: t.yieldPrediction, icon: TrendingUp },
    { id: 'myfarm', label: t.myFarm, icon: Sprout },
    { id: 'assistant', label: t.assistant, icon: MessageSquareCode },
  ];

  // Complete categorized tool suite for the 3-bar (☰ All Tools) navigation menu
  const toolCategories = [
    {
      title: "Core AI Decisions",
      items: [
        { id: 'recommendation', label: t.cropRecommendation, desc: "22-crop ML classification", icon: Compass, color: "text-emerald-400 bg-emerald-950/70 border-emerald-800/60" },
        { id: 'yield', label: t.yieldPrediction, desc: "RF regressor harvest estimation", icon: TrendingUp, color: "text-amber-400 bg-amber-950/70 border-amber-800/60" },
        { id: 'xai', label: t.explainableAi, desc: "Feature attribution & SHAP insights", icon: Layers, color: "text-purple-400 bg-purple-950/70 border-purple-800/60" },
      ]
    },
    {
      title: "Soil & Crop Nutrition",
      items: [
        { id: 'soil', label: t.soilIntelligence, desc: "Soil health score & NPK deficit", icon: FlaskConical, color: "text-emerald-400 bg-emerald-950/70 border-emerald-800/60" },
        { id: 'irrigation', label: t.irrigationAdvisor, desc: "FAO-56 evapotranspiration demand", icon: Droplets, color: "text-cyan-400 bg-cyan-950/70 border-cyan-800/60" },
        { id: 'fertilizer', label: t.fertilizerAdvisor, desc: "3-stage nutrient formula (Urea/DAP/MOP)", icon: Droplets, color: "text-lime-400 bg-lime-950/70 border-lime-800/60" },
      ]
    },
    {
      title: "Diagnostics & Weather",
      items: [
        { id: 'disease', label: t.diseaseDetection, desc: "Computer vision leaf disease diagnosis", icon: Bug, color: "text-rose-400 bg-rose-950/70 border-rose-800/60" },
        { id: 'weather', label: t.weather, desc: "Live Open-Meteo 7-day forecast", icon: CloudSun, color: "text-sky-400 bg-sky-950/70 border-sky-800/60" },
        { id: 'guide', label: t.cropGuide, desc: "Optimal ranges & agronomy handbook", icon: BookOpen, color: "text-indigo-400 bg-indigo-950/70 border-indigo-800/60" },
      ]
    },
    {
      title: "Farm Ops & Support",
      items: [
        { id: 'myfarm', label: t.myFarm, desc: "Field profiles, soil specs & logs", icon: Sprout, color: "text-emerald-400 bg-emerald-950/70 border-emerald-800/60" },
        { id: 'assistant', label: t.assistant, desc: "24/7 intelligent agronomy assistant", icon: MessageSquareCode, color: "text-teal-400 bg-teal-950/70 border-teal-800/60" },
        { id: 'analytics', label: t.analytics, desc: "Model accuracy, logs & telemetry", icon: BarChart3, color: "text-yellow-400 bg-yellow-950/70 border-yellow-800/60" },
        ...(user.role === 'admin' ? [
          { id: 'admin', label: t.adminDashboard || "Admin Portal", desc: "Model monitor & system audit", icon: ShieldCheck, color: "text-amber-400 bg-amber-950/70 border-amber-800/60" }
        ] : [])
      ]
    }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    // Guarantee immediate forward jump to top of destination tool
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSwitchUserRole = (targetRole) => {
    if (targetRole === 'admin') {
      setUser({
        id: 2,
        name: "Dr. Anita Verma (Agronomist & Admin)",
        email: "admin@smartcrop.ai",
        role: "admin",
        location: "ICAR Agricultural Research Station"
      });
      setCurrentPage('admin');
    } else {
      setUser({
        id: 1,
        name: "Rahul C Rathod (Lead Farmer)",
        email: "farmer@smartcrop.ai",
        role: "farmer",
        location: "Ludhiana, Punjab"
      });
    }
    setUserDropdownOpen(false);
  };

  return (
    <header 
      style={{ backgroundColor: '#0f172a' }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-xl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-md shadow-emerald-900/50 group-hover:scale-105 transition flex-shrink-0">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 bg-clip-text text-transparent">
                SmartCrop AI
              </span>
              <span className="block text-[9px] sm:text-[10px] text-emerald-400/80 uppercase font-semibold tracking-wider">
                Decision Support
              </span>
            </div>
          </div>

          {/* Desktop Navigation: Essential Links + 3-Bar "All Tools" Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 ml-2 xl:ml-4">
            {/* Always visible on lg & xl */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentPage === 'home' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.home}
            </button>

            <button
              onClick={() => handleNavClick('recommendation')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentPage === 'recommendation' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.cropRecommendation}
            </button>

            <button
              onClick={() => handleNavClick('yield')}
              className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentPage === 'yield' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.yieldPrediction}
            </button>

            {/* Extended visible links on wider screens (xl: >= 1280px) */}
            <button
              onClick={() => handleNavClick('myfarm')}
              className={`hidden xl:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentPage === 'myfarm' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.myFarm}
            </button>

            <button
              onClick={() => handleNavClick('assistant')}
              className={`hidden xl:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentPage === 'assistant' 
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {t.assistant}
            </button>

            {/* 3-Bar Navigation Button (☰ All Tools) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setLangDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  toolsDropdownOpen
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-emerald-950/40 hover:bg-slate-800 text-emerald-300 border-emerald-800/50 hover:border-slate-600'
                }`}
                title="Open 3-bar menu for all agricultural tools"
              >
                {/* 3-bar icon */}
                <Menu className="w-4 h-4 text-emerald-400" />
                <span>{t.allTools || 'All Tools'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180 text-emerald-400' : 'text-emerald-400/80'
                }`} />
              </button>

              {/* Backdrop for 3-bar menu click-away */}
              {toolsDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                  onClick={() => setToolsDropdownOpen(false)}
                />
              )}

              {/* 3-Bar Dropdown Flyout Grid */}
              {toolsDropdownOpen && (
                <div 
                  style={{ backgroundColor: '#0f172a' }}
                  className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[700px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl shadow-black/90 p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 scroll-smooth"
                >
                  {/* Sticky Header */}
                  <div 
                    style={{ backgroundColor: '#0f172a' }}
                    className="sticky -top-4 -mx-4 px-4 pt-1 pb-3 mb-3 border-b border-slate-800 z-10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Menu className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                          {t.allTools || 'All Agricultural Tools'}
                        </span>
                        <span className="hidden sm:inline-block ml-2 text-[10px] text-emerald-400/80 font-medium">
                          10+ ML & Agronomy Modules
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Click to open</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </span>
                  </div>

                  {/* 4 Tool Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {toolCategories.map((category, idx) => (
                      <div key={idx} className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1 flex items-center gap-1.5 border-b border-slate-800/80 pb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>{category.title}</span>
                        </h4>
                        <div className="space-y-1">
                          {category.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleNavClick(item.id)}
                                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition group cursor-pointer ${
                                  isActive
                                    ? 'bg-emerald-950/70 border border-emerald-500/60 shadow-sm'
                                    : 'hover:bg-slate-800 border border-transparent hover:border-slate-700/60'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${item.color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold truncate ${isActive ? 'text-emerald-300' : 'text-slate-200 group-hover:text-emerald-300'}`}>
                                      {item.label}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 transition-all flex-shrink-0 ml-1 group-hover:translate-x-0.5" />
                                  </div>
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                    {item.desc}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sticky Footer inside 3-bar menu */}
                  <div 
                    style={{ backgroundColor: '#0f172a' }}
                    className="sticky -bottom-4 -mx-4 px-4 pb-1 pt-3 mt-4 border-t border-slate-800 z-10 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      All ML models operational
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNavClick('guide')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition hover:translate-x-0.5"
                    >
                      <span>Explore Crop Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Tools: Language, Farm, User */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setToolsDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="uppercase">{currentLang}</span>
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                      Language / भाषा
                    </div>
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                          currentLang === lang.code ? 'text-emerald-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>


            {/* User Profile & Demo Switcher */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setToolsDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 sm:gap-2 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 text-xs text-white"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-[11px] flex-shrink-0">
                  {user?.role === 'admin' ? 'A' : 'F'}
                </div>
                <span className="hidden md:inline font-medium truncate max-w-[90px] xl:max-w-[120px]">
                  {user?.name ? user.name.split(' ')[0] : 'Farmer'}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  user?.role === 'admin' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600/80 text-white'
                }`}>
                  {user?.role || 'farmer'}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400">{user.email}</p>
                      <p className="text-[10px] text-emerald-400 mt-1">📍 {user.location}</p>
                    </div>
                    <div className="px-2 py-1">
                      <p className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400">
                        Switch Role (Demo Mode)
                      </p>
                      <button
                        onClick={() => handleSwitchUserRole('farmer')}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          user.role === 'farmer' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>👨‍🌾 Demo Farmer</span>
                        {user.role === 'farmer' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                      <button
                        onClick={() => handleSwitchUserRole('admin')}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          user.role === 'admin' ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>🔬 Demo Agri-Admin</span>
                        {user.role === 'admin' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    </div>
                    <div className="border-t border-slate-800 pt-1 px-2 space-y-1">
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sign In with Phone / Email (OTP)</span>
                      </button>

                      <button
                        onClick={() => {
                          setUser({
                            id: 0,
                            name: "Guest Farmer",
                            email: "guest@smartcrop.ai",
                            role: "farmer",
                            location: "Guest Demo"
                          });
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Reset to Guest Mode</span>
                      </button>
                    </div>

                    {user.role === 'admin' && (
                      <div className="border-t border-slate-800 pt-1 px-2">
                        <button
                          onClick={() => {
                            setCurrentPage('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-amber-400 hover:bg-slate-800 rounded-lg font-semibold flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" /> Go to Admin Portal
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile 3-Bar Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Categorized 3-Bar Navigation for small screens) */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 top-16 bg-slate-950/40 backdrop-blur-[1px] z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div 
            style={{ backgroundColor: '#0f172a' }}
            className="lg:hidden fixed top-16 left-0 right-0 max-h-[calc(100vh-4.5rem)] bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-8 overflow-y-auto space-y-4 shadow-2xl z-40"
          >
            {/* Primary Quick Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Primary Navigation
              </p>
            <div className="grid grid-cols-2 gap-1.5">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const active = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      active 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-slate-300 bg-slate-800/80 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categorized Tools in Mobile Drawer */}
          {toolCategories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1">
                {cat.title}
              </p>
              <div className="space-y-1">
                {cat.items.map((item) => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer ${
                        active 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-bold' 
                          : 'text-slate-300 bg-slate-800/50 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {user.role === 'admin' && (
            <div className="pt-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/50 border border-amber-800/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            </div>
          )}
        </div>
      </>
    )}
  </header>
);
}
