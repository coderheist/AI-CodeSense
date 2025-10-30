# Firebase Deployment Guide

## 🚀 Deploy to Firebase (Recommended)

Firebase is perfect for your MERN stack app with free tier available!

### Prerequisites
- Firebase CLI installed
- Firebase project: `codesense-cc690` (already created ✅)

---

## Step-by-Step Deployment

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Install Dependencies

**Backend:**
```bash
cd server
npm install firebase-functions
```

**Frontend:**
```bash
cd ../client
npm install
```

### 4. Build Frontend
```bash
cd client
npm run build
```
This creates `client/dist/` folder.

### 5. Set Environment Variables

Firebase uses `.env` files differently. You need to set them via Firebase CLI:

```bash
# Set backend environment variables
firebase functions:config:set \
  mongodb.uri="YOUR_MONGODB_ATLAS_CONNECTION_STRING" \
  gemini.key="YOUR_GEMINI_API_KEY" \
  github.token="YOUR_GITHUB_TOKEN" \
  firebase.project_id="YOUR_FIREBASE_PROJECT_ID" \
  firebase.private_key="YOUR_PRIVATE_KEY_HERE" \
  firebase.client_email="YOUR_CLIENT_EMAIL_HERE"
```

**Or use `.env` in functions:**
Create `server/.env` (already exists) and Firebase will use it automatically.

### 6. Update API URLs

**In `client/.env` (before building):**
```bash
VITE_API_URL=https://codesense-cc690.web.app/api
```

Rebuild frontend:
```bash
cd client
npm run build
```

### 7. Deploy!

```bash
# From root directory
firebase deploy
```

Or deploy individually:
```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy functions only
firebase deploy --only functions
```

---

## 🔧 Configuration Files Created

✅ `firebase.json` - Firebase hosting and functions config
✅ `.firebaserc` - Project configuration
✅ `server/index.js` - Firebase Functions entry point

---

## 📝 After Deployment

Your app will be live at:
- **Frontend**: https://codesense-cc690.web.app
- **API**: https://codesense-cc690.web.app/api

### Update Environment Variables:

1. **Update `client/.env`:**
   ```bash
   VITE_API_URL=https://codesense-cc690.web.app/api
   ```

2. **Rebuild and redeploy:**
   ```bash
   cd client
   npm run build
   cd ..
   firebase deploy --only hosting
   ```

3. **Update Firebase Console:**
   - Add `codesense-cc690.web.app` to authorized domains
   - Update OAuth redirect URIs for GitHub/LinkedIn

---

## 🎯 Quick Deploy Commands

```bash
# Full deployment (first time)
cd client && npm run build && cd .. && firebase deploy

# Update frontend only
cd client && npm run build && cd .. && firebase deploy --only hosting

# Update backend only
firebase deploy --only functions
```

---

## 💰 Firebase Pricing

**Free Tier (Spark Plan):**
- ✅ 125K function invocations/month
- ✅ 10GB hosting storage
- ✅ 360MB/day function memory

**Paid Tier (Blaze - Pay as you go):**
- Required for external API calls (Gemini, GitHub, MongoDB Atlas)
- **You'll need to upgrade to Blaze plan**

### Enable Blaze Plan:
1. Go to Firebase Console
2. Click "Upgrade" in left sidebar
3. Add billing account
4. You only pay for what you use (very cheap for small apps)

---

## ⚠️ Important Notes

- **MongoDB Atlas**: Must whitelist Firebase Cloud Functions IPs (or use 0.0.0.0/0)
- **Environment Variables**: Stored securely in Firebase Functions config
- **Cold Starts**: First request after inactivity may be slow
- **Logs**: View at https://console.firebase.google.com/project/codesense-cc690/functions/logs

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean install
cd client && rm -rf node_modules && npm install && npm run build
cd ../server && rm -rf node_modules && npm install
```

### Functions Deploy Fails
- Ensure you're on **Blaze plan**
- Check function logs in Firebase Console

### API Returns 500
- Check Firebase Functions logs
- Verify environment variables are set
- Check MongoDB Atlas IP whitelist

---

## 🔄 CI/CD (Optional)

Add GitHub Actions for auto-deploy:

Create `.github/workflows/firebase-deploy.yml`:
```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd client && npm install
          cd ../server && npm install
      
      - name: Build frontend
        run: cd client && npm run build
      
      - name: Deploy to Firebase
        uses: w9jds/firebase-action@master
        with:
          args: deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Get token: `firebase login:ci`

---

## ✅ Ready to Deploy!

Run this now:
```bash
firebase login
cd client && npm run build && cd ..
firebase deploy
```

Good luck! 🚀
