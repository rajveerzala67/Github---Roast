import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import GalaxyBackground from './scenes/GalaxyBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import GitHubInput from './components/GitHubInput';
import AnalysisLoader from './components/AnalysisLoader';
import VerdictBadge from './components/VerdictBadge';
import ScoreGauge from './components/ScoreGauge';
import ProfileSummary from './components/ProfileSummary';
import VerdictCard from './components/VerdictCard';
import ScoreBreakdown from './components/ScoreBreakdown';
import ImprovementList from './components/ImprovementList';
import SoundController from './components/SoundController';
import Footer from './components/Footer';

import { analyzeGithubProfile } from './services/api';
import { useSoundEffects } from './hooks/useSoundEffects';
import { RotateCcw, Share2, Check } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const inputSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);

  // Hook for audio playback, stopping, muting, and autoplay unblocking
  const {
    isPlaying,
    isMuted,
    autoplayBlocked,
    toggleMute,
    stopSound,
    playPending,
    resetPlaybackGuard,
  } = useSoundEffects(analysisData);

  // Handle CTA click from HeroSection
  const handleScrollToInput = () => {
    if (inputSectionRef.current) {
      inputSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const inputEl = document.getElementById('github-input');
      if (inputEl) inputEl.focus();
    }
  };

  // Submit profile for analysis
  const handleSubmitProfile = async (githubUrl) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisData(null);
    resetPlaybackGuard();

    try {
      const result = await analyzeGithubProfile(githubUrl);
      setAnalysisData(result);

      // Trigger celebratory confetti if score is >= 7.0
      if (result.scoring && result.scoring.score >= 7.0) {
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#A855F7', '#38BDF8', '#06B6D4', '#F59E0B'],
          });
        }, 300);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while inspecting the GitHub galaxy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto scroll to results when loaded
  useEffect(() => {
    if (analysisData && resultsSectionRef.current) {
      const timer = setTimeout(() => {
        resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [analysisData]);

  // Reset to analyze another profile
  const handleReset = () => {
    setAnalysisData(null);
    setErrorMessage(null);
    resetPlaybackGuard();
    setTimeout(() => {
      handleScrollToInput();
    }, 100);
  };

  // Share result to clipboard
  const handleShare = () => {
    if (!analysisData) return;
    const shareText = `🚀 GitHub Roast: @${analysisData.profile.username} scored ${analysisData.scoring.score}/10 (${analysisData.scoring.verdict})! "${analysisData.ai.roast}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      {/* 3D Interactive Galaxy Canvas */}
      <GalaxyBackground />

      {/* Navigation Bar */}
      <Navbar
        isMuted={isMuted}
        isPlaying={isPlaying}
        onToggleMute={toggleMute}
        onStopSound={stopSound}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <HeroSection onCtaClick={handleScrollToInput} />

        {/* GitHub Input Card */}
        <GitHubInput
          ref={inputSectionRef}
          onSubmit={handleSubmitProfile}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
        />

        {/* Loading Sequence */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisLoader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {analysisData && !isLoading && (
            <motion.section
              ref={resultsSectionRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-4xl mx-auto px-4 space-y-6 pt-4 scroll-mt-20"
            >
              {/* Sound Controller Bar */}
              <SoundController
                isPlaying={isPlaying}
                isMuted={isMuted}
                autoplayBlocked={autoplayBlocked}
                soundType={analysisData.scoring.soundType}
                onToggleMute={toggleMute}
                onStopSound={stopSound}
                onPlayPending={playPending}
              />

              {/* Verdict Header & Gauge */}
              <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-galaxy-card">
                <div className="text-center md:text-left flex-1">
                  <div className="mb-3">
                    <VerdictBadge
                      verdict={analysisData.scoring.verdict}
                      label={analysisData.scoring.verdictLabel}
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Orbital Telemetry Complete
                  </h2>
                  <p className="text-sm text-slate-300 mt-2 max-w-md">
                    {analysisData.scoring.verdictDescription}
                  </p>
                </div>

                <div className="shrink-0">
                  <ScoreGauge
                    score={analysisData.scoring.score}
                    verdictLabel={analysisData.scoring.verdictLabel}
                  />
                </div>
              </div>

              {/* Profile Summary Card */}
              <ProfileSummary
                profile={analysisData.profile}
                metrics={analysisData.metrics}
              />

              {/* AI Roast and Verdict Card */}
              <VerdictCard
                ai={analysisData.ai}
                score={analysisData.scoring.score}
                isInsufficientData={analysisData.scoring.isInsufficientData}
              />

              {/* Score Breakdown Matrix */}
              <ScoreBreakdown
                categories={analysisData.scoring.categories}
              />

              {/* Actionable Improvement Directives */}
              <ImprovementList
                improvements={analysisData.ai.improvements}
              />

              {/* Action Buttons: Reset & Share */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-galaxy-glow transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
                  <span>Analyze Another Profile</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-purple-500/30 hover:border-cyan-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Roast Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>Share Roast</span>
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Galactic Footer */}
      <Footer />
    </div>
  );
}
