import React from 'react';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-rose-900/60 to-red-900/60 p-6 rounded-2xl border border-rose-500/30">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          🛡️ Admin Control Panel
        </h2>
        <p className="text-xs text-rose-200 mt-1">
          Monitor platform metrics, manage registered users, oversee startup listings, and review reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Total Users</span>
          <h4 className="text-2xl font-black text-white mt-1">128</h4>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Startup Listings</span>
          <h4 className="text-2xl font-black text-indigo-400 mt-1">42</h4>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400">Active Connections</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">310</h4>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
