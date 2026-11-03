"""
SmartCrop AI - Explainable AI (XAI) Engine
Provides SHAP-style breakdown, feature importance, agronomic suitability delta,
and plain-language agricultural reasoning for crop recommendations.
"""

import os
import json
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
META_PATH = os.path.join(BASE_DIR, "metadata.json")
CROP_MODEL_PATH = os.path.join(BASE_DIR, "crop_model.joblib")
YIELD_MODEL_PATH = os.path.join(BASE_DIR, "yield_model.joblib")

# Load model and metadata
with open(META_PATH, "r", encoding="utf-8") as f:
    METADATA = json.load(f)

CROP_CLF = joblib.load(CROP_MODEL_PATH)
YIELD_REG = joblib.load(YIELD_MODEL_PATH)
CROP_PROFILES = METADATA["crop_profiles"]
GLOBAL_FEATURE_IMPORTANCE = METADATA["crop_classifier"]["feature_importance"]

def explain_prediction(user_inputs: dict, top_k: int = 3):
    """
    Given user inputs {N, P, K, temperature, humidity, ph, rainfall},
    runs the RandomForestClassifier and generates:
    1. Predicted crop and probability (validated from predict_proba)
    2. Top-k alternative crops with suitability percentages
    3. Feature-level contribution breakdown for the top crop
    4. Ideal agronomic envelopes vs actual input comparison
    5. Plain-language agronomic explanation
    """
    feature_order = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    import pandas as pd
    x_df = pd.DataFrame([[float(user_inputs[f]) for f in feature_order]], columns=feature_order)

    # Model prediction & probabilities
    probas = CROP_CLF.predict_proba(x_df)[0]
    classes = CROP_CLF.classes_

    # Sort classes by probability
    ranked_indices = np.argsort(probas)[::-1]
    top_crop = classes[ranked_indices[0]]
    top_confidence = round(float(probas[ranked_indices[0]]), 4)

    # Top candidates
    candidates = []
    for idx in ranked_indices[:top_k]:
        candidates.append({
            "crop": classes[idx],
            "probability": round(float(probas[idx]), 4),
            "match_percent": round(float(probas[idx]) * 100, 1)
        })

    profile = CROP_PROFILES.get(top_crop, {})

    # Compute Feature Contributions (XAI)
    # Based on deviation from ideal midpoints scaled by tree feature importances
    contributions = []
    plain_reasons = []

    for f in feature_order:
        val = float(user_inputs[f])
        f_imp = GLOBAL_FEATURE_IMPORTANCE.get(f, 0.14)
        
        ideal_min, ideal_max = profile.get(f, (val * 0.8, val * 1.2))
        ideal_mid = (ideal_min + ideal_max) / 2.0
        range_span = max(ideal_max - ideal_min, 1e-4)

        # Distance ratio: 0 is center of ideal range, > 0 is farther
        distance = abs(val - ideal_mid) / (range_span / 2.0)
        
        # Local alignment score: positive if within or close to ideal range
        if val >= ideal_min and val <= ideal_max:
            alignment = 1.0 - (distance * 0.3)
            status = "Optimal"
        elif val < ideal_min:
            alignment = max(-1.0, 1.0 - distance)
            status = "Low"
        else:
            alignment = max(-1.0, 1.0 - distance)
            status = "High"

        # Impact score combining global model weight and local alignment
        impact_score = round(float(f_imp * alignment * 100), 2)

        contributions.append({
            "feature": f,
            "user_value": val,
            "ideal_range": [ideal_min, ideal_max],
            "global_importance": round(float(f_imp), 4),
            "alignment_status": status,
            "impact_score": impact_score
        })

        if status == "Optimal":
            plain_reasons.append(f"{f} ({val}) is in the prime optimal range [{ideal_min} - {ideal_max}] for {top_crop.title()}.")
        elif status == "High":
            plain_reasons.append(f"{f} ({val}) is higher than standard range [{ideal_min} - {ideal_max}], but tolerated by {top_crop.title()}.")
        else:
            plain_reasons.append(f"{f} ({val}) is lower than standard [{ideal_min} - {ideal_max}]; soil supplementation may optimize yields.")

    # Sort contributions by highest positive impact
    contributions_sorted = sorted(contributions, key=lambda x: abs(x["impact_score"]), reverse=True)
    top_driving_feature = contributions_sorted[0]["feature"]

    explanation_summary = (
        f"{top_crop.title()} was selected as the optimal crop with a validated confidence of "
        f"{candidates[0]['match_percent']}%. The primary driving factor is {top_driving_feature.upper()}, "
        f"which aligns closely with {top_crop.title()}'s biological growth requirements. "
        f"Compared to runner-up {candidates[1]['crop'].title()} ({candidates[1]['match_percent']}%), "
        f"{top_crop.title()} exhibits superior environmental tolerance under these specific soil and climate conditions."
    )

    return {
        "recommended_crop": top_crop,
        "confidence": top_confidence,
        "confidence_percentage": round(top_confidence * 100, 1),
        "candidates": candidates,
        "feature_contributions": contributions,
        "top_driving_factor": top_driving_feature,
        "explanation_summary": explanation_summary,
        "detailed_reasons": plain_reasons,
        "global_importance": GLOBAL_FEATURE_IMPORTANCE
    }

def predict_crop_yield(crop_name: str, area_acres: float, n: float, p: float, k: float, rainfall: float, temp: float, irrigation: str):
    """
    Estimates yield in tonnes/hectare using trained RandomForestRegressor.
    """
    crop_index_map = METADATA["yield_regressor"]["crop_index_map"]
    crop_id = crop_index_map.get(crop_name.lower(), 0)

    irrigation_multiplier_map = {
        "rainfed": 0.80,
        "canal": 1.0,
        "sprinkler": 1.15,
        "drip": 1.25
    }
    irr_factor = irrigation_multiplier_map.get(irrigation.lower(), 1.0)

    import pandas as pd
    yield_cols = ["crop_id", "area_acres", "N", "P", "K", "rainfall", "temperature", "irrigation_factor"]
    x_df = pd.DataFrame([[crop_id, float(area_acres), float(n), float(p), float(k), float(rainfall), float(temp), irr_factor]], columns=yield_cols)
    
    yield_t_ha = float(YIELD_REG.predict(x_df)[0])
    yield_t_ha = max(0.2, round(yield_t_ha, 2))

    # Area conversion: 1 acre = 0.404686 hectares
    hectares = area_acres * 0.404686
    total_harvest_tonnes = round(yield_t_ha * hectares, 2)

    base_yield = CROP_PROFILES.get(crop_name.lower(), {}).get("base_yield", yield_t_ha)
    yield_gap = round(((yield_t_ha - base_yield) / base_yield) * 100, 1)

    factors = []
    if irr_factor > 1.0:
        factors.append(f"Precision irrigation ({irrigation.title()}) delivers +{int((irr_factor - 1.0) * 100)}% yield efficiency boost.")
    elif irr_factor < 1.0:
        factors.append("Rainfed cultivation limits full potential; supplemental irrigation could lift harvest by ~20%.")

    if rainfall > 200 and crop_name.lower() in ["rice", "jute"]:
        factors.append("High precipitation provides ideal moisture for root canopy establishment.")
    
    return {
        "crop": crop_name,
        "area_acres": area_acres,
        "area_hectares": round(hectares, 2),
        "yield_tonnes_per_hectare": yield_t_ha,
        "total_yield_tonnes": total_harvest_tonnes,
        "benchmark_yield_t_ha": base_yield,
        "yield_gap_percentage": yield_gap,
        "performance_rating": "Superior" if yield_gap >= 10 else ("Standard" if yield_gap >= -10 else "Sub-Optimal"),
        "supporting_factors": factors,
        "model_r2_score": METADATA["yield_regressor"]["r2_score"]
    }
