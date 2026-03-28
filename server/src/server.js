import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import repoRoutes from './routes/repoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const vercelProjectName = process.env.VERCEL_PROJECT_NAME;
const allowGenericVercelPreview = process.env.ALLOW_VERCEL_PREVIEW !== 'false';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://codesense-cc690.web.app',
  'https://codesense-cc690.firebaseapp.com',
  'https://ai-code-sense.vercel.app',
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  // Accept local development origins on any port.
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }

  // Allow Vercel preview domains by default to avoid CORS failures in Preview deployments.
  if (allowGenericVercelPreview && /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return true;
  }

  // Allow project-specific Vercel preview domains when configured.
  if (vercelProjectName) {
    const escapedName = vercelProjectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const previewPattern = new RegExp(`^https://${escapedName}(?:-[a-z0-9-]+)?\\.vercel\\.app$`, 'i');
    return previewPattern.test(origin);
  }

  return false;
};

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

    if (isAllowedOrigin(origin)) {
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
  const readyState = mongoose.connection.readyState;
  const dbConnected = readyState === 1;

  // Keep health endpoint green to avoid platform restart loops while DB reconnects.
  res.status(200).json({
    status: dbConnected ? 'OK' : 'DEGRADED',
    message: 'AI CodeSense API is running',
    database: {
      connected: dbConnected,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][readyState] || 'unknown',
    },
  });
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

const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const connectWithRetry = async () => {
      const connected = await connectDB();

      if (!connected) {
        const retryMs = Number(process.env.DB_RETRY_INTERVAL_MS || 10000);
        console.warn(`⚠️ MongoDB unavailable. Retrying in ${retryMs / 1000}s...`);
        setTimeout(connectWithRetry, retryMs);
      }
    };

    connectWithRetry();

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the existing process or change PORT in .env.`);
      } else {
        console.error(`❌ Server startup error: ${error.message}`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
