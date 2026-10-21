import { Router } from 'express';
import { analyzeProfile } from '../controllers/analyzeController.js';
import { analyzeRateLimiter } from '../middleware/rateLimiter.js';
import { config } from '../config/env.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'GitHub Roast API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiEngine: config.geminiApiKey ? 'Gemini AI + Fallback' : 'Deterministic Roast Engine',
    hasGithubToken: Boolean(config.githubToken)
  });
});

// Analyze profile endpoint
router.post('/analyze', analyzeRateLimiter, analyzeProfile);

export default router;
