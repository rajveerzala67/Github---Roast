import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, HelpCircle } from 'lucide-react';

export default function ScoreBreakdown({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-galaxy-card">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Telemetry Breakdown
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Weighted Score Matrix
        </span>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const ratio = Math.min(Math.max(cat.score / 10, 0), 1);
          let barGradient = 'from-cyan-500 to-blue-500';
          if (cat.score >= 8.0) barGradient = 'from-purple-500 via-indigo-500 to-cyan-400';
          else if (cat.score < 5.0) barGradient = 'from-red-500 via-orange-500 to-amber-400';

          return (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span>{cat.name}</span>
                  {cat.weight && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 font-mono border border-purple-500/20">
                      {cat.weight}%
                    </span>
                  )}
                </span>
                <span className="font-bold font-mono text-cyan-300">
                  {cat.score.toFixed(1)} <span className="text-slate-500 text-xs font-normal">/ 10</span>
                </span>
              </div>

              {/* Progress bar container */}
              <div className="h-2 w-full rounded-full bg-slate-900/80 border border-slate-800/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${barGradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                />
              </div>

              {/* Evidence explanation */}
              <p className="text-[11px] text-slate-400 leading-tight">
                {cat.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
