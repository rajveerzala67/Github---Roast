import React from 'react';
import { Volume2, VolumeX, Square, Play, AlertCircle } from 'lucide-react';

export default function SoundController({
  isPlaying,
  isMuted,
  autoplayBlocked,
  soundType,
  onToggleMute,
  onStopSound,
  onPlayPending,
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-3 px-4 rounded-xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-md max-w-xl mx-auto shadow-sm">
      {/* Autoplay blocked notification banner */}
      {autoplayBlocked && (
        <div className="w-full flex items-center justify-between gap-3 p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Audio was paused by your browser. Tap to hear your verdict!</span>
          </div>
          <button
            onClick={onPlayPending}
            className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors shrink-0"
          >
            Play Sound 🔊
          </button>
        </div>
      )}

      {/* Audio Status & Sound Indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <span className="font-mono text-[11px] text-purple-300">
          Audio Signal:
        </span>
        {isPlaying ? (
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 bg-cyan-400 h-2 animate-bounce" />
              <span className="w-0.5 bg-cyan-400 h-3 animate-pulse" />
              <span className="w-0.5 bg-cyan-400 h-1.5 animate-bounce" />
            </span>
            <span>Playing {soundType === 'clapping' ? 'Celebration Applause 👏' : 'Cosmic Roast Laugh 😂'}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/30 font-mono">
              Auto-stops in 6s
            </span>
          </span>
        ) : (
          <span className="text-slate-400">
            {isMuted ? 'Muted' : soundType === 'none' ? 'Neutral Orbit' : 'Ready'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Stop Button */}
        {isPlaying && (
          <button
            onClick={onStopSound}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/30 transition-all font-semibold"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Audio</span>
          </button>
        )}

        {/* Mute/Unmute Button */}
        <button
          onClick={onToggleMute}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-all"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Mute</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
