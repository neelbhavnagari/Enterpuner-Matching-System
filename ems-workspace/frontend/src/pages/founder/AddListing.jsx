import React from 'react';
import AnimatedFeed from '../../features/matching/AnimatedFeed';

export function AddListing() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          🚀 Add New Startup Listing
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Post your venture to MongoDB Atlas and reach investors & co-founders.
        </p>
      </div>
      <h1>Hello Guys</h1>
      <AnimatedFeed />
    </div>
  );
}

export default AddListing;
