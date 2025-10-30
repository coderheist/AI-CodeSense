# AI CodeSense

AI-powered code review, test generation, and repository analysis platform built with MERN stack and Google Gemini AI.

## Features

- 🔍 **AI Code Review** - Get intelligent code reviews with security, performance, and best practice suggestions
- 🧪 **Test Case Generation** - Automatically generate comprehensive test suites
- 📊 **Code Metrics Analysis** - Analyze time/space complexity with Big O notation
- 🔎 **Repository Analyzer** - Analyze GitHub repositories with AI-powered insights
- 💬 **AI Chat** - Interactive chat about your code and repositories
- 🎯 **Master Prompt Generation** - Generate comprehensive prompts for V0.dev/Lovable
- 🔐 **OAuth Authentication** - Login with Google, GitHub, or LinkedIn

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Monaco Editor
- Framer Motion
- React Markdown
- Firebase Authentication

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Gemini 2.0 Flash API
- GitHub API Integration
- Firebase Admin

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB
- Google Gemini API Key
- GitHub Personal Access Token
- Firebase Project

### Installation

1. Clone the repository
```bash
git clone https://github.com/coderheist/AI-CodeSense.git
cd AI-CodeSense
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
FIREBASE_SERVICE_ACCOUNT=path_to_firebase_service_account.json
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend (in a new terminal)
```bash
cd client
npm run dev
```

3. Open http://localhost:5173 in your browser

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for Vercel.

## License

MIT

## Author

Built with ❤️ using AI-powered development
