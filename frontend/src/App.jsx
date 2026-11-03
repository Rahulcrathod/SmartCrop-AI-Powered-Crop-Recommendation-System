import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FeedbackModal from './components/FeedbackModal';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import YieldPredictionPage from './pages/YieldPredictionPage';
import ExplainableAiPage from './pages/ExplainableAiPage';
import SoilIntelligencePage from './pages/SoilIntelligencePage';
import WeatherIntelligencePage from './pages/WeatherIntelligencePage';
import IrrigationAdvisorPage from './pages/IrrigationAdvisorPage';
import FertilizerAdvisorPage from './pages/FertilizerAdvisorPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import CropGuidePage from './pages/CropGuidePage';
import MyFarmPage from './pages/MyFarmPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AssistantPage from './pages/AssistantPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { TRANSLATIONS } from './i18n';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentLang, setCurrentLang] = useState('en');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [lastPrediction, setLastPrediction] = useState(null);

  // User state (Farmer by default)
  const [user, setUser] = useState({
    id: 1,
    name: "Rahul Sharma (Lead Farmer)",
    email: "farmer@smartcrop.ai",
    role: "farmer",
    location: "Ludhiana, Punjab"
  });

  // Farms state
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  // Translations object
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Load farms for active user
  const loadFarmsForUser = (userId) => {
    fetch(`/api/farms?user_id=${userId || 1}`)
      .then(res => res.json())
      .then(data => {
        if (data.farms && data.farms.length > 0) {
          setFarms(data.farms);
          setSelectedFarmId(data.farms[0].id);
        } else {
          const starterFarm = {
            id: 99,
            user_id: userId,
            farm_name: `${user.name.split(' ')[0]}'s Main Plot`,
            location: user.location || "Punjab",
            area_acres: 4.5,
            soil_type: "Alluvial Loam",
            water_source: "Borewell & Drip",
            current_crop: "Rice",
            sowing_date: "2026-06-15",
            growth_stage: "vegetative"
          };
          setFarms([starterFarm]);
          setSelectedFarmId(99);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadFarmsForUser(user.id);
  }, []);

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    loadFarmsForUser(authenticatedUser.id);
  };

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} t={t} />;
      case 'recommendation':
        return <CropRecommendationPage setCurrentPage={setCurrentPage} setLastPrediction={setLastPrediction} t={t} />;
      case 'yield':
        return <YieldPredictionPage setCurrentPage={setCurrentPage} lastPrediction={lastPrediction} t={t} />;
      case 'xai':
        return <ExplainableAiPage lastPrediction={lastPrediction} setCurrentPage={setCurrentPage} t={t} />;
      case 'soil':
        return <SoilIntelligencePage lastPrediction={lastPrediction} t={t} />;
      case 'weather':
        return <WeatherIntelligencePage t={t} />;
      case 'irrigation':
        return <IrrigationAdvisorPage t={t} />;
      case 'fertilizer':
        return <FertilizerAdvisorPage lastPrediction={lastPrediction} t={t} />;
      case 'disease':
        return <DiseaseDetectionPage t={t} />;
      case 'guide':
        return <CropGuidePage setCurrentPage={setCurrentPage} t={t} />;
      case 'myfarm':
        return (
          <MyFarmPage 
            farms={farms} 
            setFarms={setFarms} 
            selectedFarmId={selectedFarmId} 
            setSelectedFarmId={setSelectedFarmId} 
            user={user} 
            t={t} 
          />
        );
      case 'analytics':
        return <AnalyticsPage t={t} />;
      case 'assistant':
        return <AssistantPage user={user} t={t} />;
      case 'admin':
        return <AdminDashboardPage user={user} t={t} />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} t={t} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {/* Top Fixed Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        user={user}
        setUser={setUser}
        farms={farms}
        selectedFarmId={selectedFarmId}
        setSelectedFarmId={setSelectedFarmId}
        onOpenAuth={() => setShowAuthModal(true)}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer 
        setCurrentPage={setCurrentPage} 
        onOpenFeedback={() => setShowFeedbackModal(true)} 
      />

      {/* Farmer Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        user={user}
      />

      {/* Auth / OTP / Guest Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
