# Portfolio Deployment Script for Windows
# Deploys to Firebase Hosting with uddhavbhople.in domain

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if Firebase CLI is installed
Write-Host "📦 Checking Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}
Write-Host ""

# Step 2: Check if logged in
Write-Host "🔐 Checking Firebase login..." -ForegroundColor Yellow
$loginCheck = firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in. Please login..." -ForegroundColor Red
    firebase login
} else {
    Write-Host "✅ Already logged in" -ForegroundColor Green
}
Write-Host ""

# Step 3: Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Firebase
Write-Host "🌐 Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your portfolio is now live!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Firebase URL: Check the output above" -ForegroundColor White
Write-Host "📍 Custom Domain: https://uddhavbhople.in (after DNS setup)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Visit your Firebase URL to verify"
Write-Host "2. Follow DEPLOYMENT-STEPS.md Step 8 to connect custom domain"
Write-Host "3. Wait for DNS propagation (24-48 hours)"
Write-Host ""
