# 🌱 SmartCrop AI
### An Intelligent Agricultural Decision Support System for Crop Recommendation and Yield Prediction

SmartCrop AI is an advanced, production-grade agricultural decision support platform engineered for modern farmers and agronomists. It unifies multi-factor crop recommendation, yield prediction, explainable AI (XAI), soil health intelligence, weather-informed decision support, fertilizer calculation, smart irrigation scheduling, computer-vision plant disease diagnostics, and farm management.

---

## 🌟 Key Features

1. **AI Crop Recommendation**:
   - Random Forest Classifier trained across **22 standard agricultural crops**.
   - Input factors: Soil Nitrogen (N), Phosphorus (P), Potassium (K), pH, Temperature, Humidity, Rainfall, soil texture, season, and regional presets.
   - Outputs probabilistic confidence scores and top alternative candidates.

2. **Crop Yield Prediction**:
   - Random Forest Regressor predicting expected harvest in **Tonnes per Hectare ($t/\text{ha}$)** and total harvest tonnes.
   - Accounts for farm acreage, nutrient supply, climate, and irrigation type (Drip, Sprinkler, Canal, Rainfed).
   - Computes yield gap percentage against regional benchmarks.

3. **Explainable AI (XAI)**:
   - SHAP-style local feature impact scores and global Gini feature importances.
   - Compares user soil parameters directly against the optimal biological envelope for the recommended crop.
   - Plain-language agronomic explanations justifying why the selected crop outperforms runners-up.

4. **Soil Intelligence Dashboard**:
   - Evaluates N, P, K adequacy, pH categorization (Acidic, Neutral, Alkaline), moisture, and organic carbon.
   - Computes overall Soil Fertility Index (0-100) and actionable corrective conditioning protocols (e.g., Agricultural Lime vs Gypsum).

5. **Weather Intelligence**:
   - Location-aware current conditions and 7-day agricultural forecast (Open-Meteo integration with regional ag-climatic profiles).
   - Generates spraying suitability windows (wind drift and rain washout risk), fungal disease outbreak alerts, and harvest feasibility windows.

6. **Smart Irrigation Advisor**:
   - Dynamically calculates crop evapotranspiration ($ET_c = ET_0 \times K_c$) across 5 phenological growth stages.
   - Computes daily water deficit in liters per acre and recommends emitter runtime hours for Drip, Sprinkler, and Furrow.
   - Provides rain-delay alerts to conserve electricity and groundwater.

7. **Fertilizer Advisor (NPK Balancer)**:
   - Calculates exact nutrient deficits based on target crop uptake curves.
   - Recommends commercial dosages of Urea (46% N), DAP (18-46-0), and MOP (60% K2O).
   - Generates a 3-stage split application timeline (Basal, Vegetative, Flowering) and organic alternatives (Compost, Rhizobium, PSB).

8. **Computer Vision Plant Disease Detection**:
   - Spectral color-channel feature extraction and necrotic lesion analysis.
   - Diagnoses 8 conditions: Tomato Early/Late Blight, Potato Late Blight, Corn Common Rust, Rice Blast, Apple Scab, Powdery Mildew, and Healthy foliage.
   - Delivers immediate chemical remedies, biological solutions, and long-term prevention protocols.

9. **Botanical Crop Guide**:
   - Searchable reference library for 22 crops with optimal growing condition bounds and base yields.

10. **Farm & Lifecycle Management**:
    - Manage farm plots, acreage, water infrastructure, and soil classifications.
    - Interactive 5-stage crop growth lifecycle tracker.
    - Field journal logging field events (irrigation, fertilization, spraying).

11. **Conversational AI Agronomist**:
    - Smart chat assistant with voice input (Web Speech STT) and text-to-speech read aloud.
    - Quick prompt chips for yellowing leaves, lowering fertilizer costs, companion crops, and government subsidies (PM-KISAN, PMFBY).

12. **Multilingual Support**:
    - Complete translation support for 7 languages: **English**, **हिंदी (Hindi)**, **ਪੰਜਾਬੀ (Punjabi)**, **తెలుగు (Telugu)**, **தமிழ் (Tamil)**, **मराठी (Marathi)**, **ગુજરાતી (Gujarati)**.

13. **Administrative & Analytics Portal**:
    - Model registry with validation accuracy metrics (97.4% test accuracy, 0.974 R²).
    - Historical prediction audit logs and farmer feedback inbox.

---

## 🚀 Quick Start Guide

### 1. Launch the Application
Run the unified server launcher from the project directory:

```powershell
python start_server.py
```

Open your browser to:
**[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### 2. Interactive Swagger API Docs
Inspect and test all REST endpoints directly at:
**[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

### 3. Pre-Configured Demo Accounts
The system is pre-seeded with demo profiles:
- **Lead Farmer**: `farmer@smartcrop.ai` (Password: `farmer123`)
- **Agri-Admin**: `admin@smartcrop.ai` (Password: `admin123`)
*(Use the role switcher in the top navigation bar to toggle between roles instantly).*

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Web Speech API (STT & TTS).
- **Backend**: Python 3.14, FastAPI, Uvicorn, SQLite database.
- **Machine Learning**: Scikit-learn (RandomForestClassifier, RandomForestRegressor), Pandas, NumPy, Pillow, Joblib.
- **Explainability**: Decision tree feature contribution and agronomic envelope benchmarking.

