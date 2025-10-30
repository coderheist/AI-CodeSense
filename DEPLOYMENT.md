# Deployment Guide - Vercel

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Code must be on GitHub (already done ✅)
3. **Environment Variables**: Prepare all your API keys and secrets

## Steps to Deploy

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your GitHub repository: `coderheist/AI-CodeSense`
4. Vercel will auto-detect the configuration from `vercel.json`
5. Configure **Environment Variables** (see below)
6. Click **"Deploy"**

### 3. Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

#### Backend Variables
```
MONGODB_URI=your_mongodb_atlas_connection_string
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_personal_access_token
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
NODE_ENV=production
```

#### Frontend Variables
```
VITE_API_URL=https://your-project.vercel.app
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. MongoDB Atlas Setup

Since Vercel is serverless, you **must** use MongoDB Atlas (cloud):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Whitelist Vercel's IP (or use 0.0.0.0/0 for all IPs)
5. Add connection string to `MONGODB_URI` environment variable

### 5. Update Firebase Service Account

For Vercel, you need to stringify your Firebase service account JSON:

```bash
# Copy the entire JSON content from your firebase service account file
# Then paste it as a single-line string in FIREBASE_SERVICE_ACCOUNT
```

Or update `server/src/config/firebaseAdmin.js` to use individual environment variables.

### 6. Redeploy

After setting environment variables:
- Vercel will automatically redeploy
- Or manually trigger: **Deployments → Latest → Redeploy**

## Verify Deployment

1. Check **Frontend**: https://your-project.vercel.app
2. Check **API**: https://your-project.vercel.app/api/health
3. Should return: `{"status":"OK","message":"AI CodeSense API is running"}`

## Important Notes

⚠️ **Serverless Limitations**:
- Each API call has a 10-second timeout on free tier
- Cold starts may add latency
- No persistent WebSocket connections

⚠️ **CORS Configuration**:
- Update `CLIENT_URL` in backend to your Vercel domain
- Or use wildcard (not recommended for production)

⚠️ **MongoDB Connection**:
- Use connection pooling
- Keep connections minimal
- Close connections properly

## Alternative: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add MONGODB_URI
vercel env add GEMINI_API_KEY
# ... add all other variables

# Redeploy
vercel --prod
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Returns 500
- Check Function Logs in Vercel dashboard
- Verify environment variables are set
- Check MongoDB Atlas whitelist

### CORS Errors
- Update `CLIENT_URL` in backend `.env`
- Ensure it matches your Vercel domain

### Cold Starts
- Upgrade to Vercel Pro for better performance
- Or consider splitting: Frontend on Vercel, Backend on Render/Railway

## Post-Deployment

1. **Update Firebase OAuth**:
   - Add Vercel domain to authorized domains in Firebase Console
   - Update redirect URIs for GitHub/LinkedIn OAuth

2. **Test All Features**:
   - Code Review
   - Test Generation
   - Repository Analyzer
   - AI Chat
   - Master Prompt Generation

3. **Monitor**:
   - Check Vercel Analytics
   - Monitor MongoDB Atlas usage
   - Watch Gemini API quotas

## Support

If deployment fails, check:
- Vercel Function Logs
- Browser Console
- Network Tab (DevTools)

Good luck! 🚀
