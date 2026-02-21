# Deployment Guide

This guide covers the complete deployment process for the portfolio website, including environment configuration, build optimization, and deployment to Firebase Hosting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Build Process](#build-process)
4. [Deployment Scripts](#deployment-scripts)
5. [Pre-Deployment Validation](#pre-deployment-validation)
6. [Deployment to Production](#deployment-to-production)
7. [Preview Deployments](#preview-deployments)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js (v18 or higher)
- npm (v9 or higher)
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project configured
- Access to Firebase project (logged in via Firebase CLI)

### Verify Firebase CLI Installation

```bash
firebase --version
```

### Login to Firebase

```bash
firebase login
```

### Verify Project Configuration

```bash
firebase projects:list
```

## Environment Configuration

The application uses environment variables for configuration, particularly for Firebase credentials.

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Firebase Credentials

Edit `.env` and add your Firebase project credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Environment
NODE_ENV=production
```

### 3. Finding Firebase Credentials

You can find your Firebase credentials in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) → Project settings
4. Scroll down to "Your apps" section
5. Select your web app or create one
6. Copy the configuration values

### 4. Security Notes

- **NEVER commit `.env` to version control** (it's already in `.gitignore`)
- Keep `.env.example` updated with variable names (but not values)
- Use different Firebase projects for development and production
- Rotate API keys periodically for security

## Build Process

The build process compiles, optimizes, and bundles the application for production.

### Build Commands

```bash
# Standard build
npm run build

# Production build with environment variables
npm run build:prod
```

### Build Output

The build process creates a `dist/` directory with:

- Minified and bundled JavaScript
- Minified CSS
- Optimized images
- HTML with injected asset references
- Source maps (for debugging)

### Build Optimization Features

- **Code Splitting**: Vendor libraries separated from application code
- **Tree Shaking**: Unused code removed
- **Minification**: JavaScript and CSS minified
- **Compression**: Gzip/Brotli compression enabled
- **Asset Optimization**: Images compressed and converted to WebP
- **Cache Busting**: Hashed filenames for cache invalidation

## Deployment Scripts

The `package.json` includes several deployment-related scripts:

### Available Scripts

```json
{
  "build": "vite build",
  "build:prod": "NODE_ENV=production vite build",
  "lint": "eslint src --ext .js",
  "lint:fix": "eslint src --ext .js --fix",
  "test": "vitest --run",
  "validate": "node scripts/pre-deploy.js",
  "predeploy": "npm run validate && npm run build:prod",
  "deploy": "firebase deploy --only hosting",
  "deploy:preview": "npm run build:prod && firebase hosting:channel:deploy preview",
  "deploy:full": "npm run validate && npm run build:prod && firebase deploy"
}
```

### Script Descriptions

- **`build`**: Standard Vite build
- **`build:prod`**: Production build with NODE_ENV=production
- **`lint`**: Run ESLint to check code quality
- **`lint:fix`**: Run ESLint and automatically fix issues
- **`test`**: Run all tests
- **`validate`**: Run pre-deployment validation (linting, tests, config checks)
- **`predeploy`**: Automatically runs before `deploy` (validation + build)
- **`deploy`**: Deploy to Firebase Hosting (production)
- **`deploy:preview`**: Deploy to preview channel for testing
- **`deploy:full`**: Full deployment including all Firebase services

## Pre-Deployment Validation

The pre-deployment validation script (`scripts/pre-deploy.js`) performs comprehensive checks before deployment.

### Validation Checks

1. **Environment Variables**: Verifies required Firebase credentials are set
2. **Firebase Configuration**: Validates `firebase.json` structure
3. **Linting**: Runs ESLint to check code quality
4. **Tests**: Runs all unit tests to ensure functionality

### Running Validation Manually

```bash
npm run validate
```

### Validation Output

The script provides colored output:

- ✓ Green: Check passed
- ✗ Red: Check failed
- ⚠ Yellow: Warning (non-critical)

### Handling Validation Failures

If validation fails:

1. **Linting Errors**: Run `npm run lint:fix` to auto-fix issues
2. **Test Failures**: Fix failing tests before deploying
3. **Missing Environment Variables**: Update `.env` file
4. **Firebase Config Issues**: Check `firebase.json` structure

## Deployment to Production

### Standard Deployment Process

The recommended deployment process:

```bash
# 1. Ensure you're on the main branch
git checkout main
git pull origin main

# 2. Run deployment (includes validation and build)
npm run deploy
```

The `predeploy` script automatically runs validation and build before deployment.

### Manual Step-by-Step Deployment

If you prefer manual control:

```bash
# 1. Run validation
npm run validate

# 2. Build for production
npm run build:prod

# 3. Deploy to Firebase
firebase deploy --only hosting
```

### Full Deployment (All Firebase Services)

To deploy all Firebase services (hosting, functions, database rules, etc.):

```bash
npm run deploy:full
```

### Deployment Output

Firebase CLI will show:

- Upload progress
- Deployment URL
- Deployment time
- Any errors or warnings

### Verifying Deployment

After deployment:

1. Visit the deployment URL shown in the output
2. Check that all features work correctly
3. Verify Firebase connections (Analytics, Database, Storage)
4. Test on multiple devices and browsers
5. Check browser console for errors

## Preview Deployments

Preview deployments allow testing changes before production deployment.

### Creating a Preview Deployment

```bash
npm run deploy:preview
```

This creates a temporary preview channel with a unique URL.

### Preview Channel Features

- Unique URL for testing (e.g., `project-id--preview-abc123.web.app`)
- Isolated from production
- Can be shared with team members
- Automatically expires after 7 days (configurable)

### Managing Preview Channels

```bash
# List all preview channels
firebase hosting:channel:list

# Delete a preview channel
firebase hosting:channel:delete preview

# Deploy to a specific channel
firebase hosting:channel:deploy staging
```

## Rollback Procedures

If a deployment causes issues, you can rollback to a previous version.

### View Deployment History

```bash
firebase hosting:releases:list
```

### Rollback to Previous Version

Firebase Hosting doesn't have a direct rollback command, but you can:

#### Option 1: Redeploy Previous Version

```bash
# 1. Checkout previous commit
git checkout <previous-commit-hash>

# 2. Build and deploy
npm run build:prod
firebase deploy --only hosting

# 3. Return to main branch
git checkout main
```

#### Option 2: Use Git to Revert

```bash
# 1. Revert to previous commit
git revert <bad-commit-hash>

# 2. Deploy the reverted version
npm run deploy
```

### Emergency Rollback

For critical issues:

1. Identify the last working commit
2. Create a hotfix branch
3. Deploy from that branch
4. Fix the issue in main branch separately

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures

**Error**: `Build failed with errors`

**Solutions**:
- Check for syntax errors: `npm run lint`
- Verify all dependencies are installed: `npm install`
- Clear build cache: `rm -rf dist/ node_modules/.vite`
- Check Node.js version: `node --version` (should be v18+)

#### 2. Firebase Authentication Errors

**Error**: `Error: Authentication failed`

**Solutions**:
- Login to Firebase: `firebase login`
- Verify project access: `firebase projects:list`
- Check Firebase token: `firebase login:ci` (for CI/CD)

#### 3. Environment Variable Issues

**Error**: `Firebase configuration incomplete`

**Solutions**:
- Verify `.env` file exists
- Check all required variables are set
- Ensure variable names start with `VITE_`
- Restart dev server after changing `.env`

#### 4. Deployment Hangs

**Error**: Deployment process hangs or times out

**Solutions**:
- Check internet connection
- Verify Firebase project status
- Try deploying with `--debug` flag: `firebase deploy --only hosting --debug`
- Clear Firebase cache: `firebase logout && firebase login`

#### 5. 404 Errors After Deployment

**Error**: Routes return 404 errors

**Solutions**:
- Verify `firebase.json` has correct rewrites configuration
- Check that `dist/index.html` exists
- Ensure SPA routing is configured correctly

#### 6. Firebase Features Not Working

**Error**: Analytics, Database, or Storage not working

**Solutions**:
- Verify environment variables are set correctly
- Check Firebase console for service status
- Verify Firebase rules allow access
- Check browser console for CORS errors

### Getting Help

If you encounter issues not covered here:

1. Check Firebase Status: https://status.firebase.google.com/
2. Review Firebase Documentation: https://firebase.google.com/docs
3. Check project logs: `firebase functions:log` (if using functions)
4. Enable debug mode: `firebase deploy --debug`

## Best Practices

### Before Every Deployment

- [ ] Run tests: `npm test`
- [ ] Run linting: `npm run lint`
- [ ] Test locally: `npm run preview`
- [ ] Review changes: `git diff`
- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md

### After Every Deployment

- [ ] Verify deployment URL works
- [ ] Test critical user flows
- [ ] Check Firebase Analytics
- [ ] Monitor error logs
- [ ] Test on mobile devices
- [ ] Verify SSL certificate

### Security Checklist

- [ ] Environment variables not committed
- [ ] Firebase rules properly configured
- [ ] API keys restricted (if applicable)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies up to date

## Continuous Integration/Continuous Deployment (CI/CD)

For automated deployments, you can set up CI/CD with GitHub Actions, GitLab CI, or other platforms.

### Example GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build:prod
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          # Add other environment variables
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

### Setting Up CI/CD

1. Generate Firebase service account key
2. Add secrets to your CI/CD platform
3. Configure workflow file
4. Test with a preview deployment first
5. Enable automatic deployments

## Monitoring and Maintenance

### Post-Deployment Monitoring

- Monitor Firebase Analytics for traffic
- Check Firebase Performance Monitoring
- Review error logs regularly
- Monitor uptime and response times
- Track Core Web Vitals

### Regular Maintenance

- Update dependencies monthly: `npm update`
- Review and rotate API keys quarterly
- Audit Firebase rules and permissions
- Review and optimize bundle size
- Update documentation

---

**Last Updated**: 2024
**Version**: 1.0.0
