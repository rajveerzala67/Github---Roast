import { describe, it, expect } from 'vitest';
import { calculateDeveloperScore } from '../src/services/scoringService.js';

describe('Deterministic Scoring Engine & Sound Mapping', () => {
  it('handles empty repositories profile with insufficient data safeguard', () => {
    const profile = {
      username: 'newbie',
      publicRepos: 0,
      followers: 0,
      bio: null,
      name: null,
      location: null,
      blog: null,
    };
    const metrics = {
      totalStars: 0,
      totalForks: 0,
      repoCount: 0,
      distinctLanguageCount: 0,
      reposWithDescription: 0,
      reposWithLicense: 0,
      reposWithTopics: 0,
      readmesFound: 0,
      readmesChecked: 0,
      activeReposLast90Days: 0,
      activeReposLastYear: 0,
    };

    const result = calculateDeveloperScore(profile, metrics);
    expect(result.isInsufficientData).toBe(true);
    expect(result.score).toBe(5.0);
    expect(result.verdict).toBe('COSMIC CADET');
    // For zero repositories, clapping or laughing should NOT automatically fire
    expect(result.soundType).toBe('none');
    expect(result.categories.length).toBe(6);
  });

  it('awards score >= 7.0 and clapping sound to well-maintained profiles', () => {
    const profile = {
      username: 'pro_coder',
      name: 'Pro Coder',
      publicRepos: 15,
      followers: 35,
      bio: 'Full-stack cosmic engineer building distributed systems',
      location: 'San Francisco, CA',
      blog: 'https://procoder.dev',
      company: 'Cosmic Labs',
      twitterUsername: 'procoder',
    };
    const metrics = {
      totalStars: 120,
      totalForks: 25,
      repoCount: 15,
      distinctLanguageCount: 5,
      reposWithDescription: 14,
      reposWithLicense: 12,
      reposWithTopics: 10,
      readmesFound: 6,
      readmesChecked: 6,
      activeReposLast90Days: 5,
      activeReposLastYear: 12,
    };

    const result = calculateDeveloperScore(profile, metrics);
    expect(result.isInsufficientData).toBe(false);
    expect(result.score).toBeGreaterThanOrEqual(7.0);
    expect(result.soundType).toBe('clapping');
    expect(['LEGENDARY DEVELOPER', 'PROMISING DEVELOPER']).toContain(result.verdict);
  });

  it('awards laughing sound to underdeveloped profiles (score < 7.0)', () => {
    const profile = {
      username: 'abandoned_coder',
      publicRepos: 4,
      followers: 1,
      bio: '',
      name: null,
      location: null,
      blog: null,
      company: null,
      twitterUsername: null,
    };
    const metrics = {
      totalStars: 0,
      totalForks: 0,
      repoCount: 4,
      distinctLanguageCount: 1,
      reposWithDescription: 0,
      reposWithLicense: 0,
      reposWithTopics: 0,
      readmesFound: 0,
      readmesChecked: 3,
      activeReposLast90Days: 0,
      activeReposLastYear: 0,
    };

    const result = calculateDeveloperScore(profile, metrics);
    expect(result.score).toBeLessThan(7.0);
    expect(result.soundType).toBe('laughing');
    expect(result.verdict).toBe('GITHUB ROASTED');
  });

  it('evaluates language diversity fairly', () => {
    const profile = {
      username: 'polyglot',
      publicRepos: 5,
      followers: 5,
      bio: 'Loves languages',
    };
    const metrics = {
      totalStars: 2,
      totalForks: 1,
      repoCount: 5,
      distinctLanguageCount: 5,
      reposWithDescription: 5,
      reposWithLicense: 2,
      reposWithTopics: 2,
      readmesFound: 3,
      readmesChecked: 3,
      activeReposLast90Days: 2,
      activeReposLastYear: 4,
    };

    const result = calculateDeveloperScore(profile, metrics);
    const diversityCat = result.categories.find(c => c.name === 'Skill Diversity');
    expect(diversityCat).toBeDefined();
    expect(diversityCat.score).toBe(10.0);
  });
});
