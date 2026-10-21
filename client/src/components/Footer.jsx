import React from 'react';
import { Sparkles, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-purple-900/30 py-8 px-4 text-center text-xs text-slate-400">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>GitHub Roast &bull; Cosmic Developer Analysis</span>
        </div>

        <p className="max-w-xl text-slate-400 leading-relaxed">
          GitHub API is the source of truth for facts &bull; Google Gemini is the cosmic humor layer.
          Scores are deterministically calculated from public repositories and activity signals.
        </p>

        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] pt-2">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>No private repositories or personal tokens are ever inspected or stored.</span>
        </div>
      </div>
    </footer>
  );
}
