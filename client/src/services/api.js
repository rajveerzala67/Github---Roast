import axios from 'axios';

// Vite proxy forwards /api to http://localhost:5000 in dev
// In production, VITE_API_BASE_URL can override it
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30s timeout for GitHub + AI analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function analyzeGithubProfile(githubUrl) {
  try {
    const response = await apiClient.post('/analyze', { githubUrl });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Analysis timed out. GitHub or the AI engine took too long to respond.');
    }
    throw new Error(error.message || 'Failed to connect to the GitHub Roast galaxy. Please try again.');
  }
}

export async function checkServerHealth() {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
}
