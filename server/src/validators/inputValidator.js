/**
 * Validates and normalizes GitHub profile input (URL or username).
 *
 * Accepted formats:
 * - https://github.com/username
 * - http://github.com/username
 * - github.com/username
 * - @username
 * - username
 */

// GitHub usernames: 1-39 chars, alphanumeric or single hyphens, cannot start/end with hyphen
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

// Known reserved routes on github.com that are not usernames
const RESERVED_GITHUB_PATHS = new Set([
  'about', 'pricing', 'features', 'contact', 'security', 'enterprise',
  'explore', 'trending', 'collections', 'events', 'community', 'topics',
  'nonprofit', 'customer-stories', 'readme', 'login', 'join', 'sessions',
  'settings', 'notifications', 'marketplace', 'issues', 'pulls', 'sponsors'
]);

export function validateAndNormalizeGithubInput(input) {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a GitHub profile URL or username.'
    };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'GitHub input cannot be empty.'
    };
  }

  let extracted = trimmed;

  // Check if input looks like a URL
  if (extracted.includes('/') || extracted.includes('.')) {
    // Add protocol if missing to parse cleanly
    let urlToParse = extracted;
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      urlToParse = 'https://' + urlToParse;
    }

    try {
      const parsed = new URL(urlToParse);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

      if (host !== 'github.com') {
        return {
          isValid: false,
          error: `Invalid domain "${host}". Only public GitHub profiles (github.com) are supported.`
        };
      }

      // Extract username from path: /username or /username/
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length === 0) {
        return {
          isValid: false,
          error: 'Please provide a valid GitHub username or profile URL.'
        };
      }

      // First segment should be the username
      extracted = segments[0];
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format. Please provide a valid GitHub profile URL or username.'
      };
    }
  }

  // Remove leading @ if user typed @username
  if (extracted.startsWith('@')) {
    extracted = extracted.slice(1);
  }

  // Check reserved GitHub paths
  if (RESERVED_GITHUB_PATHS.has(extracted.toLowerCase())) {
    return {
      isValid: false,
      error: `"${extracted}" is a reserved GitHub path, not a user profile.`
    };
  }

  // Validate against GitHub username rules
  if (!GITHUB_USERNAME_REGEX.test(extracted)) {
    return {
      isValid: false,
      error: 'Invalid GitHub username format. Usernames must be 1-39 alphanumeric characters or single hyphens, and cannot start or end with a hyphen.'
    };
  }

  return {
    isValid: true,
    username: extracted
  };
}
