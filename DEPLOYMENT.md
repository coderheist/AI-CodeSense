# 🚀 Production Deployment Guide

## Best Practice: Split Deployment

- **Frontend** → **Vercel** (Free, Fast CDN, Perfect for React)
- **Backend** → **Render** (Free tier, Perfect for Node.js + MongoDB)

This is the **industry-standard approach** for MERN stack apps.

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `coderheist/AI-CodeSense`
3. Configure:
   - **Name**: `ai-codesense-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=<your_mongodb_uri>
GEMINI_API_KEY=<your_gemini_key>
GITHUB_TOKEN=<your_github_token>
FIREBASE_PROJECT_ID=<your_firebase_project_id>
FIREBASE_PRIVATE_KEY=<your_firebase_private_key>
FIREBASE_CLIENT_EMAIL=<your_firebase_email>
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend will be live at: `https://ai-codesense-backend.onrender.com`

**Important:** Copy this URL - you'll need it for frontend!

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import repository: `coderheist/AI-CodeSense`
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Environment Variables

In Vercel, add these environment variables:

```bash
VITE_FIREBASE_API_KEY=<your_firebase_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>
VITE_API_URL=https://ai-codesense-backend.onrender.com/api
```

### Step 3: Deploy
1. Click **"Deploy"**
2. Your app will be live at: `https://ai-codesense-xyz.vercel.app`

---

## 🔄 Part 3: Connect Frontend & Backend

### Update Backend CORS

1. Go to Render Dashboard → Your Backend Service
2. Update environment variable:
   ```
   CLIENT_URL=https://ai-codesense-xyz.vercel.app
   ```
3. Render will auto-redeploy

### Update Firebase OAuth

1. Go to Firebase Console
2. **Authentication** → **Settings** → **Authorized domains**
3. Add: `ai-codesense-xyz.vercel.app`
4. Update OAuth providers (GitHub, LinkedIn) redirect URIs

---

## ✅ Verification Checklist

- [ ] Backend Health: `https://ai-codesense-backend.onrender.com/api/health`
- [ ] Frontend loads correctly
- [ ] Login with Google/GitHub/LinkedIn works
- [ ] Code Review feature works
- [ ] Test Generation works
- [ ] Repo Analyzer works
- [ ] AI Chat works

---

## 💰 Costs: **100% FREE**

- ✅ Render Free Tier: 750 hours/month
- ✅ Vercel Free Tier: Unlimited bandwidth
- ✅ MongoDB Atlas Free: 512MB storage

---

## 🎯 Auto-Deploy Setup

Both Render and Vercel auto-deploy when you push to `main` branch!

```bash
git add .
git commit -m "Update feature"
git push
# Both frontend and backend auto-deploy! 🚀
```

---

## 🐛 Troubleshooting

**Backend Issues:**
- Check Render logs in dashboard
- Whitelist `0.0.0.0/0` in MongoDB Atlas
- First request after sleep takes 30-60s (cold start)

**Frontend Issues:**
- Check Vercel deployment logs
- Verify `VITE_API_URL` is correct
- Clear Vercel cache: `vercel --force`

**CORS Errors:**
- Ensure `CLIENT_URL` matches frontend URL in Render

---

**Ready to deploy! 🎉**
