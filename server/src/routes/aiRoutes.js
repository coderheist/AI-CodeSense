import express from 'express';
import {
  reviewCode,
  generateTests,
  summarize,
  chat,
  getMetrics,
} from '../controllers/aiController.js';

const router = express.Router();

// Test endpoint to verify API key
router.get('/test-key', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    hasKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 20) : 'none',
    keyLength: apiKey ? apiKey.length : 0,
    isValidFormat: apiKey && apiKey.startsWith('AIza') && apiKey.length > 30
  });
});

// AI Routes
router.post('/review', reviewCode);
router.post('/testgen', generateTests);
router.post('/summary', summarize);
router.post('/chat', chat);
router.get('/metrics', getMetrics);

export default router;
