"""
SmartCrop AI - Model Training Pipeline
Trains:
1. Crop Recommendation Model: RandomForestClassifier (22 classes, 7 features)
2. Yield Prediction Model: RandomForestRegressor (tonnes per hectare)
Saves models, encoders, and evaluation metrics to disk.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, r2_score, mean_squared_error

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(MODEL_DIR), "data")
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Standard agricultural reference profiles for 22 crops (N, P, K in kg/ha, temp in C, humidity in %, pH, rainfall in mm)
CROP_PROFILES = {
    "rice": {"N": (60, 100), "P": (35, 60), "K": (35, 45), "temp": (20, 27), "humidity": (80, 85), "ph": (5.0, 7.0), "rainfall": (180, 300), "base_yield": 4.8},
    "maize": {"N": (60, 100), "P": (35, 60), "K": (15, 25), "temp": (18, 27), "humidity": (55, 75), "ph": (5.5, 7.0), "rainfall": (60, 110), "base_yield": 5.2},
    "chickpea": {"N": (20, 60), "P": (55, 80), "K": (75, 85), "temp": (17, 22), "humidity": (14, 20), "ph": (5.5, 8.8), "rainfall": (65, 95), "base_yield": 1.8},
    "kidneybeans": {"N": (10, 40), "P": (55, 80), "K": (15, 25), "temp": (15, 24), "humidity": (18, 25), "ph": (5.5, 6.2), "rainfall": (60, 150), "base_yield": 1.6},
    "pigeonpeas": {"N": (10, 40), "P": (55, 80), "K": (15, 25), "temp": (18, 38), "humidity": (30, 70), "ph": (4.5, 7.5), "rainfall": (90, 200), "base_yield": 1.5},
    "mothbeans": {"N": (10, 40), "P": (35, 60), "K": (15, 25), "temp": (24, 32), "humidity": (40, 70), "ph": (3.5, 8.5), "rainfall": (30, 75), "base_yield": 1.2},
    "mungbean": {"N": (10, 40), "P": (35, 60), "K": (15, 25), "temp": (27, 30), "humidity": (80, 90), "ph": (6.2, 7.2), "rainfall": (35, 60), "base_yield": 1.4},
    "blackgram": {"N": (30, 60), "P": (55, 80), "K": (15, 25), "temp": (25, 35), "humidity": (60, 70), "ph": (6.5, 7.8), "rainfall": (60, 75), "base_yield": 1.3},
    "lentil": {"N": (10, 40), "P": (55, 80), "K": (15, 25), "temp": (15, 30), "humidity": (60, 70), "ph": (5.5, 7.5), "rainfall": (35, 55), "base_yield": 1.4},
    "pomegranate": {"N": (10, 40), "P": (10, 30), "K": (35, 45), "temp": (18, 25), "humidity": (85, 95), "ph": (5.5, 7.2), "rainfall": (100, 115), "base_yield": 12.0},
    "banana": {"N": (80, 120), "P": (70, 95), "K": (45, 55), "temp": (25, 30), "humidity": (75, 85), "ph": (5.5, 6.5), "rainfall": (90, 120), "base_yield": 32.5},
    "mango": {"N": (10, 40), "P": (15, 40), "K": (25, 35), "temp": (27, 36), "humidity": (45, 55), "ph": (4.5, 7.0), "rainfall": (85, 105), "base_yield": 10.5},
    "grapes": {"N": (10, 40), "P": (120, 145), "K": (195, 205), "temp": (8, 42), "humidity": (80, 85), "ph": (5.5, 6.5), "rainfall": (65, 75), "base_yield": 22.0},
    "watermelon": {"N": (80, 120), "P": (5, 30), "K": (45, 55), "temp": (24, 27), "humidity": (80, 90), "ph": (6.0, 7.0), "rainfall": (40, 60), "base_yield": 28.0},
    "muskmelon": {"N": (80, 120), "P": (5, 30), "K": (45, 55), "temp": (27, 30), "humidity": (90, 95), "ph": (6.0, 6.8), "rainfall": (20, 30), "base_yield": 24.0},
    "apple": {"N": (10, 40), "P": (120, 145), "K": (195, 205), "temp": (21, 24), "humidity": (90, 95), "ph": (5.5, 6.5), "rainfall": (100, 125), "base_yield": 16.0},
    "orange": {"N": (10, 40), "P": (5, 30), "K": (5, 15), "temp": (10, 35), "humidity": (90, 95), "ph": (6.0, 8.0), "rainfall": (100, 120), "base_yield": 15.0},
    "papaya": {"N": (30, 70), "P": (45, 70), "K": (45, 55), "temp": (23, 44), "humidity": (90, 95), "ph": (6.5, 7.0), "rainfall": (140, 250), "base_yield": 38.0},
    "coconut": {"N": (10, 40), "P": (5, 30), "K": (25, 35), "temp": (25, 29), "humidity": (90, 100), "ph": (5.5, 6.5), "rainfall": (130, 230), "base_yield": 11.0},
    "cotton": {"N": (100, 140), "P": (35, 60), "K": (15, 25), "temp": (22, 26), "humidity": (75, 85), "ph": (6.0, 8.0), "rainfall": (60, 100), "base_yield": 2.4},
    "jute": {"N": (60, 100), "P": (35, 60), "K": (35, 45), "temp": (23, 26), "humidity": (70, 90), "ph": (6.0, 7.5), "rainfall": (150, 200), "base_yield": 3.1},
    "coffee": {"N": (80, 120), "P": (15, 40), "K": (25, 35), "temp": (23, 28), "humidity": (50, 70), "ph": (6.0, 7.5), "rainfall": (115, 200), "base_yield": 1.6}
}

def generate_crop_dataset(samples_per_crop=150, seed=42):
    np.random.seed(seed)
    rows = []
    
    for crop, prof in CROP_PROFILES.items():
        for _ in range(samples_per_crop):
            n = np.random.uniform(prof["N"][0], prof["N"][1]) + np.random.normal(0, 3)
            p = np.random.uniform(prof["P"][0], prof["P"][1]) + np.random.normal(0, 3)
            k = np.random.uniform(prof["K"][0], prof["K"][1]) + np.random.normal(0, 2)
            temp = np.random.uniform(prof["temp"][0], prof["temp"][1]) + np.random.normal(0, 1)
            humidity = np.clip(np.random.uniform(prof["humidity"][0], prof["humidity"][1]) + np.random.normal(0, 2), 10, 100)
            ph = np.clip(np.random.uniform(prof["ph"][0], prof["ph"][1]) + np.random.normal(0, 0.2), 3.5, 9.5)
            rainfall = np.clip(np.random.uniform(prof["rainfall"][0], prof["rainfall"][1]) + np.random.normal(0, 6), 15, 350)
            
            rows.append({
                "N": max(0, round(float(n), 2)),
                "P": max(0, round(float(p), 2)),
                "K": max(0, round(float(k), 2)),
                "temperature": round(float(temp), 2),
                "humidity": round(float(humidity), 2),
                "ph": round(float(ph), 2),
                "rainfall": round(float(rainfall), 2),
                "label": crop
            })
            
    df = pd.DataFrame(rows)
    return df

def generate_yield_dataset(samples_per_crop=150, seed=42):
    np.random.seed(seed)
    rows = []
    crops = list(CROP_PROFILES.keys())
    crop_index_map = {c: i for i, c in enumerate(crops)}
    
    for crop, prof in CROP_PROFILES.items():
        base_yield = prof["base_yield"]
        for _ in range(samples_per_crop):
            area = round(float(np.random.uniform(0.5, 25.0)), 1)
            n = float(np.random.uniform(prof["N"][0] * 0.7, prof["N"][1] * 1.3))
            p = float(np.random.uniform(prof["P"][0] * 0.7, prof["P"][1] * 1.3))
            k = float(np.random.uniform(prof["K"][0] * 0.7, prof["K"][1] * 1.3))
            rainfall = float(np.random.uniform(prof["rainfall"][0] * 0.7, prof["rainfall"][1] * 1.3))
            temp = float(np.random.uniform(prof["temp"][0] - 3, prof["temp"][1] + 3))
            irrigation_factor = float(np.random.choice([0.8, 1.0, 1.15, 1.25]))
            
            n_opt = (prof["N"][0] + prof["N"][1]) / 2.0
            p_opt = (prof["P"][0] + prof["P"][1]) / 2.0
            k_opt = (prof["K"][0] + prof["K"][1]) / 2.0
            rain_opt = (prof["rainfall"][0] + prof["rainfall"][1]) / 2.0
            
            n_ratio = 1.0 - 0.25 * (abs(n - n_opt) / n_opt)
            p_ratio = 1.0 - 0.20 * (abs(p - p_opt) / p_opt)
            k_ratio = 1.0 - 0.15 * (abs(k - k_opt) / k_opt)
            rain_ratio = 1.0 - 0.30 * (abs(rainfall - rain_opt) / rain_opt)
            
            factor = np.clip(n_ratio * p_ratio * k_ratio * rain_ratio, 0.5, 1.3)
            yield_tonnes_ha = base_yield * factor * irrigation_factor + np.random.normal(0, base_yield * 0.05)
            yield_tonnes_ha = max(0.2, round(float(yield_tonnes_ha), 2))
            
            rows.append({
                "crop_id": crop_index_map[crop],
                "area_acres": area,
                "N": round(n, 1),
                "P": round(p, 1),
                "K": round(k, 1),
                "rainfall": round(rainfall, 1),
                "temperature": round(temp, 1),
                "irrigation_factor": irrigation_factor,
                "yield_tonnes_ha": yield_tonnes_ha
            })
            
    return pd.DataFrame(rows), crop_index_map

def train_and_export():
    print(">>> 1. Generating Agronomic Crop Dataset...", flush=True)
    crop_df = generate_crop_dataset(samples_per_crop=60)
    crop_csv_path = os.path.join(DATA_DIR, "crop_recommendation.csv")
    crop_df.to_csv(crop_csv_path, index=False)
    print(f"Saved {len(crop_df)} rows to {crop_csv_path}", flush=True)

    feature_cols = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    X = crop_df[feature_cols]
    y = crop_df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(">>> 2. Training Random Forest Crop Recommendation Classifier...", flush=True)
    clf = RandomForestClassifier(n_estimators=60, max_depth=16, random_state=42, n_jobs=1)
    clf.fit(X_train, y_train)

    train_acc = accuracy_score(y_train, clf.predict(X_train))
    test_acc = accuracy_score(y_test, clf.predict(X_test))
    print(f"Crop Classifier - Train Accuracy: {train_acc * 100:.2f}%, Test Accuracy: {test_acc * 100:.2f}%")

    crop_model_path = os.path.join(MODEL_DIR, "crop_model.joblib")
    joblib.dump(clf, crop_model_path)
    print(f"Saved Crop Model to {crop_model_path}")

    crop_feature_importance = dict(zip(feature_cols, [round(float(v), 4) for v in clf.feature_importances_]))

    print(">>> 3. Generating Yield Prediction Dataset...", flush=True)
    yield_df, crop_index_map = generate_yield_dataset(samples_per_crop=60)
    yield_csv_path = os.path.join(DATA_DIR, "crop_yield.csv")
    yield_df.to_csv(yield_csv_path, index=False)
    print(f"Saved {len(yield_df)} rows to {yield_csv_path}", flush=True)

    yield_features = ["crop_id", "area_acres", "N", "P", "K", "rainfall", "temperature", "irrigation_factor"]
    X_y = yield_df[yield_features]
    y_y = yield_df["yield_tonnes_ha"]

    Xy_train, Xy_test, yy_train, yy_test = train_test_split(X_y, y_y, test_size=0.2, random_state=42)

    print(">>> 4. Training Random Forest Yield Regressor...", flush=True)
    reg = RandomForestRegressor(n_estimators=60, max_depth=16, random_state=42, n_jobs=1)
    reg.fit(Xy_train, yy_train)

    y_pred = reg.predict(Xy_test)
    r2 = r2_score(yy_test, y_pred)
    rmse = np.sqrt(mean_squared_error(yy_test, y_pred))
    print(f"Yield Regressor - R2 Score: {r2:.4f}, RMSE: {rmse:.4f}")

    yield_model_path = os.path.join(MODEL_DIR, "yield_model.joblib")
    joblib.dump(reg, yield_model_path)
    print(f"Saved Yield Model to {yield_model_path}")

    yield_feature_importance = dict(zip(yield_features, [round(float(v), 4) for v in reg.feature_importances_]))

    metadata = {
        "crop_classifier": {
            "model_type": "RandomForestClassifier",
            "n_estimators": 100,
            "features": feature_cols,
            "classes": sorted(list(clf.classes_)),
            "train_accuracy": round(float(train_acc), 4),
            "test_accuracy": round(float(test_acc), 4),
            "feature_importance": crop_feature_importance,
            "trained_samples": len(crop_df),
            "version": "v1.2.0"
        },
        "yield_regressor": {
            "model_type": "RandomForestRegressor",
            "n_estimators": 120,
            "features": yield_features,
            "r2_score": round(float(r2), 4),
            "rmse": round(float(rmse), 4),
            "feature_importance": yield_feature_importance,
            "crop_index_map": crop_index_map,
            "trained_samples": len(yield_df),
            "version": "v1.1.0"
        },
        "crop_profiles": CROP_PROFILES
    }

    meta_path = os.path.join(MODEL_DIR, "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Exported model metadata to {meta_path}")

if __name__ == "__main__":
    train_and_export()
