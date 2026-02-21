# Firebase Hosting Setup Guide

This guide covers the complete setup process for deploying the portfolio to Firebase Hosting with the custom domain uddhavbhople.in.

## Prerequisites

1. Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Firebase project created (if not already exists)

3. Access to domain DNS settings for uddhavbhople.in

## Configuration Files

### firebase.json

The `firebase.json` file at the project root configures Firebase Hosting with the following features:

#### Public Directory
- **public**: `dist` - Serves the built production files from Vite

#### Single-Page Application Routing
- **rewrites**: All routes (`**`) are rewritten to `/index.html` to enable client-side routing
- This allows deep linking to work correctly (e.g., `/projects`, `/about`)

#### Caching Headers
Optimized caching strategy for different asset types:

1. **Static Assets** (images, JS, CSS, fonts):
   - `Cache-Control: public, max-age=31536000, immutable`
   - Cached for 1 year since they have content hashes in filenames
   - Marked as immutable for optimal browser caching

2. **HTML Files**:
   - `Cache-Control: public, max-age=0, must-revalidate`
   - Always revalidated to ensure users get the latest version

#### Security Headers
Applied to all responses:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking attacks
- **X-XSS-Protection**: `1; mode=block` - Enables XSS filtering
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts access to geolocation, microphone, and camera

#### URL Formatting
- **cleanUrls**: `true` - Removes `.html` extensions from URLs
- **trailingSlash**: `false` - Removes trailing slashes from URLs

### .firebaserc

The `.firebaserc` file stores the Firebase project configuration:

```json
{
  "projects": {
    "default": "portfolio-project-id"
  }
}
```

**Action Required**: Update `portfolio-project-id` with your actual Firebase project ID.

## Initial Setup

### 1. Login to Firebase

```bash
firebase login
```

This opens a browser window for authentication.

### 2. Initialize Firebase Project (if not already done)

If you haven't initialized Firebase in this project:

```bash
firebase init hosting
```

Select:
- Use an existing project (or create a new one)
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (optional)

### 3. Update Firebase Project ID

Edit `.firebaserc` and replace `portfolio-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

You can find your project ID in the Firebase Console under Project Settings.

## Building and Deploying

### Build for Production

```bash
npm run build
```

This creates optimized production files in the `dist` directory with:
- Minified JavaScript and CSS
- Code splitting (vendor bundles)
- Compressed assets (gzip and brotli)
- Legacy browser support

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or use the npm script:

```bash
npm run deploy
```

### Preview Before Deploying

Test the deployment locally:

```bash
firebase serve
```

This serves the `dist` directory locally at `http://localhost:5000`.

## Custom Domain Setup (uddhavbhople.in)

### 1. Add Custom Domain in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Hosting** in the left sidebar
4. Click **Add custom domain**
5. Enter `uddhavbhople.in`
6. Click **Continue**

### 2. Verify Domain Ownership

Firebase will provide a TXT record for domain verification:

```
Type: TXT
Name: @
Value: [provided by Firebase]
```

Add this record to your domain's DNS settings and click **Verify**.

### 3. Configure DNS Records

After verification, Firebase provides DNS records to point your domain to Firebase Hosting:

#### For Root Domain (uddhavbhople.in)

Add these A records:

```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195
```

#### For www Subdomain (optional)

If you want www.uddhavbhople.in to work:

```
Type: CNAME
Name: www
Value: uddhavbhople.in
```

### 4. Wait for SSL Certificate Provisioning

Firebase automatically provisions an SSL certificate for your custom domain. This can take:
- **A few minutes** if DNS is already propagated
- **Up to 24 hours** in some cases

You can check the status in the Firebase Console under Hosting > Custom domains.

### 5. Verify HTTPS Access

Once the SSL certificate is provisioned, verify access:

```bash
curl -I https://uddhavbhople.in
```

You should see:
- HTTP/2 200 status
- Valid SSL certificate
- Security headers configured in firebase.json

## DNS Configuration Details

### Recommended DNS Provider Settings

If using a DNS provider like Cloudflare, Namecheap, or GoDaddy:

1. **Disable DNS Proxy** (if using Cloudflare):
   - Set DNS records to "DNS only" (gray cloud icon)
   - This allows Firebase to manage SSL certificates

2. **TTL Settings**:
   - Use automatic or 3600 seconds (1 hour)
   - Lower TTL during initial setup for faster propagation

3. **Remove Conflicting Records**:
   - Remove any existing A or CNAME records for @ and www
   - Keep only the Firebase-provided records

### DNS Propagation Check

Check DNS propagation status:

```bash
# Check A records
dig uddhavbhople.in A

# Check from multiple locations
https://www.whatsmydns.net/#A/uddhavbhople.in
```

## Deployment Workflow

### Standard Deployment

```bash
# 1. Build the project
npm run build

# 2. Test locally (optional)
firebase serve

# 3. Deploy to Firebase
firebase deploy --only hosting
```

### Deployment with Validation

```bash
# 1. Run linting
npm run lint

# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Deploy
firebase deploy --only hosting
```

## Rollback Procedure

If you need to rollback to a previous deployment:

### View Deployment History

```bash
firebase hosting:channel:list
```

### Rollback to Previous Version

1. Go to Firebase Console > Hosting
2. Click on the **Release history** tab
3. Find the previous working version
4. Click **Rollback** next to that version

Or use the CLI:

```bash
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL TARGET_SITE_ID:live
```

## Monitoring and Analytics

### Deployment Status

Check deployment status:

```bash
firebase hosting:channel:list
```

### View Hosting Metrics

In Firebase Console:
1. Go to **Hosting**
2. View metrics for:
   - Requests per second
   - Bandwidth usage
   - Response times
   - Error rates

### Firebase Analytics Integration

The portfolio automatically logs page views and events to Firebase Analytics. View analytics in:
- Firebase Console > Analytics
- Google Analytics (if linked)

## Troubleshooting

### Issue: "Site not found" after deployment

**Solution**:
1. Verify the build completed successfully
2. Check that `dist` directory exists and contains files
3. Verify firebase.json has correct `public` directory
4. Redeploy: `firebase deploy --only hosting`

### Issue: Custom domain shows "Not connected"

**Solution**:
1. Verify DNS records are correctly configured
2. Check DNS propagation: `dig uddhavbhople.in`
3. Wait up to 24 hours for SSL certificate provisioning
4. Ensure no conflicting DNS records exist

### Issue: 404 errors on page refresh

**Solution**:
1. Verify rewrites are configured in firebase.json
2. Ensure `"source": "**"` rewrites to `/index.html`
3. Redeploy after fixing configuration

### Issue: Assets not loading (CORS errors)

**Solution**:
1. Check that assets are in the `dist` directory
2. Verify asset paths in HTML are relative or absolute
3. Check browser console for specific errors
4. Verify security headers aren't blocking resources

### Issue: Old version still showing after deployment

**Solution**:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check Cache-Control headers are correct
3. Verify deployment completed: `firebase hosting:channel:list`
4. Check Firebase Console for deployment status

## Security Best Practices

### 1. Environment Variables

Never commit sensitive data to the repository:
- Firebase API keys should be in `src/config/firebase.json` (gitignored)
- Use environment variables for production secrets

### 2. Security Rules

Configure Firebase Security Rules for:
- Realtime Database: Restrict write access
- Storage: Validate file uploads
- Analytics: Configure data retention

### 3. Content Security Policy

Consider adding CSP headers in firebase.json:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com"
}
```

### 4. Regular Updates

Keep dependencies updated:

```bash
npm audit
npm update
```

## Performance Optimization

### 1. Preconnect to Firebase

Already configured in index.html:

```html
<link rel="preconnect" href="https://firebasestorage.googleapis.com">
<link rel="dns-prefetch" href="https://firebasestorage.googleapis.com">
```

### 2. Compression

Firebase Hosting automatically serves gzip and brotli compressed files if they exist in the `dist` directory. Vite creates these during build.

### 3. CDN Distribution

Firebase Hosting uses a global CDN automatically. No additional configuration needed.

### 4. Cache Optimization

The caching strategy in firebase.json is already optimized:
- Static assets: 1 year cache
- HTML: No cache (always fresh)

## Continuous Deployment (Optional)

### GitHub Actions

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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup](https://firebase.google.com/docs/hosting/custom-domain)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Hosting Behavior Configuration](https://firebase.google.com/docs/hosting/full-config)

## Support

For issues or questions:
1. Check Firebase Console for deployment status
2. Review Firebase Hosting logs
3. Check DNS propagation status
4. Consult Firebase documentation
5. Contact Firebase support if needed
