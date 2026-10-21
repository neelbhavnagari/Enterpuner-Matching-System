import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function FounderDashboard() {
  return (
    <div className="space-y-6">
      {/* Dynamic Founder Idea & Venture Innovation Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-900/80 to-slate-900 p-6 md:p-8 border border-indigo-500/40 shadow-2xl">
        {/* Ambient Lightbulb & Idea Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-8 opacity-15 text-9xl pointer-events-none select-none">💡</div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <span>🚀</span> Founder Space (Idea & Venture)
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold backdrop-blur-md">
              💡 AI Pitch & Match Active
            </span>
          </div>

          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Turn Your Ideas into Scalable Ventures 🚀
            </h2>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Post startup listings, showcase your product vision, and use AI matching to connect with top-tier Investors, Mentors, and Team talent.
            </p>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block">Status</span>
              <span className="text-sm font-black text-white">Active Founder</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block">Investor Reach</span>
              <span className="text-sm font-black text-emerald-400">Direct Access</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block">Mentors</span>
              <span className="text-sm font-black text-amber-400">Available</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-indigo-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block">AI Match Score</span>
              <span className="text-sm font-black text-purple-300">95% High</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default FounderDashboard;

