@echo off
echo ========================================
echo    Starting Gym Workout App...
echo ========================================
echo.

REM Set the path - change this if your folder is different
set "GYMPATH=C:\MidAmericanCable\Gym Webapp"

echo Using path: %GYMPATH%
echo.

REM Start Backend in new window
start "Gym Backend" cmd /k "cd /d "%GYMPATH%\backend" && .\venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8000"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend in new window (using npm start instead of serve)
start "Gym Frontend" cmd /k "cd /d "%GYMPATH%\frontend" && npm start"

echo.
echo ========================================
echo    App Started Successfully!
echo ========================================
echo.
echo    App URL: http://localhost:3000
echo.
echo ----------------------------------------
echo    YOUR NETWORK IP ADDRESSES:
echo ----------------------------------------
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do echo    %%a
echo.
echo ----------------------------------------
echo    Use one of these IPs in Twingate!
echo    Example: http://192.168.x.x:3000
echo ----------------------------------------
echo.
echo    Close the two terminal windows to stop.
echo ========================================
pause
