import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function MentorDashboard() {
  return (
    <div className="space-y-6">
      {/* Dynamic Mentor Advisory & Guidance Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-orange-900/80 to-slate-900 p-6 md:p-8 border border-amber-500/40 shadow-2xl">
        {/* Ambient Advisory & Gold Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-8 opacity-15 text-9xl pointer-events-none select-none">🎓</div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <span>🎓</span> Mentor Advisory Hub
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold backdrop-blur-md">
              🌟 Verified Domain Expert
            </span>
          </div>

          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Guide Early-Stage Founders to Victory 🎓
            </h2>
            <p className="text-xs md:text-sm text-amber-200/90 leading-relaxed">
              Share your industry expertise, advise promising ventures on tech architecture & fundraising strategy, and build long-term advisory relationships.
            </p>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-amber-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">Status</span>
              <span className="text-sm font-black text-white">Active Mentor</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-amber-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">Advisory Focus</span>
              <span className="text-sm font-black text-orange-300">Tech & Growth</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-amber-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">Availability</span>
              <span className="text-sm font-black text-emerald-400">Open for 1-on-1</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-amber-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block">Network Impact</span>
              <span className="text-sm font-black text-amber-300">High Score</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default MentorDashboard;

