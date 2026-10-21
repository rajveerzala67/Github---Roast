import { validateAndNormalizeGithubInput } from '../validators/inputValidator.js';
import { fetchGithubData } from '../services/githubService.js';
import { calculateDeveloperScore } from '../services/scoringService.js';
import { generateAiRoast } from '../services/geminiService.js';
import { logger } from '../utils/logger.js';

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
    logger.info(`Starting analysis for normalized username: ${username}`);

    // 2. Fetch GitHub API data
    const { profile, metrics } = await fetchGithubData(username);

    // 3. Compute deterministic score & categories
    const scoring = calculateDeveloperScore(profile, metrics);

    // 4. Generate AI roast, strengths, and improvements
    const aiAnalysis = await generateAiRoast(profile, metrics, scoring);

    // 5. Generate unique analysis token for audio and rendering idempotency
    const analysisId = `roast_${username}_${Date.now()}`;

    return res.status(200).json({
      success: true,
      analysisId,
      profile,
      metrics,
      scoring,
      ai: aiAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
