/**
 * Deterministic Scoring System for GitHub Roast
 *
 * Weights (Total 100%):
 * 1. Project Quality & Completeness: 25%
 * 2. Documentation Quality: 20%
 * 3. Development Activity & Freshness: 20%
 * 4. Project Diversity & Skills: 15%
 * 5. Community Engagement: 10%
 * 6. Profile Presentation: 10%
 */

export function calculateDeveloperScore(profile, metrics) {
  const { publicRepos, followers, bio, company, location, blog } = profile;
  const {
    totalStars,
    totalForks,
    repoCount,
    distinctLanguageCount,
    reposWithDescription,
    reposWithLicense,
    reposWithTopics,
    readmesFound,
    readmesChecked,
    activeReposLast90Days,
    activeReposLastYear,
  } = metrics;

  // Safeguard: Check if account has insufficient public data
  if (publicRepos === 0 || repoCount === 0) {
    return {
      score: 5.0,
      confidence: 'insufficient_data',
      verdict: 'COSMIC CADET',
      verdictLabel: 'New Cosmic Cadet 🌱',
      verdictDescription: 'Your developer galaxy is brand new or completely private. There are no public repositories to analyze yet.',
      soundType: 'none', // Do NOT play laughing or clapping automatically for zero data
      isInsufficientData: true,
      categories: [
        {
          name: 'Repository Quality',
          score: 5.0,
          weight: 25,
          explanation: 'No public repositories found to evaluate project quality.'
        },
        {
          name: 'Documentation Quality',
          score: 5.0,
          weight: 20,
          explanation: 'No documentation available to evaluate.'
        },
        {
          name: 'Development Activity',
          score: 5.0,
          weight: 20,
          explanation: 'No recent public commit or repository activity.'
        },
        {
          name: 'Skill Diversity',
          score: 5.0,
          weight: 15,
          explanation: 'No programming languages detected in public repositories.'
        },
        {
          name: 'Community Engagement',
          score: 5.0,
          weight: 10,
          explanation: 'Public star, fork, and community metrics are not yet established.'
        },
        {
          name: 'Profile Presentation',
          score: calculatePresentationScore(profile),
          weight: 10,
          explanation: 'Evaluated based on bio, name, and profile details.'
        }
      ]
    };
  }

  // 1. Repository Quality & Completeness (0-10)
  // Evaluates repo descriptions, licenses, and topics
  let qualityScore = 0;
  const descRatio = reposWithDescription / repoCount;
  qualityScore += Math.min(5, descRatio * 5); // up to 5 points for descriptions

  const licenseRatio = reposWithLicense / repoCount;
  qualityScore += Math.min(3, licenseRatio * 3); // up to 3 points for open-source licenses

  const topicRatio = reposWithTopics / repoCount;
  qualityScore += Math.min(2, topicRatio * 2); // up to 2 points for topic tags
  qualityScore = Math.max(1, Math.min(10, parseFloat(qualityScore.toFixed(1))));

  let qualityExplanation = `${reposWithDescription}/${repoCount} repositories have descriptions. `;
  if (reposWithLicense > 0) qualityExplanation += `${reposWithLicense} include open-source licenses.`;
  else qualityExplanation += 'No open-source licenses detected.';

  // 2. Documentation Quality (0-10)
  let docScore = 2.0; // Baseline
  if (readmesChecked > 0) {
    const readmeRatio = readmesFound / readmesChecked;
    docScore = 2.0 + (readmeRatio * 8.0);
  }
  docScore = Math.max(1, Math.min(10, parseFloat(docScore.toFixed(1))));

  let docExplanation = readmesChecked > 0
    ? `${readmesFound} of ${readmesChecked} inspected top repositories contain README files.`
    : 'No top repositories available for README inspection.';

  // 3. Development Activity & Freshness (0-10)
  let activityScore = 2.0;
  if (activeReposLast90Days > 0) {
    activityScore = 6.0 + Math.min(4.0, activeReposLast90Days * 1.0);
  } else if (activeReposLastYear > 0) {
    activityScore = 4.0 + Math.min(3.0, activeReposLastYear * 0.5);
  } else {
    activityScore = 2.0;
  }
  activityScore = Math.max(1, Math.min(10, parseFloat(activityScore.toFixed(1))));

  let activityExplanation = activeReposLast90Days > 0
    ? `${activeReposLast90Days} repositories updated in the past 90 days. Active orbital presence!`
    : activeReposLastYear > 0
      ? `${activeReposLastYear} repositories updated in the past year.`
      : 'No public updates observed in the last 12 months.';

  // 4. Project Diversity & Skills (0-10)
  // Distinct languages
  let diversityScore = 2.0;
  if (distinctLanguageCount >= 5) diversityScore = 10.0;
  else if (distinctLanguageCount >= 4) diversityScore = 8.5;
  else if (distinctLanguageCount >= 3) diversityScore = 7.0;
  else if (distinctLanguageCount >= 2) diversityScore = 5.5;
  else if (distinctLanguageCount === 1) diversityScore = 4.0;
  diversityScore = parseFloat(diversityScore.toFixed(1));

  let diversityExplanation = distinctLanguageCount > 0
    ? `${distinctLanguageCount} distinct programming language${distinctLanguageCount > 1 ? 's' : ''} detected across public repositories.`
    : 'No primary language recognized across repositories.';

  // 5. Community Engagement (0-10)
  // Stars, forks, followers
  let communityScore = 2.0;
  let engagementPoints = 0;
  if (totalStars >= 100) engagementPoints += 5;
  else if (totalStars >= 25) engagementPoints += 3.5;
  else if (totalStars >= 5) engagementPoints += 2;
  else if (totalStars >= 1) engagementPoints += 1;

  if (totalForks >= 20) engagementPoints += 3;
  else if (totalForks >= 5) engagementPoints += 2;
  else if (totalForks >= 1) engagementPoints += 1;

  if (followers >= 50) engagementPoints += 2;
  else if (followers >= 10) engagementPoints += 1;

  communityScore = Math.max(1, Math.min(10, parseFloat((2.0 + engagementPoints).toFixed(1))));

  let communityExplanation = `${totalStars} total star${totalStars !== 1 ? 's' : ''}, ${totalForks} fork${totalForks !== 1 ? 's' : ''}, and ${followers} follower${followers !== 1 ? 's' : ''}.`;

  // 6. Profile Presentation (0-10)
  const presentationScore = calculatePresentationScore(profile);
  let presentationExplanation = [];
  if (bio) presentationExplanation.push('bio present');
  if (company) presentationExplanation.push('organization linked');
  if (location) presentationExplanation.push('location provided');
  if (blog) presentationExplanation.push('portfolio/website linked');
  const presentationText = presentationExplanation.length > 0
    ? `Profile customized with ${presentationExplanation.join(', ')}.`
    : 'Profile has minimal bio or custom links.';

  // Weighted Score Calculation
  // Quality: 25%, Doc: 20%, Activity: 20%, Diversity: 15%, Community: 10%, Presentation: 10%
  const weightedSum =
    (qualityScore * 0.25) +
    (docScore * 0.20) +
    (activityScore * 0.20) +
    (diversityScore * 0.15) +
    (communityScore * 0.10) +
    (presentationScore * 0.10);

  const finalScore = parseFloat(Math.max(1.0, Math.min(10.0, weightedSum)).toFixed(1));

  // Determine Confidence
  let confidence = 'medium';
  if (repoCount <= 2 && totalStars === 0) {
    confidence = 'low';
  } else if (repoCount >= 8 && readmesChecked >= 3) {
    confidence = 'high';
  }

  // Determine Verdict and Sound
  let verdict = 'GITHUB ROASTED';
  let verdictLabel = 'Needs More Code 🛰️';
  let verdictDescription = 'Your GitHub is showing signs of orbital decay. Time to push actual code and update your projects!';
  let soundType = 'laughing'; // for score < 7.0

  if (finalScore >= 8.5) {
    verdict = 'LEGENDARY DEVELOPER';
    verdictLabel = 'Galaxy Brain 🌌';
    verdictDescription = 'Top-tier galaxy explorer! Clean documentation, active contributions, and impressive repositories.';
    soundType = 'clapping';
  } else if (finalScore >= 7.0) {
    verdict = 'PROMISING DEVELOPER';
    verdictLabel = 'Solid Developer 🚀';
    verdictDescription = 'Strong coding trajectory! With a few documentation and activity tune-ups, you will achieve orbit.';
    soundType = 'clapping';
  }

  return {
    score: finalScore,
    confidence,
    verdict,
    verdictLabel,
    verdictDescription,
    soundType,
    isInsufficientData: false,
    categories: [
      {
        name: 'Repository Quality',
        score: qualityScore,
        weight: 25,
        explanation: qualityExplanation
      },
      {
        name: 'Documentation Quality',
        score: docScore,
        weight: 20,
        explanation: docExplanation
      },
      {
        name: 'Development Activity',
        score: activityScore,
        weight: 20,
        explanation: activityExplanation
      },
      {
        name: 'Skill Diversity',
        score: diversityScore,
        weight: 15,
        explanation: diversityExplanation
      },
      {
        name: 'Community Engagement',
        score: communityScore,
        weight: 10,
        explanation: communityExplanation
      },
      {
        name: 'Profile Presentation',
        score: presentationScore,
        weight: 10,
        explanation: presentationText
      }
    ]
  };
}

function calculatePresentationScore(profile) {
  let score = 2.0;
  if (profile.name) score += 1.5;
  if (profile.bio && profile.bio.trim().length > 10) score += 2.5;
  if (profile.location) score += 1.0;
  if (profile.blog) score += 1.5;
  if (profile.company || profile.twitterUsername) score += 1.5;
  return parseFloat(Math.min(10.0, score).toFixed(1));
}
