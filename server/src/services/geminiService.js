import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { generateFallbackAnalysis } from './fallbackService.js';

// Schema validation for AI response
const aiResponseSchema = z.object({
  roast: z.string().min(10),
  compliment: z.string().min(10),
  verdict: z.string().optional(),
  strengths: z.array(
    z.object({
      title: z.string(),
      evidence: z.string()
    })
  ).min(1),
  improvements: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
      action: z.string()
    })
  ).min(2),
  categoryExplanations: z.array(
    z.object({
      category: z.string(),
      explanation: z.string()
    })
  ).optional()
});

/**
 * Generates an AI roast and recommendations using Gemini SDK (@google/genai).
 * If the API key is not configured, or if the API call fails or times out,
 * it seamlessly returns a structured fallback analysis so the application never breaks.
 */
export async function generateAiRoast(profile, metrics, scoring) {
  // If no Gemini API key is provided, use high-quality deterministic fallback immediately
  if (!config.geminiApiKey || config.geminiApiKey.trim().length === 0) {
    logger.info('No GEMINI_API_KEY detected. Using deterministic evidence-based roast engine.');
    return generateFallbackAnalysis(profile, metrics, scoring);
  }

  try {
    logger.info(`Invoking Gemini model (${config.geminiModel}) for user: ${profile.username}`);
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey.trim() });

    const evidenceSummary = {
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      company: profile.company,
      location: profile.location,
      accountAgeYears: profile.accountAgeYears,
      publicRepos: profile.publicRepos,
      followers: profile.followers,
      following: profile.following,
      totalStars: metrics.totalStars,
      totalForks: metrics.totalForks,
      topLanguages: metrics.topLanguages.slice(0, 5),
      reposWithDescriptionRatio: `${metrics.reposWithDescription}/${metrics.repoCount}`,
      reposWithLicenseCount: metrics.reposWithLicense,
      readmesFoundRatio: `${metrics.readmesFound}/${metrics.readmesChecked}`,
      activeReposLast90Days: metrics.activeReposLast90Days,
      calculatedScore: scoring.score,
      calculatedVerdict: scoring.verdict,
      isInsufficientData: scoring.isInsufficientData,
      categories: scoring.categories.map(c => ({ name: c.name, score: c.score, explanation: c.explanation }))
    };

    const prompt = `
You are the Galaxy Roast AI, an entertaining, witty, and perceptive space-galaxy themed developer profile analyst.
You have been provided with real, verified public GitHub metrics for developer @${profile.username}.

CRITICAL RULES:
1. The score (${scoring.score}/10) and verdict (${scoring.verdict}) have ALREADY been calculated deterministically. DO NOT invent or alter the score.
2. The GitHub metrics are absolute facts. Never hallucinate fake repositories, fake star counts, or fake technologies.
3. If the profile is strong (score >= 7.0), deliver a witty, complimentary roast celebrating their skills with humor.
4. If the profile is weaker (score < 7.0), deliver a playful, humorous roast about observable habits (e.g. missing READMEs, empty repos, funny commit messages, abandonware) - NEVER insult their intelligence, character, or identity.
5. If isInsufficientData is true (0 repos or minimal data), be encouraging like welcoming a new astronaut to the cosmic academy.
6. Provide 2-3 genuine strengths supported by the evidence.
7. Provide 3-4 constructive, practical "YOUR NEXT MISSION" improvement recommendations that explain why it matters and how to implement it.
8. Output ONLY valid JSON matching this schema without any markdown wrappers or backticks:
{
  "roast": "Witty personalized analysis",
  "compliment": "Genuine positive observation",
  "verdict": "${scoring.verdict}",
  "strengths": [
    { "title": "Strength Title", "evidence": "Direct evidence from data" }
  ],
  "improvements": [
    { "title": "Actionable Goal", "reason": "Why it matters", "action": "Specific steps to implement" }
  ]
}

DATA TO ANALYZE:
${JSON.stringify(evidenceSummary, null, 2)}
`;

    // Call Gemini API with timeout protection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out after 12 seconds')), 12000)
    );

    const apiCallPromise = ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      }
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    let text = response.text;

    // Clean potential markdown wrap if any
    text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsedJson = JSON.parse(text);
    const validated = aiResponseSchema.parse(parsedJson);

    logger.info(`Successfully generated AI roast for: ${profile.username}`);
    return {
      roast: validated.roast,
      compliment: validated.compliment,
      verdict: scoring.verdict, // Ensure deterministic verdict is kept
      strengths: validated.strengths,
      improvements: validated.improvements,
    };
  } catch (error) {
    logger.warn(`Gemini generation encountered an issue (${error.message}). Gracefully using fallback roast engine.`, {
      error: error.message
    });
    return generateFallbackAnalysis(profile, metrics, scoring);
  }
}
