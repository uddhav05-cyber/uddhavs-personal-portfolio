# Quick Deploy Guide - 5 Minutes to Live!

## Super Fast Deployment

### Option 1: Automated Script (Recommended)

**Windows:**
```powershell
.\deploy.ps1
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Commands

```bash
# 1. Install Firebase CLI (first time only)
npm install -g firebase-tools

# 2. Login to Firebase (first time only)
firebase login

# 3. Initialize Firebase (first time only)
firebase init hosting
# Select: dist, yes (SPA), no (GitHub), no (overwrite)

# 4. Build and Deploy
npm run build
firebase deploy
```

---

## First Time Setup (10 minutes)

### 1. Create Firebase Project
- Go to: https://console.firebase.google.com/
- Click "Add project"
- Name: `uddhav-portfolio`
- Disable Analytics (optional)
- Click "Create project"

### 2. Get Your Project ID
- After creation, note your project ID
- Example: `uddhav-portfolio-abc123`

### 3. Update `.firebaserc`
Replace `portfolio-project-id` with your actual project ID:
```json
{
  "projects": {
    "default": "uddhav-portfolio-abc123"
  }
}
```

### 4. Deploy!
```bash
npm run build
firebase deploy
```

**Done!** Your site is live at: `https://your-project-id.web.app`

---

## Connect Custom Domain (uddhavbhople.in)

### Quick Steps:

1. **Firebase Console**
   - Go to Hosting → Add custom domain
   - Enter: `uddhavbhople.in`

2. **Add DNS Records** (at your domain registrar)
   ```
   Type: A
   Name: @
   Value: 151.101.1.195
   
   Type: A
   Name: @
   Value: 151.101.65.195
   
   Type: TXT
   Name: @
   Value: [Firebase verification code]
   ```

3. **Wait for Verification**
   - Usually 1-24 hours
   - Firebase will auto-provision SSL

4. **Done!**
   - Your site will be live at `https://uddhavbhople.in`

---

## Update Your Site

Anytime you make changes:

```bash
npm run build
firebase deploy
```

Or use the shortcut:
```bash
npm run deploy:full
```

---

## Troubleshooting

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### "Not logged in"
```bash
firebase login
```

### "Build failed"
```bash
rm -rf node_modules dist
npm install
npm run build
```

### "Deployment failed"
```bash
firebase logout
firebase login
firebase deploy
```

---

## Cost: $0/month

Firebase Free Tier includes:
- ✅ 10 GB storage
- ✅ 360 MB/day bandwidth (~10,000 visits/day)
- ✅ Free SSL certificate
- ✅ Custom domain
- ✅ Global CDN

**Your portfolio will be 100% free!**

---

## Need Help?

1. Read full guide: `DEPLOYMENT-STEPS.md`
2. Check Firebase docs: https://firebase.google.com/docs/hosting
3. DNS issues: https://dnschecker.org/

---

**Ready? Run this now:**

```bash
npm run build && firebase deploy
```

🚀 Your portfolio will be live in 2 minutes!
