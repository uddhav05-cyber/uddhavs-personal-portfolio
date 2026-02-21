#!/bin/bash

# Portfolio Deployment Script
# Deploys to Firebase Hosting with uddhavbhople.in domain

echo "🚀 Starting deployment process..."
echo ""

# Step 1: Check if Firebase CLI is installed
echo "📦 Checking Firebase CLI..."
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi
echo ""

# Step 2: Check if logged in
echo "🔐 Checking Firebase login..."
firebase projects:list &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Not logged in. Please login..."
    firebase login
else
    echo "✅ Already logged in"
fi
echo ""

# Step 3: Build the project
echo "🔨 Building project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 4: Deploy to Firebase
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi
echo ""

echo "✅ Deployment successful!"
echo ""
echo "🎉 Your portfolio is now live!"
echo ""
echo "📍 Firebase URL: Check the output above"
echo "📍 Custom Domain: https://uddhavbhople.in (after DNS setup)"
echo ""
echo "Next steps:"
echo "1. Visit your Firebase URL to verify"
echo "2. Follow DEPLOYMENT-STEPS.md Step 8 to connect custom domain"
echo "3. Wait for DNS propagation (24-48 hours)"
echo ""
