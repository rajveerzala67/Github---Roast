import { validateAndNormalizeGithubInput } from '../validators/inputValidator.js';
import { fetchGithubData } from '../services/githubService.js';
import { calculateDeveloperScore } from '../services/scoringService.js';
import { generateAiRoast } from '../services/geminiService.js';
import { logger } from '../utils/logger.js';

// High-speed in-memory cache (10 minutes TTL)
const profileCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function analyzeProfile(req, res, next) {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a GitHub profile URL or username.'
      });
    }

    // 1. Validate & normalize input
    const validation = validateAndNormalizeGithubInput(githubUrl);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { username } = validation;
    const cacheKey = username.toLowerCase();

    // Check fast cache
    const cached = profileCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      logger.info(`Returning ultra-fast cached analysis for: ${username}`);
      return res.status(200).json({
        ...cached.data,
        analysisId: `roast_${username}_${Date.now()}` // Fresh analysisId for audio trigger
      });
    }

    logger.info(`Starting high-speed analysis for normalized username: ${username}`);

    // 2. Fetch GitHub API data in parallel
    const { profile, metrics } = await fetchGithubData(username);

    // 3. Compute deterministic score & categories instantly
    const scoring = calculateDeveloperScore(profile, metrics);

    // 4. Generate AI roast with fast 4.5s threshold
    const aiAnalysis = await generateAiRoast(profile, metrics, scoring);

    const responseData = {
      success: true,
      analysisId: `roast_${username}_${Date.now()}`,
      profile,
      metrics,
      scoring,
      ai: aiAnalysis,
      timestamp: new Date().toISOString()
    };

    // Store in cache
    profileCache.set(cacheKey, {
      data: responseData,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    // Keep cache memory bounded
    if (profileCache.size > 200) {
      const oldestKey = profileCache.keys().next().value;
      profileCache.delete(oldestKey);
    }

    return res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
}
