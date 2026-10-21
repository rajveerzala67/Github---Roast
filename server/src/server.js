import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🌌 GitHub Roast Server launched into orbit on port ${PORT}`);
  logger.info(`📡 Client URL configured as: ${config.clientUrl}`);
  logger.info(`🤖 AI Engine: ${config.geminiApiKey ? 'Gemini AI Online' : 'Deterministic Mode (Set GEMINI_API_KEY to activate Gemini)'}`);
  logger.info(`🐙 GitHub Auth: ${config.githubToken ? 'Token configured (5000 req/hr)' : 'Public API mode (60 req/hr)'}`);
});
