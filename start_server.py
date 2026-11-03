"""
SmartCrop AI - Unified Server Launcher
Starts the FastAPI application server which serves both the ML REST APIs
and the modern compiled React Frontend.
"""

import os
import sys
import socket
import subprocess
import threading
import webbrowser
import time
import uvicorn

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
sys.path.insert(0, BACKEND_DIR)

def is_port_in_use(port: int = 8000) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def free_port(port: int = 8000):
    try:
        # Find PID on Windows and terminate previous instance
        cmd = f'netstat -ano | findstr :{port}'
        out = subprocess.check_output(cmd, shell=True).decode()
        for line in out.strip().splitlines():
            parts = line.split()
            if len(parts) >= 5 and parts[1].endswith(f':{port}'):
                pid = parts[-1]
                if pid and pid != '0':
                    subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    print(f"  * Released port {port} from previous process (PID {pid})")
                    time.sleep(0.5)
    except Exception:
        pass

def open_browser():
    time.sleep(1.2)
    try:
        webbrowser.open("http://127.0.0.1:8000")
    except Exception:
        pass

if __name__ == "__main__":
    PORT = 8000
    
    # Check if port is already occupied and free it cleanly
    if is_port_in_use(PORT):
        print(f"  * Port {PORT} is currently in use. Cleaning up previous instance...")
        free_port(PORT)

    print("=" * 70)
    print("  SMARTCROP AI: AGRICULTURAL DECISION SUPPORT SYSTEM")
    print("=" * 70)
    print("  * Machine Learning: RandomForest (22 Crops, Accuracy 97.4%)")
    print("  * Yield Regression: RandomForest (Tonnes/Ha, R2 = 0.974)")
    print("  * Plant Disease CV: Spectral & Lesion Detection")
    print(f"  * Website URL:      http://127.0.0.1:{PORT}")
    print(f"  * Documentation:    http://127.0.0.1:{PORT}/docs")
    print("=" * 70)
    print("  Quick Demo Accounts:")
    print("  [Farmer]: farmer@smartcrop.ai (password: farmer123)")
    print("  [Admin]:  admin@smartcrop.ai  (password: admin123)")
    print("=" * 70)
    print("  Starting server and opening browser...")
    
    # Automatically open browser in background thread
    threading.Thread(target=open_browser, daemon=True).start()

    # Run uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=PORT, reload=False, app_dir=BACKEND_DIR)
