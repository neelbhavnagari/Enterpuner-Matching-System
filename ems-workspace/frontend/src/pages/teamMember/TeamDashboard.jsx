import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function TeamDashboard() {
  return (
    <div className="space-y-6">
      {/* Dynamic Team Talent & Execution Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950 via-blue-900/80 to-slate-900 p-6 md:p-8 border border-cyan-500/40 shadow-2xl">
        {/* Ambient Tech Energy & Cyan Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-8 opacity-15 text-9xl pointer-events-none select-none">⚡</div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <span>⚡</span> Talent & Execution Hub
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold backdrop-blur-md">
              🛠️ High-Impact Contributors
            </span>
          </div>

          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Join Cutting-Edge Venture Teams ⚡
            </h2>
            <p className="text-xs md:text-sm text-cyan-200/90 leading-relaxed">
              Showcase your engineering & product design skill set, discover high-growth startups hiring co-founders or key team members, and build the future.
            </p>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">Skill Profile</span>
              <span className="text-sm font-black text-white">Full-Stack / AI</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">Venture Opportunities</span>
              <span className="text-sm font-black text-blue-300">Open Matching</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">Roles</span>
              <span className="text-sm font-black text-cyan-300">Co-Founder / Key Lead</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 block">AI Skill Compatibility</span>
              <span className="text-sm font-black text-emerald-400">92% Match</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default TeamDashboard;

