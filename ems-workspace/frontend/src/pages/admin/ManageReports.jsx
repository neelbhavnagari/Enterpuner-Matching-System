import React from 'react';

export function ManageReports() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100">
      <h3 className="text-xl font-bold mb-2">🚩 Manage Reports & Moderation</h3>
      <p className="text-xs text-slate-400 mb-6">System moderation log and user report feedback queue.</p>
      
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
        No active user flags or unresolved reports in queue.
      </div>
    </div>
  );
}

export default ManageReports;
