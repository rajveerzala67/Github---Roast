/**
 * Sound Player Utility
 * Manages HTML5 Audio instances, volume, autoplay rejection, and automatic stop timer.
 * Automatically stops audio after 6 seconds (between 5 to 10 seconds) with a smooth fade-out.
 */

class SoundPlayerManager {
  constructor() {
    this.currentAudio = null;
    this.isMuted = false;
    this.volume = 0.35; // Comfortable lower volume
    this.isPlaying = false;
    this.listeners = new Set();
    this.autoplayBlocked = false;
    this.pendingAudioPath = null;
    this.autoStopTimer = null;
    this.fadeTimer = null;
    this.maxPlayDurationMs = 6000; // 6 seconds auto-stop limit
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) =>
      fn({
        isPlaying: this.isPlaying,
        isMuted: this.isMuted,
        autoplayBlocked: this.autoplayBlocked,
      })
    );
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.isMuted && this.currentAudio) {
      this.stop();
    }
    this.notify();
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
  }

  clearTimers() {
    if (this.autoStopTimer) {
      clearTimeout(this.autoStopTimer);
      this.autoStopTimer = null;
    }
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  stop() {
    this.clearTimers();

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore abort errors
      }
      this.currentAudio = null;
    }
    this.isPlaying = false;
    this.autoplayBlocked = false;
    this.pendingAudioPath = null;
    this.notify();
  }

  async play(soundPath, durationMs = this.maxPlayDurationMs) {
    if (this.isMuted) return;

    // Stop previous audio and clear any existing timers
    this.stop();

    try {
      const audio = new Audio(soundPath);
      audio.volume = this.volume;
      this.currentAudio = audio;
      this.pendingAudioPath = soundPath;

      audio.onended = () => {
        this.clearTimers();
        this.isPlaying = false;
        this.currentAudio = null;
        this.notify();
      };

      audio.onerror = (err) => {
        console.warn('Audio playback error for path:', soundPath, err);
        this.clearTimers();
        this.isPlaying = false;
        this.currentAudio = null;
        this.notify();
      };

      await audio.play();
      this.isPlaying = true;
      this.autoplayBlocked = false;
      this.notify();

      // Schedule smooth fade-out and auto-stop after 5 to 10 seconds (default: 6 seconds)
      const fadeDurationMs = 800;
      const startFadeAtMs = Math.max(0, durationMs - fadeDurationMs);

      // 1. Begin gentle fade out 800ms before stopping
      this.autoStopTimer = setTimeout(() => {
        if (!this.isPlaying || !this.currentAudio) return;

        const fadeSteps = 10;
        const fadeInterval = fadeDurationMs / fadeSteps;
        const volumeStep = this.currentAudio.volume / fadeSteps;

        this.fadeTimer = setInterval(() => {
          if (this.currentAudio && this.currentAudio.volume > volumeStep) {
            this.currentAudio.volume = Math.max(0, this.currentAudio.volume - volumeStep);
          } else {
            clearInterval(this.fadeTimer);
            this.fadeTimer = null;
            this.stop();
          }
        }, fadeInterval);
      }, startFadeAtMs);

    } catch (err) {
      // Browser autoplay policy blocked audio
      console.warn('Audio autoplay blocked by browser policy:', err);
      this.clearTimers();
      this.autoplayBlocked = true;
      this.isPlaying = false;
      this.notify();
    }
  }

  async playPending() {
    if (this.pendingAudioPath) {
      this.autoplayBlocked = false;
      await this.play(this.pendingAudioPath);
    }
  }
}

export const soundManager = new SoundPlayerManager();
