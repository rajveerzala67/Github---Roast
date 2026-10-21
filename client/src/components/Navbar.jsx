import React from 'react';
import { Sparkles, Volume2, VolumeX, Square, Github } from 'lucide-react';

export default function Navbar({ isMuted, isPlaying, onToggleMute, onStopSound }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#05050D]/70 border-b border-purple-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-galaxy-glow">
            <div className="w-full h-full bg-[#080A18] rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
              GitHub Roast <span className="text-xs">🚀</span>
            </span>
          </div>
        </div>

        {/* Center Badge (Desktop) */}
        <div className="hidden md:flex items-center">
          <span className="text-[11px] font-semibold tracking-wider px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 shadow-sm uppercase">
            AI-Powered Developer Analysis
          </span>
        </div>

        {/* Controls: Audio Toggle, Stop Sound, GitHub Link */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Stop sound button if playing */}
          {isPlaying && (
            <button
              onClick={onStopSound}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 transition-colors animate-pulse"
              title="Stop playing sound effect"
              aria-label="Stop audio effect"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Stop Sound</span>
            </button>
          )}

          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-purple-950/50 border-purple-500/40 text-cyan-400 hover:bg-purple-900/60 shadow-sm'
            }`}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* GitHub Project Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white transition-colors"
            title="GitHub"
            aria-label="Visit GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
