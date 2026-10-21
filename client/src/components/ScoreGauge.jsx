import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreGauge({ score, verdictLabel }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Smooth number animation from 0 to score
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parseFloat((eased * score).toFixed(1));
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(score);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Circle dimensions
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Score is out of 10
  const progressRatio = Math.min(Math.max(score / 10, 0), 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Color gradient based on score
  let gradientId = 'gaugeGradientMedium';
  let scoreColor = 'text-cyan-400';
  if (score >= 8.5) {
    gradientId = 'gaugeGradientHigh';
    scoreColor = 'text-amber-300';
  } else if (score >= 7.0) {
    gradientId = 'gaugeGradientSolid';
    scoreColor = 'text-cyan-400';
  } else {
    gradientId = 'gaugeGradientLow';
    scoreColor = 'text-orange-400';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop shadow */}
        <div className="absolute inset-0 rounded-full blur-xl bg-purple-600/20" />

        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id="gaugeGradientHigh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gaugeGradientSolid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="gaugeGradientLow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />

          {/* Animated Gradient Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${scoreColor}`}>
              {displayScore.toFixed(1)}
            </span>
            <span className="text-slate-400 text-sm font-semibold ml-1">/10</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
            Cosmic Score
          </span>
        </div>
      </div>

      {/* Label Underneath */}
      <div className="mt-3 text-center">
        <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
          {verdictLabel}
        </h4>
      </div>
    </div>
  );
}
