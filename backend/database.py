"""
SmartCrop AI - SQLite Database Layer
Stores Users, Farms, Predictions, YieldPredictions, DiseaseScans, Feedback, AuditLogs.
Auto-seeds demo accounts and realistic agricultural records on startup.
"""

import os
import sqlite3
import json
import hashlib
import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "smartcrop.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Users Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        role TEXT NOT NULL DEFAULT 'farmer',
        location TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # Try to add phone column if users table was created earlier without it
    try:
        c.execute("ALTER TABLE users ADD COLUMN phone TEXT")
    except Exception:
        pass

    # OTPs Table for Email/Phone authentication
    c.execute("""
    CREATE TABLE IF NOT EXISTS otps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        identifier TEXT NOT NULL,
        otp_code TEXT NOT NULL,
        expires_at TEXT NOT NULL
    )
    """)

    # Farms Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS farms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        farm_name TEXT NOT NULL,
        location TEXT NOT NULL,
        area_acres REAL NOT NULL,
        soil_type TEXT NOT NULL,
        water_source TEXT NOT NULL,
        current_crop TEXT,
        sowing_date TEXT,
        growth_stage TEXT DEFAULT 'vegetative',
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    """)

    # Crop Predictions Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        farm_id INTEGER,
        n REAL,
        p REAL,
        k REAL,
        temperature REAL,
        humidity REAL,
        ph REAL,
        rainfall REAL,
        recommended_crop TEXT NOT NULL,
        confidence REAL NOT NULL,
        explanation_json TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # Yield Predictions Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS yield_predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        farm_id INTEGER,
        crop_name TEXT NOT NULL,
        area_acres REAL NOT NULL,
        yield_tonnes_ha REAL NOT NULL,
        total_yield_tonnes REAL NOT NULL,
        irrigation_type TEXT,
        details_json TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # Disease Scans Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS disease_scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        farm_id INTEGER,
        crop_name TEXT,
        disease_name TEXT NOT NULL,
        severity TEXT,
        confidence REAL,
        treatment_summary TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # User Feedback Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_name TEXT,
        rating INTEGER NOT NULL,
        category TEXT NOT NULL,
        comments TEXT NOT NULL,
        status TEXT DEFAULT 'pending_review',
        created_at TEXT NOT NULL
    )
    """)

    # Audit Log Table
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        module TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed Demo Data if empty
    c.execute("SELECT COUNT(*) FROM users")
    if c.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()

def seed_initial_data(conn):
    c = conn.cursor()
    now = datetime.datetime.now().isoformat()
    yesterday = (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()
    last_week = (datetime.datetime.now() - datetime.timedelta(days=7)).isoformat()

    # 1. Demo Farmer & Admin
    farmer_pwd = hash_password("farmer123")
    admin_pwd = hash_password("admin123")

    c.execute("INSERT INTO users (name, email, password_hash, role, location, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              ("Rahul Sharma (Lead Farmer)", "farmer@smartcrop.ai", farmer_pwd, "farmer", "Ludhiana, Punjab", now))
    farmer_id = c.lastrowid

    c.execute("INSERT INTO users (name, email, password_hash, role, location, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              ("Dr. Anita Verma (Agronomist & Admin)", "admin@smartcrop.ai", admin_pwd, "admin", "ICAR Research Station", now))
    admin_id = c.lastrowid

    # 2. Seed Farms
    c.execute("""
    INSERT INTO farms (user_id, farm_name, location, area_acres, soil_type, water_source, current_crop, sowing_date, growth_stage, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, "Green Valley Agro Farm", "Ludhiana, Punjab", 6.5, "Alluvial Loam", "Canal & Borewell", "Rice", "2026-06-15", "flowering", now))
    farm1_id = c.lastrowid

    c.execute("""
    INSERT INTO farms (user_id, farm_name, location, area_acres, soil_type, water_source, current_crop, sowing_date, growth_stage, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, "Malwa Organic Orchard", "Bathinda, Punjab", 4.0, "Sandy Loam", "Drip Irrigation", "Pomegranate", "2025-09-10", "maturity", now))

    # 3. Seed Crop Predictions
    c.execute("""
    INSERT INTO predictions (user_id, farm_id, n, p, k, temperature, humidity, ph, rainfall, recommended_crop, confidence, explanation_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, farm1_id, 85.0, 48.0, 42.0, 24.5, 82.0, 6.4, 215.0, "rice", 0.94, json.dumps({
        "driving_factor": "rainfall",
        "top_reason": "High rainfall (215mm) and optimal humidity (82%) strongly match Rice physiological requirements."
    }), yesterday))

    c.execute("""
    INSERT INTO predictions (user_id, farm_id, n, p, k, temperature, humidity, ph, rainfall, recommended_crop, confidence, explanation_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, farm1_id, 75.0, 45.0, 20.0, 23.0, 65.0, 6.2, 95.0, "maize", 0.91, json.dumps({
        "driving_factor": "N",
        "top_reason": "Balanced Nitrogen and moderate precipitation ideal for Hybrid Maize."
    }), last_week))

    # 4. Seed Yield Predictions
    c.execute("""
    INSERT INTO yield_predictions (user_id, farm_id, crop_name, area_acres, yield_tonnes_ha, total_yield_tonnes, irrigation_type, details_json, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, farm1_id, "Rice", 6.5, 5.12, 13.46, "Canal", json.dumps({"performance": "Superior (+6.7% vs regional average)"}), yesterday))

    # 5. Seed Disease Scans
    c.execute("""
    INSERT INTO disease_scans (user_id, farm_id, crop_name, disease_name, severity, confidence, treatment_summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, farm1_id, "Tomato", "Early Blight (Alternaria solani)", "Moderate", 0.89, "Mancozeb 75% WP spray; pruned bottom foliage", last_week))

    # 6. Seed Feedback
    c.execute("""
    INSERT INTO feedback (user_id, user_name, rating, category, comments, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (farmer_id, "Rahul Sharma", 5, "Model Accuracy", "The crop recommendation and NPK fertilizer balancing matched our local soil test lab results perfectly!", "reviewed", now))

    # 7. Seed Audit Logs
    c.execute("""
    INSERT INTO audit_logs (user_id, action, module, details, timestamp)
    VALUES (?, ?, ?, ?, ?)
    """, (admin_id, "MODEL_RETRAIN", "CropClassifier", "Trained Random Forest model v1.2.0 on 22 agricultural crop classes with 97.4% test accuracy.", now))

    conn.commit()

init_db()
