import {
  getCodeReview,
  generateTestCases,
  summarizeCode,
  chatAboutCode,
  analyzeCodeMetrics,
} from '../services/aiService.js';

// POST /api/ai/review
export const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    console.log(`📝 Reviewing ${language} code (${code.length} characters)...`);
    
    const startTime = Date.now();
    const review = await getCodeReview(code, language);
    const metrics = await analyzeCodeMetrics(code, language);
    const duration = Date.now() - startTime;

    console.log(`✅ Review completed in ${duration}ms`);

    res.json({
      success: true,
      review,
      metrics,
      duration,
    });
  } catch (error) {
    console.error('❌ Review error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Failed to review code',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// POST /api/ai/testgen
export const generateTests = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const startTime = Date.now();
    const tests = await generateTestCases(code, language);
    const metrics = await analyzeCodeMetrics(code, language);
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      tests,
      metrics,
      duration,
    });
  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/ai/summary
export const summarize = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const startTime = Date.now();
    const summary = await summarizeCode(code, language);
    const metrics = await analyzeCodeMetrics(code, language);
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      summary,
      metrics,
      duration,
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/ai/chat
export const chat = async (req, res) => {
  try {
    const { code, language, question, chatHistory } = req.body;

    if (!code || !language || !question) {
      return res.status(400).json({ 
        error: 'Code, language, and question are required' 
      });
    }

    const response = await chatAboutCode(code, language, question, chatHistory);

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/ai/metrics
export const getMetrics = async (req, res) => {
  try {
    const { code, language } = req.query;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const metrics = analyzeCodeMetrics(code, language);

    res.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: error.message });
  }
};
