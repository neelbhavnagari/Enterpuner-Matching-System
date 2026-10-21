import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function MyListings() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          ⭐ My Startup Listings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          List of all venture listings created under your Founder account.
        </p>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default MyListings;
