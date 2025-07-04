@echo off
echo ========================================
echo Building Restaurant Seller App for Windows
echo ========================================

echo.
echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building the application...
npm run build:win

echo.
echo ========================================
echo Build completed!
echo Check the 'release' folder for the installer
echo ========================================
pause 