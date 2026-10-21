import React from 'react';
import { Crown, Rocket, Flame, Compass } from 'lucide-react';

export default function VerdictBadge({ verdict, label }) {
  let badgeStyle = {
    bg: 'from-amber-500/20 via-orange-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
    icon: Crown,
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
    tag: 'LEGENDARY EXPLORER'
  };

  if (verdict === 'PROMISING DEVELOPER') {
    badgeStyle = {
      bg: 'from-purple-500/20 via-indigo-500/20 to-cyan-500/10 border-purple-500/40 text-cyan-300',
      icon: Rocket,
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.35)]',
      tag: 'SOLID TRAJECTORY'
    };
  } else if (verdict === 'GITHUB ROASTED') {
    badgeStyle = {
      bg: 'from-red-500/20 via-orange-500/20 to-amber-500/10 border-red-500/40 text-orange-300',
      icon: Flame,
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.35)]',
      tag: 'COSMIC ROAST'
    };
  } else if (verdict === 'COSMIC CADET') {
    badgeStyle = {
      bg: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/10 border-emerald-500/40 text-emerald-300',
      icon: Compass,
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      tag: 'NEW EXPLORER'
    };
  }

  const Icon = badgeStyle.icon;

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border bg-gradient-to-r backdrop-blur-md transition-all uppercase tracking-wider text-xs sm:text-sm font-bold shadow-lg"
         style={{ ...badgeStyle }}>
      <Icon className="w-4 h-4 animate-bounce" />
      <span>{verdict}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      <span className="text-[11px] opacity-80 normal-case">{label}</span>
    </div>
  );
}
