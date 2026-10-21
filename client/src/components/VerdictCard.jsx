import React from 'react';
import { Flame, Sparkles, CheckCircle2, MessageSquareQuote } from 'lucide-react';

export default function VerdictCard({ ai, score, isInsufficientData }) {
  const { roast, compliment, strengths } = ai;

  const isGood = score >= 7.0;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-galaxy-card relative overflow-hidden border border-purple-500/30">
      {/* Background ambient gradient glow */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isGood ? 'bg-cyan-500/10' : 'bg-purple-600/15'
      }`} />

      {/* Card Header */}
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-purple-900/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/30 text-cyan-400">
            {isGood ? <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" /> : <Flame className="w-5 h-5 text-purple-400" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-widest text-white">
              The Galaxy's Verdict
            </h3>
            <span className="text-[11px] text-purple-300/80 font-mono">
              AI Cosmic Analysis
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-mono">
          {isGood ? '🌟 Celebrated' : isInsufficientData ? '🌱 Fresh Start' : '🪐 Roasted'}
        </span>
      </div>

      {/* Primary Roast / Compliment Quote */}
      <div className="relative my-4 p-5 sm:p-6 rounded-xl bg-purple-950/30 border border-purple-500/20 backdrop-blur-sm">
        <MessageSquareQuote className="w-8 h-8 text-purple-400/40 absolute -top-3.5 -left-2" />
        <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed relative z-10">
          "{roast}"
        </p>
      </div>

      {/* Compliment Section */}
      {compliment && (
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed">
              <strong className="text-cyan-300">Cosmic Silver Lining: </strong>
              {compliment}
            </p>
          </div>
        </div>
      )}

      {/* Strengths Section */}
      {strengths && strengths.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Demonstrated Cosmic Strengths</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {strengths.map((st, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#090C1E]/80 border border-slate-800/80 flex flex-col gap-1"
              >
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {st.title}
                </span>
                <span className="text-xs text-slate-400 leading-normal">
                  {st.evidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
