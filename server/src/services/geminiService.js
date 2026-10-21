import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { generateFallbackAnalysis } from './fallbackService.js';

// Schema validation for AI response
const aiResponseSchema = z.object({
  roast: z.string().min(5),
  compliment: z.string().min(5),
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
 * Generates an AI roast and recommendations with fast 4.5s timeout protection.
 * If Gemini takes longer than 4.5s or encounters an issue, immediately returns
 * the high-quality deterministic fallback so the user experiences zero lag.
 */
export async function generateAiRoast(profile, metrics, scoring) {
  if (!config.geminiApiKey || config.geminiApiKey.trim().length === 0) {
    return generateFallbackAnalysis(profile, metrics, scoring);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey.trim() });

    const evidenceSummary = {
      username: profile.username,
      name: profile.name,
      bio: profile.bio,
      publicRepos: profile.publicRepos,
      followers: profile.followers,
      totalStars: metrics.totalStars,
      topLanguages: metrics.topLanguages.slice(0, 3),
      reposWithDescription: `${metrics.reposWithDescription}/${metrics.repoCount}`,
      readmesFound: `${metrics.readmesFound}/${metrics.readmesChecked}`,
      score: scoring.score,
      verdict: scoring.verdict,
      isInsufficientData: scoring.isInsufficientData,
    };

    const prompt = `
You are Galaxy Roast AI. Given public GitHub facts for @${profile.username}, generate an entertaining analysis.
SCORE: ${scoring.score}/10 | VERDICT: ${scoring.verdict}. DO NOT alter the score.
Produce a witty roast, genuine compliment, 2 strengths, and 3 improvement directives.
Output ONLY raw JSON matching this schema:
{
  "roast": "Witty personalized analysis",
  "compliment": "Genuine positive observation",
  "verdict": "${scoring.verdict}",
  "strengths": [{ "title": "Strength", "evidence": "Fact from data" }],
  "improvements": [{ "title": "Directive", "reason": "Why it matters", "action": "How to implement" }]
}
DATA: ${JSON.stringify(evidenceSummary)}
`;

    // Fast 4.5-second timeout protection for instant responsiveness
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API exceeded 4.5s speed threshold')), 4500)
    );

    const apiCallPromise = ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    let text = response.text || '';
    text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    const parsedJson = JSON.parse(text);
    const validated = aiResponseSchema.parse(parsedJson);

    return {
      roast: validated.roast,
      compliment: validated.compliment,
      verdict: scoring.verdict,
      strengths: validated.strengths,
      improvements: validated.improvements,
    };
  } catch (error) {
    logger.warn(`Fast fallback activated (${error.message})`);
    return generateFallbackAnalysis(profile, metrics, scoring);
  }
}
