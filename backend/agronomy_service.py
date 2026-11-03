"""
SmartCrop AI - Agronomic Advisory Service
Contains validated agronomic rules for:
1. Soil Intelligence & Health Index
2. Fertilizer Advisor (NPK deficit balancing, commercial & organic dosing)
3. Smart Irrigation Advisor (Crop Evapotranspiration Kc, soil moisture, rain offset)
"""

# Crop nutrient targets (kg/ha N-P2O5-K2O required for standard harvest yield)
CROP_NUTRIENT_DEMANDS = {
    "rice": {"N": 100, "P": 50, "K": 50, "kc": 1.15, "water_need_mm": 1200, "growth_days": 120},
    "maize": {"N": 120, "P": 60, "K": 40, "kc": 1.10, "water_need_mm": 600, "growth_days": 105},
    "cotton": {"N": 120, "P": 60, "K": 60, "kc": 1.05, "water_need_mm": 800, "growth_days": 160},
    "chickpea": {"N": 30, "P": 60, "K": 30, "kc": 0.85, "water_need_mm": 350, "growth_days": 100},
    "banana": {"N": 200, "P": 80, "K": 250, "kc": 1.20, "water_need_mm": 1500, "growth_days": 300},
    "sugarcane": {"N": 250, "P": 100, "K": 120, "kc": 1.25, "water_need_mm": 1800, "growth_days": 360},
    "wheat": {"N": 120, "P": 60, "K": 40, "kc": 1.10, "water_need_mm": 500, "growth_days": 120},
    "tomato": {"N": 140, "P": 80, "K": 100, "kc": 1.05, "water_need_mm": 650, "growth_days": 110},
    "potato": {"N": 150, "P": 80, "K": 120, "kc": 1.10, "water_need_mm": 600, "growth_days": 100},
    "grapes": {"N": 80, "P": 60, "K": 140, "kc": 0.85, "water_need_mm": 700, "growth_days": 150},
    "apple": {"N": 70, "P": 50, "K": 100, "kc": 0.95, "water_need_mm": 850, "growth_days": 180},
    "coffee": {"N": 100, "P": 40, "K": 80, "kc": 0.90, "water_need_mm": 1000, "growth_days": 240},
    "default": {"N": 90, "P": 50, "K": 50, "kc": 1.0, "water_need_mm": 700, "growth_days": 120}
}

def analyze_soil_health(n: float, p: float, k: float, ph: float, moisture: float = 45.0, organic_carbon: float = 0.55):
    """
    Evaluates soil parameters against agronomic benchmarks.
    """
    # Nitrogen rating (Low < 50, Medium 50-80, High > 80 mg/kg)
    if n < 50:
        n_status = "Deficient"
        n_action = "Incorporate green manuring, compost or top-dress nitrogen in split doses."
    elif n <= 85:
        n_status = "Optimal"
        n_action = "Maintain current nitrogen regime with organic mulching."
    else:
        n_status = "High"
        n_action = "Reduce synthetic nitrogen fertilizers to prevent vegetative lodging and disease susceptibility."

    # Phosphorus rating (Low < 25, Medium 25-50, High > 50 mg/kg)
    if p < 25:
        p_status = "Deficient"
        p_action = "Apply Single Super Phosphate (SSP) or DAP as basal dose during land preparation."
    elif p <= 55:
        p_status = "Optimal"
        p_action = "Soil phosphorus is balanced for robust root establishment."
    else:
        p_status = "High"
        p_action = "Withhold phosphorus application; excess P can bind micronutrients like zinc and iron."

    # Potassium rating (Low < 35, Medium 35-70, High > 70 mg/kg)
    if k < 35:
        k_status = "Deficient"
        k_action = "Apply Muriate of Potash (MOP) to enhance pest resistance and fruit grain filling."
    elif k <= 75:
        k_status = "Optimal"
        k_action = "Potassium levels promote excellent plant vascular turgidity and drought resistance."
    else:
        k_status = "High"
        k_action = "Adequate potassium reserves; maintain standard basal maintenance."

    # pH rating
    if ph < 5.8:
        ph_status = "Acidic"
        ph_action = f"Soil pH is acidic ({ph}). Apply Agricultural Lime (calcium carbonate @ 1.5 - 2.5 t/ha) to raise pH."
    elif ph <= 7.5:
        ph_status = "Neutral / Ideal"
        ph_action = f"Soil pH ({ph}) is optimal for broad nutrient availability and microbial flora."
    elif ph <= 8.5:
        ph_status = "Moderately Alkaline"
        ph_action = f"Soil pH ({ph}) is alkaline. Apply agricultural gypsum (calcium sulfate) or elemental sulfur to normalize."
    else:
        ph_status = "Highly Sodic / Alkaline"
        ph_action = f"Soil pH ({ph}) indicates high sodicity. Implement deep tillage, gypsum incorporation and leaching."

    # Soil Health Index (0 - 100)
    score = 100
    if n_status != "Optimal": score -= 12
    if p_status != "Optimal": score -= 10
    if k_status != "Optimal": score -= 10
    if ph_status != "Neutral / Ideal": score -= 18
    if moisture < 30 or moisture > 75: score -= 10
    if organic_carbon < 0.5: score -= 10
    score = max(35, min(100, score))

    health_tier = "Excellent" if score >= 85 else ("Good" if score >= 70 else ("Moderate" if score >= 50 else "Degraded"))

    return {
        "overall_health_score": score,
        "health_tier": health_tier,
        "parameters": {
            "nitrogen": {"value": n, "unit": "kg/ha (or mg/kg)", "status": n_status, "action": n_action},
            "phosphorus": {"value": p, "unit": "kg/ha", "status": p_status, "action": p_action},
            "potassium": {"value": k, "unit": "kg/ha", "status": k_status, "action": k_action},
            "ph": {"value": ph, "unit": "pH", "status": ph_status, "action": ph_action},
            "moisture": {"value": moisture, "unit": "%", "status": "Adequate" if 40 <= moisture <= 65 else "Attention needed"},
            "organic_carbon": {"value": organic_carbon, "unit": "%", "status": "Good" if organic_carbon >= 0.6 else "Low (add FYM)"}
        },
        "soil_class": "Fertile Loam" if ph_status == "Neutral / Ideal" and score >= 70 else "Medium Clay/Sandy Loam",
        "actionable_recommendations": [n_action, p_action, k_action, ph_action]
    }

def calculate_fertilizer_guidance(target_crop: str, current_n: float, current_p: float, current_k: float, area_acres: float = 1.0):
    """
    Computes precise fertilizer requirements based on crop nutrient target and soil test deficits.
    """
    target = CROP_NUTRIENT_DEMANDS.get(target_crop.lower(), CROP_NUTRIENT_DEMANDS["default"])
    hectares = area_acres * 0.404686

    # Deficits in kg/ha
    def_n = max(0.0, target["N"] - (current_n * 0.6))
    def_p = max(0.0, target["P"] - (current_p * 0.5))
    def_k = max(0.0, target["K"] - (current_k * 0.5))

    # Standard Commercial Fertilizers:
    # 1. DAP (Di-Ammonium Phosphate): 18% N, 46% P2O5
    # 2. Urea: 46% N
    # 3. MOP (Muriate of Potash): 60% K2O
    dap_kg_ha = (def_p / 0.46) if def_p > 0 else 0.0
    n_from_dap = dap_kg_ha * 0.18

    remaining_n = max(0.0, def_n - n_from_dap)
    urea_kg_ha = (remaining_n / 0.46) if remaining_n > 0 else 0.0
    mop_kg_ha = (def_k / 0.60) if def_k > 0 else 0.0

    # Total quantities for user's farm area
    total_urea = round(urea_kg_ha * hectares, 1)
    total_dap = round(dap_kg_ha * hectares, 1)
    total_mop = round(mop_kg_ha * hectares, 1)
    vermicompost_tonnes = round(2.0 * hectares, 1)

    schedule = [
        {
            "stage": "Basal Stage (At Land Preparation / Sowing)",
            "timing": "Day 0",
            "dap_percent": "100% DAP",
            "dap_amount_kg": total_dap,
            "urea_percent": "30% Urea",
            "urea_amount_kg": round(total_urea * 0.30, 1),
            "mop_percent": "50% MOP",
            "mop_amount_kg": round(total_mop * 0.50, 1),
            "instructions": "Broadcast and incorporate into top 10cm soil before sowing."
        },
        {
            "stage": "Vegetative Stage (Active Tillering / Branching)",
            "timing": "Day 25 - 35",
            "dap_percent": "0% DAP",
            "dap_amount_kg": 0,
            "urea_percent": "40% Urea",
            "urea_amount_kg": round(total_urea * 0.40, 1),
            "mop_percent": "0% MOP",
            "mop_amount_kg": 0,
            "instructions": "Top-dress during moist soil condition or right before scheduled irrigation."
        },
        {
            "stage": "Reproductive / Flowering Stage (Panicle / Tassel)",
            "timing": "Day 55 - 65",
            "dap_percent": "0% DAP",
            "dap_amount_kg": 0,
            "urea_percent": "30% Urea",
            "urea_amount_kg": round(total_urea * 0.30, 1),
            "mop_percent": "50% MOP",
            "mop_amount_kg": round(total_mop * 0.50, 1),
            "instructions": "Apply with moisture to strengthen grain formation and fruit size."
        }
    ]

    return {
        "crop": target_crop.title(),
        "farm_area_acres": area_acres,
        "farm_area_hectares": round(hectares, 2),
        "nutrient_demands_kg_ha": target,
        "nutrient_deficits_kg_ha": {"N": round(def_n, 1), "P": round(def_p, 1), "K": round(def_k, 1)},
        "fertilizer_recommendation": {
            "urea_total_kg": total_urea,
            "dap_total_kg": total_dap,
            "mop_total_kg": total_mop,
            "vermicompost_tonnes": vermicompost_tonnes
        },
        "application_schedule": schedule,
        "organic_alternatives": [
            "Incorporate 5 tonnes/ha Farmyard Manure (FYM) 2 weeks prior to sowing.",
            "Apply Azotobacter / Rhizobium biofertilizer culture for seed inoculation to reduce synthetic urea by 20%.",
            "Incorporate Phosphate Solubilizing Bacteria (PSB) to unlock fixed soil phosphorus.",
            "Mulch with crop residue to preserve soil organic carbon and micro-nutrients."
        ]
    }

def calculate_irrigation_advice(crop_name: str, growth_stage: str, soil_moisture_pct: float, temp_c: float, rainfall_forecast_mm: float):
    """
    Calculates dynamic irrigation requirement using FAO-56 Penman-Monteith principles.
    ETc = ET0 * Kc
    """
    crop_info = CROP_NUTRIENT_DEMANDS.get(crop_name.lower(), CROP_NUTRIENT_DEMANDS["default"])
    base_kc = crop_info["kc"]

    # Growth stage multiplier
    stage_multipliers = {
        "germination": 0.55,
        "vegetative": 0.85,
        "flowering": 1.15,
        "grain_filling": 1.05,
        "maturity": 0.65
    }
    kc = base_kc * stage_multipliers.get(growth_stage.lower(), 1.0)

    # Reference ET0 estimation from temperature
    et0 = max(2.5, min(7.5, (temp_c - 15) * 0.25 + 3.8))
    etc_daily_mm = round(et0 * kc, 1)

    # Deduct rainfall forecast
    effective_rain_mm = rainfall_forecast_mm * 0.75
    net_daily_water_need_mm = max(0.0, round(etc_daily_mm - (effective_rain_mm / 3.0), 1))

    # Moisture status check
    # Field capacity is typically 60-70%, permanent wilting point is ~20%
    moisture_deficit_pct = max(0.0, 65.0 - soil_moisture_pct)

    # Convert mm to liters per acre (1 mm rain over 1 acre = 4,047 liters)
    liters_per_acre_daily = round(net_daily_water_need_mm * 4047)

    # Decision recommendations
    if rainfall_forecast_mm >= 20:
        status = "Rain Forecasted - Skip Irrigation"
        urgency = "Low"
        interval_days = 4
        action = f"Forecast predicts {rainfall_forecast_mm}mm precipitation. Postpone planned irrigation to prevent root hypoxia and runoff."
    elif soil_moisture_pct > 65:
        status = "Soil Moisture Optimal - Delay Watering"
        urgency = "Low"
        interval_days = 3
        action = "Soil moisture is currently saturated/near field capacity. No immediate watering required."
    elif soil_moisture_pct < 35:
        status = "Moisture Deficit - Immediate Irrigation Advised"
        urgency = "High"
        interval_days = 1
        action = f"Apply {liters_per_acre_daily:,} liters/acre ({net_daily_water_need_mm}mm) within the next 24 hours via drip or light furrow."
    else:
        status = "Normal Irrigation Cycle"
        urgency = "Medium"
        interval_days = 2
        action = f"Schedule next watering in 2 days. Target {liters_per_acre_daily:,} liters/acre."

    return {
        "crop": crop_name.title(),
        "growth_stage": growth_stage.title(),
        "soil_moisture_percentage": soil_moisture_pct,
        "evapotranspiration_etc_mm_day": etc_daily_mm,
        "net_water_deficit_mm_day": net_daily_water_need_mm,
        "daily_volume_liters_acre": liters_per_acre_daily,
        "status": status,
        "urgency": urgency,
        "recommended_interval_days": interval_days,
        "action_advisory": action,
        "irrigation_methods": [
            {"method": "Drip Irrigation", "efficiency": "90-95%", "runtime_hours": round(net_daily_water_need_mm / 2.5, 1)},
            {"method": "Sprinkler", "efficiency": "75-80%", "runtime_hours": round(net_daily_water_need_mm / 4.0, 1)},
            {"method": "Furrow / Flood", "efficiency": "50-60%", "runtime_hours": round(net_daily_water_need_mm / 6.0, 1)}
        ]
    }
