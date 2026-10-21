import React from 'react';
import { useParams } from 'react';

export function FounderDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100">
      <h3 className="text-2xl font-bold mb-2">Mentor Founder Details View</h3>
      <p className="text-xs text-slate-400 mb-4">Viewing Founder ID: {id}</p>
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
        Founder overview, venture stage, and mentorship needs.
      </div>
    </div>
  );
}

export default FounderDetails;
