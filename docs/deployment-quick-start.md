# Firebase Hosting Deployment - Quick Start

This is a quick reference guide for deploying the portfolio to Firebase Hosting. For detailed information, see [firebase-hosting-setup.md](./firebase-hosting-setup.md).

## Prerequisites

```bash
# Install Firebase CLI globally (one-time setup)
npm install -g firebase-tools

# Login to Firebase (one-time setup)
firebase login
```

## First-Time Setup

### 1. Update Firebase Project ID

Edit `.firebaserc` and replace `portfolio-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

Find your project ID in the [Firebase Console](https://console.firebase.google.com/) under Project Settings.

### 2. Update Firebase SDK Configuration

Edit `src/config/firebase.json` with your Firebase project credentials from the Firebase Console.

## Deploy to Production

```bash
# Build and deploy in one command
npm run deploy
```

This will:
1. Build the project with Vite (`npm run build`)
2. Deploy to Firebase Hosting (`firebase deploy --only hosting`)

## Alternative Deployment Commands

```bash
# Build only
npm run build

# Deploy only (after building)
firebase deploy --only hosting

# Preview locally before deploying
npm run serve:firebase

# Deploy to preview channel (for testing)
npm run deploy:preview
```

## Custom Domain Setup (uddhavbhople.in)

### 1. Add Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Hosting** → **Add custom domain**
4. Enter `uddhavbhople.in`

### 2. Verify Domain Ownership

Add the TXT record provided by Firebase to your DNS settings:

```
Type: TXT
Name: @
Value: [provided by Firebase]
```

### 3. Configure DNS A Records

Add these A records to point your domain to Firebase:

```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195
```

### 4. Wait for SSL Certificate

Firebase automatically provisions an SSL certificate. This takes a few minutes to 24 hours.

### 5. Verify

Once complete, visit: https://uddhavbhople.in

## Deployment Checklist

Before deploying to production:

- [ ] Update `.firebaserc` with correct project ID
- [ ] Update `src/config/firebase.json` with Firebase credentials
- [ ] Run tests: `npm test`
- [ ] Run linting: `npm run lint`
- [ ] Build successfully: `npm run build`
- [ ] Test locally: `npm run serve:firebase`
- [ ] Deploy: `npm run deploy`
- [ ] Verify deployment at your domain

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails

```bash
# Check Firebase login status
firebase login --reauth

# Verify project ID
firebase projects:list

# Try deploying again
npm run deploy
```

### Custom Domain Not Working

1. Check DNS propagation: `dig uddhavbhople.in`
2. Wait up to 24 hours for SSL certificate
3. Verify DNS records match Firebase requirements
4. Check Firebase Console for domain status

### Old Version Still Showing

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check deployment status in Firebase Console
3. Verify build created new files in `dist/`

## Rollback

If you need to rollback to a previous version:

1. Go to Firebase Console → Hosting → Release history
2. Find the previous working version
3. Click **Rollback**

## Monitoring

View deployment status and metrics:

```bash
# List hosting channels
firebase hosting:channel:list

# View deployment history in Firebase Console
# Go to Hosting → Release history
```

## Support

For detailed documentation, see:
- [Firebase Hosting Setup Guide](./firebase-hosting-setup.md)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
