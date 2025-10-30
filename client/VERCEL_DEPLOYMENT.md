# Vercel Deployment Guide for AI CodeSense

## Current Issue: Blank Page

Your Vercel deployment is showing a blank page. This is usually caused by:
1. Missing environment variables
2. Incorrect routing configuration
3. Build errors

## ✅ Fixed Issues

I've updated your `vercel.json` to properly handle SPA routing.

## 🔧 Steps to Fix Your Deployment

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Project Settings → Environment Variables**

Add the following variables:

```
VITE_FIREBASE_API_KEY=AIzaSyDsMhq7IzlmY9XZRAItGlk0EDuNnf9hGNs
VITE_FIREBASE_AUTH_DOMAIN=codesense-cc690.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=codesense-cc690
VITE_FIREBASE_STORAGE_BUCKET=codesense-cc690.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=76750654675
VITE_FIREBASE_APP_ID=1:76750654675:web:8c17ae25fa4361771c5826
VITE_API_URL=https://ai-codesense-32rf.onrender.com
```

**Important:** Make sure to add these to all environments (Production, Preview, Development)

### 2. Redeploy Your Application

After adding environment variables:

#### Option A: Via Vercel Dashboard
1. Go to Deployments tab
2. Find the latest deployment
3. Click "Redeploy"

#### Option B: Via Git Push
```bash
git add .
git commit -m "Fix: Update vercel.json for proper SPA routing"
git push origin main
```

### 3. Verify the Build Logs

In Vercel dashboard:
1. Go to Deployments
2. Click on the latest deployment
3. Check the "Build Logs" to ensure there are no errors

### 4. Common Issues & Solutions

#### Issue: Still seeing a blank page
**Solution:** 
- Clear your browser cache (Ctrl + Shift + R)
- Check browser console for errors (F12)
- Verify environment variables are set correctly

#### Issue: 404 errors on routes
**Solution:** 
- The updated `vercel.json` should fix this
- Ensure you've redeployed after the change

#### Issue: Firebase errors
**Solution:**
- Verify all Firebase environment variables are set in Vercel
- Check Firebase console for any domain restrictions

### 5. Testing Your Deployment

After redeployment, test these URLs:
- https://ai-code-sense.vercel.app/ (should show landing page)
- https://ai-code-sense.vercel.app/login (should show login page)
- https://ai-code-sense.vercel.app/about (should show about page)

## 📋 Deployment Checklist

- [ ] Updated `vercel.json` configuration
- [ ] Set all environment variables in Vercel dashboard
- [ ] Redeployed the application
- [ ] Verified build logs show success
- [ ] Tested main routes
- [ ] Checked browser console for errors
- [ ] Verified API connectivity

## 🔍 Debug Mode

If issues persist, add this to your environment variables temporarily:

```
VITE_DEBUG=true
```

Then check the browser console for detailed logs.

## 📞 Support

If you continue to see a blank page after following these steps:
1. Share the Vercel build logs
2. Share any browser console errors
3. Verify the exact URL you're accessing

## 🎯 Quick Fix Commands

Run these in your client directory:

```bash
# Commit the vercel.json changes
git add vercel.json
git commit -m "Fix: Update Vercel configuration for SPA routing"
git push origin main
```

Then set environment variables in Vercel dashboard and redeploy.
