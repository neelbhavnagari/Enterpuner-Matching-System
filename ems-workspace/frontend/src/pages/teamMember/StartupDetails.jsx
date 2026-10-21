import React from 'react';
import { useParams } from 'react';

export function StartupDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100">
      <h3 className="text-2xl font-bold mb-2">Team Member Startup Details View</h3>
      <p className="text-xs text-slate-400 mb-4">Viewing Startup ID: {id}</p>
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
        Venture overview, required skills, and team joining opportunities.
      </div>
    </div>
  );
}

export default StartupDetails;
