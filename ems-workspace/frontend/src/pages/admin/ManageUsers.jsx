import React from 'react';
import { ConnectionsPage } from '../../features/connections/ConnectionsPage';

export function ManageUsers() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          👥 Manage Users
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review, edit roles, or manage all platform members.
        </p>
      </div>

      <ConnectionsPage />
    </div>
  );
}

export default ManageUsers;
