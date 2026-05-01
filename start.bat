@echo off
setlocal EnableExtensions

rem Comfy Panel launcher for Windows.
rem Make sure Node.js 20+ is installed and ComfyUI is running on http://127.0.0.1:8188.

cd /d "%~dp0"

if not exist .env.local (
  if exist .env.example (
    copy /Y .env.example .env.local >nul
  )
)

:menu
cls
echo =========================================
echo            Comfy Panel - Launcher
echo =========================================
echo.
echo  1. npm install         (install dependencies)
echo  2. npm run build       (build for production)
echo  3. Start server        (npm run dev)
echo  4. Start production    (npm run start - requires step 2)
echo  5. Exit
echo.
set "choice="
set /p choice=Select an option [1-5]:
if "%choice%"=="" goto menu

if "%choice%"=="1" goto do_install
if "%choice%"=="2" goto do_build
if "%choice%"=="3" goto do_dev
if "%choice%"=="4" goto do_start
if "%choice%"=="5" goto end
echo Invalid choice.
timeout /t 1 >nul
goto menu

:do_install
echo.
echo --- npm install ---
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed.
)
echo.
pause
goto menu

:do_build
echo.
echo --- npm run build ---
call npm run build
if errorlevel 1 (
  echo.
  echo Build failed.
)
echo.
pause
goto menu

:do_dev
echo.
echo --- Starting dev server on http://localhost:3000 ---
echo Press Ctrl+C to stop. Closing this window also stops the server.
echo.
call npm run dev
echo.
pause
goto menu

:do_start
echo.
echo --- Starting production server on http://localhost:3000 ---
echo Make sure you ran "npm run build" first (option 2).
echo Press Ctrl+C to stop.
echo.
call npm run start
echo.
pause
goto menu

:end
endlocal
