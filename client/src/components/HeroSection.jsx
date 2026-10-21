import React from 'react';
import PlanetScene from '../scenes/PlanetScene';
import { ArrowDown, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function HeroSection({ onCtaClick }) {
  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 text-center max-w-4xl mx-auto px-4">
      {/* 3D Celestial Planet */}
      <div className="mb-4">
        <PlanetScene />
      </div>

      {/* Galaxy Pills */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm shadow-galaxy-glow">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Cosmic Developer Reputation Scanner</span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
        Your GitHub.{' '}
        <span className="text-gradient-cosmic">Our Judgment.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
        Discover your developer reputation, expose your coding sins, and find out whether your GitHub deserves{' '}
        <span className="text-emerald-400 font-medium">applause</span> or a{' '}
        <span className="text-purple-400 font-medium">cosmic roast</span>.
      </p>

      {/* CTA Button */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onCtaClick}
          className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 shadow-galaxy-glow hover:shadow-galaxy-cyan transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Analyze My GitHub</span>
          <span className="text-lg group-hover:scale-125 transition-transform">🚀</span>
        </button>
      </div>
    </section>
  );
}
