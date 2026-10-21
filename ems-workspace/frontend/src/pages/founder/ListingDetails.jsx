import React from 'react';
import { useParams } from 'react';

export function ListingDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100">
      <h3 className="text-2xl font-bold mb-2">Startup Listing Details</h3>
      <p className="text-xs text-slate-400 mb-4">Viewing listing ID: {id}</p>
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
        Startup listing overview and matching data.
      </div>
    </div>
  );
}

export default ListingDetails;
