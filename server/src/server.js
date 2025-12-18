import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import connectDB from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repoRoutes from './routes/repoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());

// Trust proxy for production (behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5000',
      'https://codesense-cc690.web.app',
      'https://codesense-cc690.firebaseapp.com',
      'https://ai-code-sense.vercel.app',
      process.env.CLIENT_URL
    ].filter(Boolean);
    
    // Allow all Vercel preview URLs
    if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/repo', repoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI CodeSense API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({ 
    error: isDevelopment ? err.message : 'Something went wrong!',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
