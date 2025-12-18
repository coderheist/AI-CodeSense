#!/bin/bash

# AI CodeSense Production Deployment Script

echo "🚀 Starting production deployment..."

# 1. Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production

# 2. Install client dependencies and build
echo "📦 Installing client dependencies..."
cd ../client
npm install
echo "🔨 Building client..."
npm run build

# 3. Run tests (if you have tests)
# npm test

echo "✅ Production build complete!"
echo "📝 Next steps:"
echo "  1. Set up environment variables on your hosting platform"
echo "  2. Deploy server to Render/Railway/Heroku"
echo "  3. Deploy client build to Vercel/Netlify"
echo "  4. Update CORS origins in server/src/server.js"
echo "  5. Test all endpoints"
