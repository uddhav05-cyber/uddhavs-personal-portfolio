# Custom Domain Setup Instructions for uddhavbhople.in

This document provides step-by-step instructions for setting up the custom domain `uddhavbhople.in` with Firebase Hosting.

## Overview

Firebase Hosting will serve your portfolio at `https://uddhavbhople.in` with:
- Automatic SSL certificate provisioning
- Global CDN distribution
- Optimized caching and security headers
- Single-page application routing

## Prerequisites

- Domain `uddhavbhople.in` registered and owned by you
- Access to domain DNS management (through your domain registrar)
- Firebase project created and configured
- Portfolio deployed to Firebase Hosting

## Step-by-Step Setup

### Step 1: Deploy to Firebase Hosting First

Before adding a custom domain, deploy your site to Firebase Hosting:

```bash
# Build and deploy
npm run deploy
```

Verify the deployment works at your Firebase subdomain (e.g., `your-project.web.app`).

### Step 2: Add Custom Domain in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Hosting** in the left sidebar
4. Click **Add custom domain** button
5. Enter `uddhavbhople.in` in the domain field
6. Click **Continue**

### Step 3: Verify Domain Ownership

Firebase will provide a TXT record for domain verification.

#### Example TXT Record:
```
Type: TXT
Name: @ (or leave blank, depending on your DNS provider)
Value: firebase=your-verification-code-here
```

#### Add TXT Record to Your DNS:

**For Cloudflare:**
1. Log in to Cloudflare
2. Select your domain `uddhavbhople.in`
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Select **TXT** type
6. Name: `@`
7. Content: Paste the verification value from Firebase
8. TTL: Auto
9. Click **Save**

**For Namecheap:**
1. Log in to Namecheap
2. Go to **Domain List** → Select `uddhavbhople.in`
3. Click **Manage** → **Advanced DNS**
4. Click **Add New Record**
5. Type: **TXT Record**
6. Host: `@`
7. Value: Paste the verification value from Firebase
8. TTL: Automatic
9. Click **Save**

**For GoDaddy:**
1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Click **Add** under Records
4. Type: **TXT**
5. Name: `@`
6. Value: Paste the verification value from Firebase
7. TTL: 1 Hour
8. Click **Save**

#### Verify in Firebase Console:

After adding the TXT record:
1. Wait 5-10 minutes for DNS propagation
2. Return to Firebase Console
3. Click **Verify** button
4. If verification fails, wait longer and try again

### Step 4: Configure DNS A Records

After verification, Firebase will provide A records to point your domain to Firebase Hosting.

#### Required A Records:
```
Type: A
Name: @
Value: 151.101.1.195

Type: A
Name: @
Value: 151.101.65.195
```

#### Add A Records to Your DNS:

**For Cloudflare:**
1. Go to **DNS** → **Records**
2. **Remove any existing A records for `@`** (important!)
3. Click **Add record**
4. Type: **A**
5. Name: `@`
6. IPv4 address: `151.101.1.195`
7. Proxy status: **DNS only** (gray cloud icon) - Important!
8. TTL: Auto
9. Click **Save**
10. Repeat for the second A record with IP `151.101.65.195`

**Important for Cloudflare Users:**
- Set proxy status to **DNS only** (gray cloud icon)
- This allows Firebase to manage SSL certificates
- Do NOT use Cloudflare's proxy (orange cloud)

**For Namecheap:**
1. Go to **Advanced DNS**
2. **Remove any existing A records for `@`**
3. Click **Add New Record**
4. Type: **A Record**
5. Host: `@`
6. Value: `151.101.1.195`
7. TTL: Automatic
8. Click **Save**
9. Repeat for the second A record with IP `151.101.65.195`

**For GoDaddy:**
1. Go to **DNS** → **Records**
2. **Remove any existing A records for `@`**
3. Click **Add**
4. Type: **A**
5. Name: `@`
6. Value: `151.101.1.195`
7. TTL: 1 Hour
8. Click **Save**
9. Repeat for the second A record with IP `151.101.65.195`

### Step 5: Configure www Subdomain (Optional)

If you want `www.uddhavbhople.in` to also work:

#### Add CNAME Record:
```
Type: CNAME
Name: www
Value: uddhavbhople.in
```

Follow the same process as above, but select **CNAME** type instead of **A**.

### Step 6: Wait for SSL Certificate Provisioning

Firebase automatically provisions an SSL certificate for your domain.

**Timeline:**
- **Best case:** 5-15 minutes
- **Typical:** 1-2 hours
- **Worst case:** Up to 24 hours

**Check Status:**
1. Go to Firebase Console → Hosting
2. Look at your custom domain status
3. Status will show:
   - **Pending:** Certificate is being provisioned
   - **Connected:** Certificate is ready, site is live

**Why it takes time:**
- DNS propagation across global servers
- SSL certificate generation and validation
- CDN distribution setup

### Step 7: Verify HTTPS Access

Once the status shows **Connected**:

1. Open a browser
2. Navigate to `https://uddhavbhople.in`
3. Verify:
   - Site loads correctly
   - Green padlock icon appears (valid SSL)
   - No certificate warnings
   - All assets load properly

**Test with curl:**
```bash
curl -I https://uddhavbhople.in
```

Expected response:
```
HTTP/2 200
content-type: text/html; charset=utf-8
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
...
```

## Troubleshooting

### Issue: Domain verification fails

**Solutions:**
1. Wait 15-30 minutes for DNS propagation
2. Verify TXT record is correct (no extra spaces)
3. Check DNS propagation: `dig uddhavbhople.in TXT`
4. Try verification again

### Issue: SSL certificate stuck on "Pending"

**Solutions:**
1. Wait up to 24 hours
2. Verify A records are correct
3. Ensure no conflicting DNS records exist
4. If using Cloudflare, ensure proxy is disabled (gray cloud)
5. Check Firebase Console for error messages

### Issue: Site shows "Site not found"

**Solutions:**
1. Verify deployment completed: `firebase hosting:channel:list`
2. Check that `dist` directory has files
3. Redeploy: `npm run deploy`
4. Clear browser cache

### Issue: Mixed content warnings (HTTP/HTTPS)

**Solutions:**
1. Ensure all asset URLs use HTTPS or relative paths
2. Check for hardcoded HTTP URLs in code
3. Update Firebase Storage URLs to use HTTPS
4. Rebuild and redeploy

### Issue: DNS not propagating

**Check DNS propagation:**
```bash
# Check A records
dig uddhavbhople.in A

# Check from multiple locations
# Visit: https://www.whatsmydns.net/#A/uddhavbhople.in
```

**Solutions:**
1. Wait longer (up to 48 hours in rare cases)
2. Flush local DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Linux: `sudo systemd-resolve --flush-caches`
3. Try accessing from different network/device

### Issue: Old site still showing

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Try incognito/private browsing mode
3. Check deployment timestamp in Firebase Console
4. Verify new build was deployed

## DNS Provider-Specific Notes

### Cloudflare

**Advantages:**
- Fast DNS propagation
- Additional DDoS protection
- Free SSL (but use Firebase's instead)

**Important Settings:**
- Set A records to **DNS only** (gray cloud)
- Disable Cloudflare proxy for Firebase Hosting
- SSL/TLS mode: Full (not Flexible)

### Namecheap

**Advantages:**
- Simple interface
- Reliable DNS

**Important Settings:**
- Use Advanced DNS tab for records
- TTL can be set to Automatic
- Remove default parking page records

### GoDaddy

**Advantages:**
- Popular and widely used
- Good support

**Important Settings:**
- Remove default forwarding if set
- Use 1 Hour TTL for faster updates
- May need to disable domain forwarding

## Verification Checklist

After setup, verify everything works:

- [ ] `https://uddhavbhople.in` loads correctly
- [ ] SSL certificate is valid (green padlock)
- [ ] All pages and sections load
- [ ] Images and assets load properly
- [ ] Navigation works (client-side routing)
- [ ] Deep links work (e.g., `/projects`)
- [ ] Firebase Analytics is recording visits
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Performance is good (Lighthouse test)

## Monitoring and Maintenance

### Regular Checks

**Weekly:**
- Check Firebase Console for errors
- Review Analytics data
- Test site functionality

**Monthly:**
- Review SSL certificate status (auto-renewed)
- Check for Firebase updates
- Review hosting metrics

### SSL Certificate Renewal

Firebase automatically renews SSL certificates. No action needed.

**Certificate Details:**
- Issued by: Let's Encrypt (via Firebase)
- Validity: 90 days
- Auto-renewal: Yes
- Cost: Free

### DNS Changes

If you need to change DNS providers:
1. Add new DNS records at new provider
2. Update nameservers at domain registrar
3. Wait for propagation (24-48 hours)
4. Verify site still works
5. Remove old DNS records

## Support Resources

### Firebase Support
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Custom Domain Setup Guide](https://firebase.google.com/docs/hosting/custom-domain)
- [Firebase Support](https://firebase.google.com/support)

### DNS Provider Support
- [Cloudflare Support](https://support.cloudflare.com/)
- [Namecheap Support](https://www.namecheap.com/support/)
- [GoDaddy Support](https://www.godaddy.com/help)

### Tools
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [SSL Certificate Checker](https://www.sslshopper.com/ssl-checker.html)
- [Firebase Status](https://status.firebase.google.com/)

## Security Best Practices

1. **Enable HTTPS only** - Firebase does this automatically
2. **Keep Firebase SDK updated** - Run `npm update` regularly
3. **Monitor Firebase Console** - Check for security alerts
4. **Use strong Firebase Security Rules** - Restrict database/storage access
5. **Enable Firebase App Check** - Protect against abuse (optional)

## Cost Considerations

Firebase Hosting is free for most portfolios:

**Free Tier Includes:**
- 10 GB storage
- 360 MB/day bandwidth
- Custom domain with SSL
- Global CDN

**Typical Portfolio Usage:**
- Storage: ~50-200 MB
- Bandwidth: ~1-10 GB/month
- Cost: $0 (within free tier)

**If you exceed free tier:**
- Pay-as-you-go pricing
- ~$0.026 per GB storage
- ~$0.15 per GB bandwidth

## Next Steps

After custom domain is set up:

1. Update social media links to use new domain
2. Update resume/CV with new portfolio URL
3. Submit sitemap to Google Search Console
4. Set up Google Analytics (if not using Firebase Analytics)
5. Share your portfolio!

## Conclusion

Your portfolio should now be accessible at `https://uddhavbhople.in` with:
- ✅ Valid SSL certificate
- ✅ Fast global CDN delivery
- ✅ Optimized caching
- ✅ Security headers
- ✅ Single-page application routing

For deployment updates, see [deployment-quick-start.md](./deployment-quick-start.md).
