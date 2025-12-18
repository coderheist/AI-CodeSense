# 🚀 Production Deployment Guide

## ✅ Production Ready Changes Applied

### Backend Enhancements:
1. ✅ **Security Headers** - Helmet.js installed and configured
2. ✅ **Compression** - Response compression enabled
3. ✅ **Error Handling** - Production-safe error responses
4. ✅ **CORS** - Configured for production domains
5. ✅ **Proxy Trust** - Enabled for reverse proxies
6. ✅ **Retry Logic** - Exponential backoff for AI API calls
7. ✅ **404 Handler** - Proper not found responses

### Dependencies Added:
- `helmet` - Security headers
- `compression` - Response compression

## 📦 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Environment Variables

Create `.env` file in `server/` directory:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=github_pat_...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
CLIENT_URL=https://your-frontend.vercel.app
```

### 3. Deploy Backend

**Option A: Render.com**
1. Create new Web Service
2. Connect GitHub repo
3. Set:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
4. Add environment variables
5. Deploy!

**Option B: Railway.app**
1. Create new project
2. Add variables from .env
3. Deploy automatically from GitHub

**Option C: Heroku**
```bash
cd server
heroku create your-app-name
git push heroku main
```

### 4. Deploy Frontend

**Vercel (Recommended)**
```bash
cd client
npm install
vercel --prod
```

Or connect GitHub repo in Vercel dashboard.

## 🔐 Security Checklist

- [x] Helmet security headers enabled
- [x] CORS properly configured
- [x] Environment variables secured
- [x] Error messages sanitized for production
- [x] Response compression enabled
- [ ] Rate limiting (recommended to add)
- [ ] API key rotation policy

## 🎯 Post-Deployment

1. **Test All Endpoints**
   ```bash
   curl https://your-api.com/api/health
   ```

2. **Verify CORS**
   - Test from frontend domain
   - Check browser console for CORS errors

3. **Monitor Logs**
   - Check for errors
   - Monitor API response times
   - Watch Gemini API usage

4. **Update Frontend API URL**
   - Set `VITE_API_URL` to your deployed backend
   - Rebuild and redeploy frontend

## 🚨 Troubleshooting

### Server won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check logs for specific errors

### CORS errors
- Verify `CLIENT_URL` in server .env
- Add your frontend domain to CORS origins in `server.js`

### AI requests failing
- Check Gemini API key validity
- Verify retry logic is working (check logs for retry attempts)
- Check API quota/limits

### Firebase auth errors
- Verify Firebase Admin SDK credentials
- Check private key formatting (must include `\n`)
- Ensure service account has proper permissions

## 📊 Monitoring

### Health Check
```bash
curl https://your-api.com/api/health
```

### Test Endpoints
```bash
# Code Review
curl -X POST https://your-api.com/api/ai/review \
  -H "Content-Type: application/json" \
  -d '{"code":"console.log(\"test\")","language":"javascript"}'
```

## 🎉 Success!

Your AI CodeSense application is now production-ready with:
- Security hardening
- Performance optimization  
- Error handling
- Retry mechanisms
- Production-grade configuration

Need help? Check the logs and error messages for specific issues.
