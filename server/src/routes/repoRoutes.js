import express from 'express';
import { analyzeRepo, explainFile, getRepoStructure, chatAboutRepo, generatePrompt } from '../controllers/repoController.js';

const router = express.Router();

// Analyze entire repository
router.post('/analyze', analyzeRepo);

// Explain specific file
router.post('/explain', explainFile);

// Get repository structure
router.get('/structure', getRepoStructure);

// Chat about repository
router.post('/chat', chatAboutRepo);

// Generate master prompt for V0.dev/Lovable
router.post('/generate-prompt', generatePrompt);

export default router;
