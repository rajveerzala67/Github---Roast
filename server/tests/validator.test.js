import { describe, it, expect } from 'vitest';
import { validateAndNormalizeGithubInput } from '../src/validators/inputValidator.js';

describe('GitHub Input Validator & Normalizer', () => {
  it('normalizes a valid plain username', () => {
    const res = validateAndNormalizeGithubInput('torvalds');
    expect(res.isValid).toBe(true);
    expect(res.username).toBe('torvalds');
  });

  it('normalizes a username prefixed with @', () => {
    const res = validateAndNormalizeGithubInput('@shadcn');
    expect(res.isValid).toBe(true);
    expect(res.username).toBe('shadcn');
  });

  it('normalizes a full https URL', () => {
    const res = validateAndNormalizeGithubInput('https://github.com/octocat');
    expect(res.isValid).toBe(true);
    expect(res.username).toBe('octocat');
  });

  it('normalizes an http URL with trailing slash', () => {
    const res = validateAndNormalizeGithubInput('http://github.com/gaearon/');
    expect(res.isValid).toBe(true);
    expect(res.username).toBe('gaearon');
  });

  it('normalizes domain without protocol', () => {
    const res = validateAndNormalizeGithubInput('github.com/leerob');
    expect(res.isValid).toBe(true);
    expect(res.username).toBe('leerob');
  });

  it('rejects URLs from other domains (e.g. gitlab, bitbucket, malicious sites)', () => {
    const res1 = validateAndNormalizeGithubInput('https://gitlab.com/username');
    expect(res1.isValid).toBe(false);
    expect(res1.error).toContain('Invalid domain');

    const res2 = validateAndNormalizeGithubInput('https://evil.com/phishing');
    expect(res2.isValid).toBe(false);
  });

  it('rejects invalid GitHub username characters and formats', () => {
    const res1 = validateAndNormalizeGithubInput('-invalidstart');
    expect(res1.isValid).toBe(false);

    const res2 = validateAndNormalizeGithubInput('invalidend-');
    expect(res2.isValid).toBe(false);

    const res3 = validateAndNormalizeGithubInput('user!name');
    expect(res3.isValid).toBe(false);
  });

  it('rejects reserved GitHub system paths', () => {
    const res = validateAndNormalizeGithubInput('https://github.com/settings');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('reserved GitHub path');
  });

  it('rejects empty or whitespace input', () => {
    const res1 = validateAndNormalizeGithubInput('');
    expect(res1.isValid).toBe(false);

    const res2 = validateAndNormalizeGithubInput('   ');
    expect(res2.isValid).toBe(false);
  });
});
