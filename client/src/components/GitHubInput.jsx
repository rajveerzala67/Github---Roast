import React, { useState, forwardRef } from 'react';
import { Github, Sparkles, X, ShieldCheck, AlertCircle } from 'lucide-react';

const GitHubInput = forwardRef(function GitHubInput(
  { onSubmit, isLoading, errorMessage, onClearError },
  ref
) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const handleClear = () => {
    setInputValue('');
    if (errorMessage && onClearError) {
      onClearError();
    }
  };

  // Sample quick usernames to try
  const quickProfiles = ['torvalds', 'gaearon', 'leerob', 'shadcn'];

  return (
    <section className="max-w-2xl mx-auto px-4 w-full mb-12 scroll-mt-24" ref={ref}>
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-galaxy-card relative overflow-hidden">
        {/* Subtle top border glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label
              htmlFor="github-input"
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
            >
              <Github className="w-4 h-4 text-purple-400" />
              <span>Enter your GitHub profile URL</span>
            </label>
            <span className="text-xs text-slate-400 hidden sm:inline">
              URL or @username
            </span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Github className="w-5 h-5 text-slate-400" />
            </div>

            <input
              id="github-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMessage && onClearError) onClearError();
              }}
              placeholder="https://github.com/your-username"
              disabled={isLoading}
              autoComplete="off"
              spellCheck="false"
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-xl bg-[#090C1E]/90 border border-purple-900/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder-slate-500 text-sm sm:text-base outline-none transition-all disabled:opacity-50 font-mono"
            />

            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-full py-4 px-6 rounded-xl font-bold text-white text-base tracking-wide bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 shadow-galaxy-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning Orbit...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
                <span>Roast My GitHub</span>
              </>
            )}
          </button>

          {/* Privacy Note and Fast Samples */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800/60 mt-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public profile analysis. No password required.</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Try:</span>
              {quickProfiles.map((user) => (
                <button
                  key={user}
                  type="button"
                  onClick={() => {
                    setInputValue(user);
                    if (errorMessage && onClearError) onClearError();
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-purple-900/40 hover:text-cyan-300 text-slate-400 transition-colors font-mono text-[11px]"
                >
                  @{user}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
});

export default GitHubInput;
