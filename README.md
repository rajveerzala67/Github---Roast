## Lookout the Github-Roast (https://github-roast-rz.vercel.app/)


# GitHub Roast 🚀
### AI-Powered Developer Profile Analyzer & Cosmic Roast Engine

GitHub Roast is an entertaining, futuristic, single-page web application where developers enter their GitHub profile URL or username to receive an honest, humorous, and evidence-based analysis of their coding reputation.

Featuring a **3D Galaxy Theme**, deterministic scoring algorithm, Google Gemini AI humor layer, and synchronized sound effects:
- **Good Profiles (Score ≥ 7.0)**: Celebratory applause (`clapping.mp3`) + confetti 🎉
- **Weak / Developing Profiles (Score < 7.0)**: Playful cosmic roast laugh (`laughing.mp3`) 😂
- **Zero / Brand-New Profiles**: Encouraging Cosmic Cadet onboarding with no negative roasts 🌱

---

## 🌌 Tech Stack

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** (Cosmic space palette: deep midnight navy, electric violet, neon blue, cyan)
- **Three.js** + **React Three Fiber** + **Drei** (Interactive 3D galaxy starfield, orbiting celestial sphere, cosmic particle nebula, shooting stars)
- **Framer Motion** (Smooth entrance transitions and telemetry meters)
- **Axios** (API communication)
- **Lucide React** (Futuristic icons)
- **HTML5 Audio API** (Managed audio playback, volume controls, autoplay protection)

### Backend
- **Node.js** & **Express.js** (REST API)
- **GitHub REST API** (Source of truth for repository data, stars, forks, languages, and READMEs)
- **Google GenAI SDK (`@google/genai`)** (Humor, witty roasts, compliments, and mission recommendations)
- **Zod** (Strict schema validation for user input and AI JSON output)
- **Helmet** & **Express Rate Limit** (Security headers and IP-based rate limiting)
- **Vitest** & **Supertest** (Automated unit and integration test suites)

---

## ⚖️ Deterministic Scoring Algorithm

Scores (from 1.0 to 10.0) are calculated deterministically on the backend from real public evidence and **never invented by the AI**:

| Category | Weight | Metrics Analyzed |
| :--- | :---: | :--- |
| **Repository Quality** | 25% | Repository descriptions, open-source licenses, topic tags |
| **Documentation Quality** | 20% | README presence and completeness across top repositories |
| **Development Activity** | 20% | Commits and repository updates within 90 and 365 days |
| **Skill Diversity** | 15% | Number of distinct primary programming languages |
| **Community Engagement** | 10% | Total stars, forks, and follower counts |
| **Profile Presentation** | 10% | Bio completeness, avatar, organization, location, website |

### Verdict Thresholds
- **`LEGENDARY DEVELOPER`** (Score ≥ 8.5) &rarr; *Galaxy Brain* &bull; Plays `clapping.mp3`
- **`PROMISING DEVELOPER`** (Score 7.0 &ndash; 8.4) &rarr; *Solid Developer* &bull; Plays `clapping.mp3`
- **`GITHUB ROASTED`** (Score < 7.0) &rarr; *Needs More Code* &bull; Plays `laughing.mp3`
- **`COSMIC CADET`** (Insufficient Data / 0 Repos) &rarr; *New Explorer* &bull; Neutral sound

---

## 🔊 Sound Effect System

- Audio files are stored in:
  - `client/public/sounds/clapping.mp3`
  - `client/public/sounds/laughing.mp3`
- **One-Time Playback Guard**: Controlled via a stable analysis ID ref. Sounds play once when results load and never repeat on re-render.
- **Volume**: Lower volume (~0.35) for a comfortable user experience.
- **Mute / Unmute**: Visible sound toggle in the navigation bar and results controller.
- **Stop Sound**: Instant stop button when sound is playing.
- **Autoplay Handling**: Gracefully catches browser autoplay blocks and displays a "Tap to hear your verdict 🔊" prompt.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher

---

### 1. Installation

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

---

### 2. Environment Configuration

#### Backend Configuration
Copy the example environment file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional: GitHub Personal Access Token (boosts API rate limit from 60 to 5,000 req/hr)
# Generate a free token at https://github.com/settings/tokens (no scopes required for public data)
GITHUB_TOKEN=

# Optional: Google Gemini API Key for AI roasts
# Get your free key at https://aistudio.google.com/
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

> **Note**: Even if `GEMINI_API_KEY` is not provided, the application runs 100% reliably using the built-in deterministic roast engine.

---

### 3. Running Locally

#### Start the Backend Server
```bash
cd server
npm run dev
# Server will launch on http://localhost:5000
```

#### Start the Frontend Client
In a separate terminal:
```bash
cd client
npm run dev
# Client will launch on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

### 4. Running Automated Tests

#### Run Backend Tests
```bash
cd server
npm test
```
Tests cover input normalization, URL validation, deterministic scoring weights, insufficient data safeguards, Gemini JSON validation, fallback generation, and Express API routes.

#### Run Frontend Tests
```bash
cd client
npm test
```
Tests cover audio manager subscriptions, volume settings, mute toggles, and duplicate playback prevention.

---

## 🌐 Deployment Instructions

### Frontend (e.g. Vercel)
1. Set the root directory to `client`.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Environment variable:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g., `https://your-api.onrender.com/api`).

### Backend (e.g. Render / Railway)
1. Set the root directory to `server`.
2. Build command: `npm install`.
3. Start command: `node src/server.js`.
4. Environment variables:
   - `PORT`: `5000` (or host assigned port)
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `GITHUB_TOKEN`: Your GitHub token
   - `GEMINI_API_KEY`: Your Gemini API key

---

## 🛡️ Security & Privacy
- **No Passwords or Private Tokens Requested**: Analyzes only publicly available GitHub data.
- **SSRF Prevention**: Strict URL normalization and domain validation reject non-GitHub hosts.
- **Rate Limiting**: Express rate limiting protects upstream APIs from abuse.
- **No Unnecessary Persistence**: Analysis is performed on-the-fly without tracking or storing users' profiles.
