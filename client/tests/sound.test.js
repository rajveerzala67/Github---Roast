import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundManager } from '../src/utils/soundPlayer.js';

describe('Sound Effect Manager', () => {
  beforeEach(() => {
    soundManager.stop();
    soundManager.setMuted(false);
  });

  it('manages mute and unmute toggle properly', () => {
    expect(soundManager.isMuted).toBe(false);
    soundManager.toggleMute();
    expect(soundManager.isMuted).toBe(true);
    soundManager.toggleMute();
    expect(soundManager.isMuted).toBe(false);
  });

  it('stops active sound cleanly and resets state', () => {
    soundManager.isPlaying = true;
    soundManager.stop();
    expect(soundManager.isPlaying).toBe(false);
    expect(soundManager.currentAudio).toBeNull();
  });

  it('does not play audio if muted', async () => {
    soundManager.setMuted(true);
    await soundManager.play('/sounds/clapping.mp3');
    expect(soundManager.isPlaying).toBe(false);
  });

  it('has a default auto-stop limit between 5 and 10 seconds (6000ms)', () => {
    expect(soundManager.maxPlayDurationMs).toBeGreaterThanOrEqual(5000);
    expect(soundManager.maxPlayDurationMs).toBeLessThanOrEqual(10000);
  });

  it('clears auto-stop and fade timers when stop() is called', () => {
    soundManager.autoStopTimer = setTimeout(() => {}, 6000);
    soundManager.fadeTimer = setInterval(() => {}, 100);

    soundManager.stop();

    expect(soundManager.autoStopTimer).toBeNull();
    expect(soundManager.fadeTimer).toBeNull();
  });

  it('notifies subscribers upon state change', () => {
    const listener = vi.fn();
    const unsub = soundManager.subscribe(listener);

    soundManager.toggleMute();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ isMuted: true })
    );

    unsub();
  });
});
