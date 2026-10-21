import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const GITHUB_API_BASE = 'https://api.github.com';

function createGithubClient() {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-Roast-App/1.0',
  };

  if (config.githubToken && config.githubToken.trim().length > 0) {
    headers.Authorization = `Bearer ${config.githubToken.trim()}`;
  }

  return axios.create({
    baseURL: GITHUB_API_BASE,
    headers,
    timeout: 8000,
  });
}

/**
 * Fetches user profile, repository data, and documentation signals in parallel
 */
export async function fetchGithubData(username) {
  const client = createGithubClient();

  try {
    logger.info(`Fetching GitHub profile and repos in parallel for: ${username}`);

    // 1. Fetch user profile and repositories simultaneously in parallel
    const [userRes, reposRes] = await Promise.all([
      client.get(`/users/${encodeURIComponent(username)}`),
      client.get(`/users/${encodeURIComponent(username)}/repos`, {
        params: {
          per_page: 50,
          sort: 'updated',
          direction: 'desc',
          type: 'owner'
        }
      })
    ]);

    const userData = userRes.data;
    const rawRepos = reposRes.data || [];

    const originalRepos = rawRepos.filter(r => !r.fork);
    const forkedRepos = rawRepos.filter(r => r.fork);

    // 2. Fast parallel check for README presence on top 3 repos
    const targetRepos = (originalRepos.length > 0 ? originalRepos : rawRepos).slice(0, 3);

    const readmeStatuses = await Promise.all(
      targetRepos.map(async (repo) => {
        try {
          const readmeRes = await client.get(`/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/readme`, {
            timeout: 2500,
            validateStatus: (status) => status === 200 || status === 404
          });
          return {
            repoName: repo.name,
            hasReadme: readmeRes.status === 200,
            readmeSize: readmeRes.status === 200 && readmeRes.data ? readmeRes.data.size : 0
          };
        } catch {
          return { repoName: repo.name, hasReadme: false, readmeSize: 0 };
        }
      })
    );

    // Compute metrics
    const totalStars = rawRepos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = rawRepos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
    const totalOpenIssues = rawRepos.reduce((acc, r) => acc + (r.open_issues_count || 0), 0);

    // Language statistics
    const languageMap = {};
    rawRepos.forEach(r => {
      if (r.language) {
        languageMap[r.language] = (languageMap[r.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    const reposWithDescription = rawRepos.filter(r => r.description && r.description.trim().length > 5).length;
    const reposWithLicense = rawRepos.filter(r => r.license && r.license.name).length;
    const reposWithTopics = rawRepos.filter(r => r.topics && r.topics.length > 0).length;

    const readmesFound = readmeStatuses.filter(r => r.hasReadme).length;
    const readmesChecked = readmeStatuses.length;

    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
    const yearAgo = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));

    const activeReposLast90Days = rawRepos.filter(r => new Date(r.pushed_at || r.updated_at) > ninetyDaysAgo).length;
    const activeReposLastYear = rawRepos.filter(r => new Date(r.pushed_at || r.updated_at) > yearAgo).length;

    const createdDate = new Date(userData.created_at);
    const accountAgeYears = Math.max(0.1, parseFloat(((now - createdDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)));

    return {
      profile: {
        username: userData.login,
        name: userData.name || null,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url,
        bio: userData.bio || null,
        company: userData.company || null,
        location: userData.location || null,
        blog: userData.blog || null,
        twitterUsername: userData.twitter_username || null,
        publicRepos: userData.public_repos,
        publicGists: userData.public_gists || 0,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        accountAgeYears,
      },
      metrics: {
        totalStars,
        totalForks,
        totalOpenIssues,
        repoCount: rawRepos.length,
        originalRepoCount: originalRepos.length,
        forkedRepoCount: forkedRepos.length,
        topLanguages,
        distinctLanguageCount: Object.keys(languageMap).length,
        reposWithDescription,
        reposWithLicense,
        reposWithTopics,
        readmesFound,
        readmesChecked,
        activeReposLast90Days,
        activeReposLastYear,
        recentRepos: rawRepos.slice(0, 5).map(r => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          updatedAt: r.updated_at,
          pushedAt: r.pushed_at
        }))
      }
    };
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        const err = new Error(`GitHub user "${username}" was not found. Please double-check the username or URL.`);
        err.statusCode = 404;
        throw err;
      }
      if (status === 403 || status === 429) {
        const rateLimitReset = error.response.headers['x-ratelimit-reset'];
        let resetMsg = '';
        if (rateLimitReset) {
          const resetTime = new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString();
          resetMsg = ` Limit resets at ${resetTime}.`;
        }
        const err = new Error(`GitHub API rate limit exceeded.${resetMsg} Set a GITHUB_TOKEN in .env or try again later.`);
        err.statusCode = 429;
        throw err;
      }
      const err = new Error(error.response.data?.message || 'Failed to retrieve data from GitHub.');
      err.statusCode = status;
      throw err;
    }
    const err = new Error('Network error while communicating with GitHub API. Please check your connection.');
    err.statusCode = 502;
    throw err;
  }
}
