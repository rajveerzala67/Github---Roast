import React from 'react';
import { Target, ArrowRight, Lightbulb, Rocket } from 'lucide-react';

export default function ImprovementList({ improvements }) {
  if (!improvements || improvements.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-galaxy-card">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-purple-900/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-white">
              Your Next Mission
            </h3>
            <span className="text-[11px] text-cyan-300/80 font-mono">
              Actionable Flight Plan
            </span>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
          {improvements.length} Directives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {improvements.map((mission, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-xl bg-[#090C1E]/80 border border-purple-900/40 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-[11px] font-bold text-white flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {mission.title}
                </h4>
              </div>

              {/* Why it matters */}
              <div className="mb-3 text-xs text-slate-300 leading-relaxed flex items-start gap-2 bg-purple-950/20 p-2.5 rounded-lg border border-purple-900/20">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-200">Why it matters: </strong>
                  <span>{mission.reason}</span>
                </div>
              </div>
            </div>

            {/* How to implement */}
            <div className="pt-2 border-t border-slate-800/80 text-xs text-cyan-200/90 flex items-start gap-2">
              <Rocket className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300">Action: </strong>
                <span>{mission.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
