@echo off
REM Portfolio Deployment Script for Windows
REM Deploys to Firebase Hosting with uddhavbhople.in domain

echo.
echo ========================================
echo   Portfolio Deployment Script
echo ========================================
echo.

REM Step 1: Check if Firebase CLI is installed
echo [1/4] Checking Firebase CLI...
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install Firebase CLI
        pause
        exit /b 1
    )
    echo Firebase CLI installed successfully!
) else (
    echo Firebase CLI found!
)
echo.

REM Step 2: Check if logged in
echo [2/4] Checking Firebase login...
firebase projects:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Not logged in. Opening login...
    firebase login
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Login failed
        pause
        exit /b 1
    )
) else (
    echo Already logged in!
)
echo.

REM Step 3: Build the project
echo [3/4] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

REM Step 4: Deploy to Firebase
echo [4/4] Deploying to Firebase Hosting...
firebase deploy --only hosting
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Deployment Successful!
echo ========================================
echo.
echo Your portfolio is now live!
echo.
echo Next steps:
echo 1. Visit your Firebase URL to verify
echo 2. Follow DEPLOYMENT-STEPS.md Step 8 to connect custom domain
echo 3. Wait for DNS propagation (24-48 hours)
echo.
echo Custom Domain: https://uddhavbhople.in
echo.
pause
