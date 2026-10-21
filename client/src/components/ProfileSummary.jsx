import React from 'react';
import { ExternalLink, Star, GitFork, BookOpen, Users, Calendar, Code } from 'lucide-react';

export default function ProfileSummary({ profile, metrics }) {
  const {
    username,
    name,
    avatarUrl,
    profileUrl,
    bio,
    publicRepos,
    followers,
    following,
    accountAgeYears,
  } = profile;

  const { totalStars, totalForks, topLanguages } = metrics;

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-galaxy-card">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar with gradient glow ring */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 shadow-galaxy-glow">
            <img
              src={avatarUrl}
              alt={`${username}'s avatar`}
              className="w-full h-full rounded-2xl object-cover bg-slate-900"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-purple-950/90 border border-purple-500/40 text-[10px] font-mono text-cyan-300">
            {accountAgeYears}y exp
          </div>
        </div>

        {/* User details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {name || username}
              </h3>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors mt-0.5"
              >
                <span>@{username}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Account Age badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Created {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}</span>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-slate-300 mt-2.5 max-w-xl line-clamp-2 italic">
              "{bio}"
            </p>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Repositories</span>
                <span className="text-sm font-bold text-white font-mono">{publicRepos}</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Stars</span>
                <span className="text-sm font-bold text-white font-mono">{totalStars}</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Forks</span>
                <span className="text-sm font-bold text-white font-mono">{totalForks}</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400">Followers</span>
                <span className="text-sm font-bold text-white font-mono">{followers}</span>
              </div>
            </div>
          </div>

          {/* Top Languages Tags */}
          {topLanguages && topLanguages.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
              <Code className="w-3.5 h-3.5 text-purple-400 mr-1" />
              <span className="text-xs text-slate-400 mr-1">Languages:</span>
              {topLanguages.slice(0, 5).map((lang) => (
                <span
                  key={lang.name}
                  className="px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-500/20 text-xs font-mono text-purple-200"
                >
                  {lang.name} ({lang.count})
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
