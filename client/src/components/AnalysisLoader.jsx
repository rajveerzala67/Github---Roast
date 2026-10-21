import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Radio, Cpu, Award } from 'lucide-react';

const STEPS = [
  { text: 'Connecting to the GitHub galaxy...', icon: Radio },
  { text: 'Scanning repositories & language constellations...', icon: Compass },
  { text: 'Inspecting coding activity & documentation...', icon: Sparkles },
  { text: 'Consulting the AI roast engine...', icon: Cpu },
  { text: 'Preparing your verdict...', icon: Award },
];

export default function AnalysisLoader() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Step progression every 1.5 seconds up to the final step
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = STEPS[currentStepIndex].icon;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <div className="glass-panel rounded-2xl p-8 border border-purple-500/30 relative overflow-hidden shadow-galaxy-glow">
        {/* Animated background cosmic pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-cyan-900/10 to-purple-900/10 animate-pulse pointer-events-none" />

        {/* Orbiting Orbital Loader */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Outer spinning dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin-slow" />

          {/* Inner pulsating glow ring */}
          <div className="absolute inset-2 rounded-full border border-purple-500/40 animate-pulse" />

          {/* Satellite orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-galaxy-cyan absolute -top-1.5 left-1/2 -translate-x-1/2" />
          </div>

          {/* Center Icon */}
          <div className="w-12 h-12 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-cyan-300">
            <CurrentIcon className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            {STEPS[currentStepIndex].text}
          </h3>
          <p className="text-xs text-purple-300/80 mt-1">
            Analyzing telemetry across public commits and star systems
          </p>
        </motion.div>

        {/* Step Indicator Dots */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.text}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStepIndex
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-cyan-400'
                  : idx < currentStepIndex
                  ? 'w-3 bg-purple-500/80'
                  : 'w-2 bg-slate-700/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
