@echo off
echo Starting Restaurant Seller App...
echo.

echo Building React app...
call npm run build:vite
if %errorlevel% neq 0 (
    echo Error building React app
    pause
    exit /b 1
)

echo Building Electron app...
call npm run build:electron
if %errorlevel% neq 0 (
    echo Error building Electron app
    pause
    exit /b 1
)

echo Starting Electron application...
call npx electron .

pause 