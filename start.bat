@echo off
title EquityScope Launcher
cls
echo ===================================================================
echo     EquityScope - Mid-Cap ^& Small-Cap Stock Intelligence
echo ===================================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "EquityScope Backend" cmd /k "cd /d %~dp0backend && python run.py"

echo [2/2] Starting Vite React Frontend on http://localhost:3000 ...
start "EquityScope Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Initializing servers (3 seconds)...
timeout /t 3 /nobreak >nul

echo Launching browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================================
echo   Platform successfully launched!
echo   Frontend : http://localhost:3000
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo ===================================================================
echo Keep the backend and frontend terminal windows open while using the app.
pause
