import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function ManageListings() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          📑 Manage Listings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, or edit all startup listings posted to MongoDB.
        </p>
      </div>

      <AnimatedFeed />
    </div>
  );
}

export default ManageListings;
