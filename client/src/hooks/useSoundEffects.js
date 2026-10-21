import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/soundPlayer';

export function useSoundEffects(analysisData) {
  const [soundState, setSoundState] = useState({
    isPlaying: soundManager.isPlaying,
    isMuted: soundManager.isMuted,
    autoplayBlocked: soundManager.autoplayBlocked,
  });

  // Track the last analysis ID that played audio to prevent duplicate playback
  const playedAnalysisIdRef = useRef(null);

  useEffect(() => {
    const unsubscribe = soundManager.subscribe((state) => {
      setSoundState(state);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If no analysis data or if analysis failed, do nothing
    if (!analysisData || !analysisData.analysisId || !analysisData.scoring) {
      return;
    }

    const { analysisId, scoring } = analysisData;

    // Check if this specific analysis ID has already triggered audio
    if (playedAnalysisIdRef.current === analysisId) {
      return;
    }

    // Mark as played immediately
    playedAnalysisIdRef.current = analysisId;

    // Determine sound path
    // Requirements:
    // Score >= 7.0: /sounds/clapping.mp3
    // Score < 7.0: /sounds/laughing.mp3
    // Insufficient data: no automatic sound
    if (scoring.isInsufficientData) {
      return;
    }

    let soundPath = null;
    if (scoring.score >= 7.0) {
      soundPath = '/sounds/clapping.mp3';
    } else {
      soundPath = '/sounds/laughing.mp3';
    }

    if (soundPath) {
      // Small delay (200ms) to ensure smooth DOM mount and visual render first
      const timer = setTimeout(() => {
        soundManager.play(soundPath);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [analysisData]);

  const toggleMute = () => soundManager.toggleMute();
  const stopSound = () => soundManager.stop();
  const playPending = () => soundManager.playPending();
  const resetPlaybackGuard = () => {
    playedAnalysisIdRef.current = null;
    soundManager.stop();
  };

  return {
    ...soundState,
    toggleMute,
    stopSound,
    playPending,
    resetPlaybackGuard,
  };
}
