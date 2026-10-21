import { describe, it, expect } from 'vitest';
import { generateFallbackAnalysis } from '../src/services/fallbackService.js';
import { generateAiRoast } from '../src/services/geminiService.js';

describe('AI Roast & Fallback Engine', () => {
  it('generates high-quality fallback roast for strong profiles without crashing', () => {
    const profile = {
      username: 'code_star',
      name: 'Code Star',
      publicRepos: 10,
      followers: 40,
    };
    const metrics = {
      totalStars: 50,
      totalForks: 10,
      repoCount: 10,
      topLanguages: [{ name: 'TypeScript', count: 6 }, { name: 'Rust', count: 4 }],
      reposWithDescription: 10,
      reposWithLicense: 8,
      readmesFound: 5,
      readmesChecked: 5,
    };
    const scoring = {
      score: 8.7,
      verdict: 'LEGENDARY DEVELOPER',
      isInsufficientData: false,
      categories: []
    };

    const res = generateFallbackAnalysis(profile, metrics, scoring);
    expect(res.roast).toContain('immaculate');
    expect(res.compliment).toBeDefined();
    expect(res.strengths.length).toBeGreaterThanOrEqual(1);
    expect(res.improvements.length).toBeGreaterThanOrEqual(2);
    expect(res.verdict).toBe('LEGENDARY DEVELOPER');
  });

  it('generates encouraging rookie roast for insufficient data profiles', () => {
    const profile = { username: 'newbie_dev', publicRepos: 0 };
    const metrics = { totalStars: 0, topLanguages: [], reposWithDescription: 0, reposWithLicense: 0, readmesFound: 0, readmesChecked: 0 };
    const scoring = { score: 5.0, verdict: 'COSMIC CADET', isInsufficientData: true, categories: [] };

    const res = generateFallbackAnalysis(profile, metrics, scoring);
    expect(res.roast).toContain('cosmos');
    expect(res.improvements.some(imp => imp.title.includes('Publish Your First Project'))).toBe(true);
  });

  it('generateAiRoast falls back gracefully when GEMINI_API_KEY is not provided', async () => {
    const profile = { username: 'testuser', publicRepos: 2 };
    const metrics = { totalStars: 1, topLanguages: [{ name: 'JavaScript', count: 2 }], repoCount: 2, reposWithDescription: 1, reposWithLicense: 0, readmesFound: 1, readmesChecked: 2 };
    const scoring = { score: 6.2, verdict: 'GITHUB ROASTED', isInsufficientData: false, categories: [] };

    const res = await generateAiRoast(profile, metrics, scoring);
    expect(res).toBeDefined();
    expect(res.roast).toBeDefined();
    expect(res.strengths.length).toBeGreaterThan(0);
    expect(res.improvements.length).toBeGreaterThan(0);
  });
});
