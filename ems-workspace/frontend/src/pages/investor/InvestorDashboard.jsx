import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function InvestorDashboard() {
  return (
    <div className="space-y-6">
      {/* Dynamic Investor Capital & Deal Flow Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900/80 to-slate-900 p-6 md:p-8 border border-emerald-500/40 shadow-2xl">
        {/* Ambient Deal Flow & Emerald Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-8 opacity-15 text-9xl pointer-events-none select-none">💎</div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md">
              <span>💼</span> Investor Deal Flow
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold backdrop-blur-md">
              💎 High-Yield Ventures
            </span>
          </div>

          <div className="max-w-2xl space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Discover & Fund Next-Gen Startups 💼
            </h2>
            <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed">
              Explore vetted founder listings, review stage & valuation metrics, and connect directly with high-potential entrepreneurs.
            </p>
          </div>

          {/* Quick Metrics & Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">Deal Pipeline</span>
              <span className="text-sm font-black text-white">Live Stream</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">Pre-Seed / Seed</span>
              <span className="text-sm font-black text-teal-300">Verified</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">Direct Chat</span>
              <span className="text-sm font-black text-emerald-300">Enabled</span>
            </div>
            <div className="bg-slate-950/50 backdrop-blur-md p-3 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 block">Matching Engine</span>
              <span className="text-sm font-black text-emerald-400">Cosine AI v2</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default InvestorDashboard;

