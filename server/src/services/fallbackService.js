/**
 * Fallback AI Roast Engine
 * Generates evidence-based, witty, entertaining roasts/compliments,
 * strengths, and improvements when Gemini API is unavailable or unconfigured.
 */

export function generateFallbackAnalysis(profile, metrics, scoring) {
  const { username, name, publicRepos, followers } = profile;
  const { totalStars, topLanguages, reposWithDescription, reposWithLicense, readmesFound, readmesChecked } = metrics;
  const { score, verdict, isInsufficientData } = scoring;

  const displayName = name || username;
  const primaryLang = topLanguages.length > 0 ? topLanguages[0].name : 'code';

  if (isInsufficientData) {
    return {
      roast: `Welcome to the cosmos, @${username}! Your developer galaxy is just getting started. 🌱 We've spotted an empty orbital pad with 0 public repositories. Time to launch your first spaceship!`,
      compliment: `A blank canvas in the GitHub galaxy means unlimited potential. No legacy bugs, no broken dependencies, just pure opportunity.`,
      verdict: scoring.verdict,
      strengths: [
        {
          title: 'Clean Slate Opportunity',
          evidence: 'Account is ready for stellar open-source projects.'
        },
        {
          title: 'Registered Explorer',
          evidence: `@${username} has joined the global GitHub developer community.`
        }
      ],
      improvements: [
        {
          title: 'Publish Your First Project',
          reason: 'A GitHub profile without public repos is like a telescope with the lens cap on.',
          action: 'Create a repository for a recent project or tutorial and push your code.'
        },
        {
          title: 'Craft a Stellar Profile README',
          reason: 'A profile README introduces your interests and skills to visitors.',
          action: `Create a public repository named "${username}" and add a README.md introducing yourself.`
        },
        {
          title: 'Flesh Out Your Bio',
          reason: 'A short bio helps developers and recruiters know what technologies you love.',
          action: 'Add a 1-sentence bio mentioning your favorite tech stack.'
        }
      ]
    };
  }

  // Roasts and compliments based on score and evidence
  let roast = '';
  let compliment = '';

  if (score >= 8.5) {
    roast = `Bro's GitHub is so immaculate even the Git history looks choreographed. @${username} is out here writing code cleaner than a NASA telemetry stream! Keep cooking, galaxy boss.`;
    compliment = `Outstanding profile! With ${totalStars} star${totalStars !== 1 ? 's' : ''} and strong repository hygiene across ${primaryLang}, you are setting the gold standard for public code.`;
  } else if (score >= 7.0) {
    roast = `@${username} is definitely putting in the hours. Your ${primaryLang} engines are humming nicely, though a few projects still look like they were committed at 3 AM with commit message "fixed stuff".`;
    compliment = `Solid developer trajectory! You maintain ${publicRepos} public repositories with genuine activity and documented projects.`;
  } else if (score >= 4.5) {
    roast = `Your GitHub looks like a group project where everyone forgot the deadline! ${reposWithDescription}/${publicRepos} repos have descriptions, and the rest are floating like abandoned satellites in low orbit.`;
    compliment = `You have genuine code out in the open (${publicRepos} repos in ${primaryLang}), which puts you ahead of developers who never push anything public.`;
  } else {
    roast = `404: Developer documentation not found! @${username}'s repositories are running on pure vibes and dark matter. Even the Git commits are asking for help.`;
    compliment = `You took the step to create and publish code publicly. Every legendary engineer started with a messy commit log.`;
  }

  // Evidence-based strengths
  const strengths = [];
  if (topLanguages.length >= 2) {
    strengths.push({
      title: 'Polyglot Toolkit',
      evidence: `Demonstrated multi-language versatility across ${topLanguages.slice(0, 3).map(l => l.name).join(', ')}.`
    });
  } else if (topLanguages.length === 1) {
    strengths.push({
      title: `${primaryLang} Specialist`,
      evidence: `Consistent focus on the ${primaryLang} ecosystem.`
    });
  }

  if (totalStars > 5) {
    strengths.push({
      title: 'Community Traction',
      evidence: `Earned ${totalStars} stars from other developers in the galaxy.`
    });
  } else if (publicRepos >= 5) {
    strengths.push({
      title: 'Prolific Builder',
      evidence: `Maintains ${publicRepos} public repositories demonstrating consistent building habits.`
    });
  } else {
    strengths.push({
      title: 'Active Exploration',
      evidence: 'Has established public repositories on GitHub.'
    });
  }

  if (readmesFound > 0) {
    strengths.push({
      title: 'Documented Repositories',
      evidence: `${readmesFound} of your checked top repositories include a README guide.`
    });
  }

  // Targeted improvements
  const improvements = [];
  if (readmesFound < readmesChecked || readmesChecked === 0) {
    improvements.push({
      title: 'Add READMEs to Mystery Repositories',
      reason: 'A repo without a README is like a spaceship with no operating manual.',
      action: 'Add installation steps, a screenshot or GIF preview, and a brief description of what the project solves.'
    });
  }

  if (reposWithDescription < publicRepos) {
    improvements.push({
      title: 'Add One-Liner Repo Descriptions',
      reason: `${publicRepos - reposWithDescription} of your repositories lack descriptions, making them invisible in searches.`,
      action: 'Click the gear icon on each repository and add a clear 10-word description of what it does.'
    });
  }

  if (reposWithLicense === 0 && publicRepos > 0) {
    improvements.push({
      title: 'Add Open Source Licenses',
      reason: 'Without a license (like MIT or Apache 2.0), others cannot legally use or contribute to your code.',
      action: 'Add an MIT License to your public repositories so other developers can explore and build upon them.'
    });
  }

  if (!profile.bio || profile.bio.trim().length === 0) {
    improvements.push({
      title: 'Polish Your Developer Bio',
      reason: 'First impressions matter when recruiters and open-source contributors inspect your profile.',
      action: 'Write a punchy bio mentioning your current stack, favorite tools, and what you are building.'
    });
  }

  // Ensure 3 improvements
  if (improvements.length < 3) {
    improvements.push({
      title: 'Pin Your Crown Jewel Repositories',
      reason: 'Pinning your 4-6 most impressive projects ensures visitors immediately see your best work.',
      action: 'Go to your GitHub profile and customize your pinned repositories list.'
    });
  }

  return {
    roast,
    compliment,
    verdict,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 4)
  };
}
