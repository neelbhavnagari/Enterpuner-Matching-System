import React, { useState } from 'react';

const ROLE_CONFIG = {
  founder: {
    label: 'Founder',
    icon: '🚀',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-950/60',
    badgeText: 'text-indigo-300',
    pillBorder: 'border-indigo-800/50',
  },
  investor: {
    label: 'Investor',
    icon: '💼',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    pillBorder: 'border-emerald-800/50',
  },
  mentor: {
    label: 'Mentor',
    icon: '🎓',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-300',
    pillBorder: 'border-amber-800/50',
  },
  team: {
    label: 'Team Member',
    icon: '⚡',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-300',
    pillBorder: 'border-cyan-800/50',
  },
  teammember: {
    label: 'Team Member',
    icon: '⚡',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-300',
    pillBorder: 'border-cyan-800/50',
  },
};

const Spinner = () => (
  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin inline-block" />
);

export function ConnectionCard({
  connection,
  onConnect,
  onStartChat,
  onAccept,
  onReject,
  onRemove,
  actionLoading = false,
  showConnectModal = null,
}) {
  const [expandedBio, setExpandedBio] = useState(false);

  // Extract user safely
  const user = connection?.user || connection?.sender || connection?.receiver || connection;
  const connState = user?.connection || (connection?.status ? { connectionId: connection._id, status: connection.status, isSender: connection.isSender } : null);

  const rawRole = user?.role || 'founder';
  const roleKey = rawRole.toLowerCase().replace(/\s+/g, '');
  const rc = ROLE_CONFIG[roleKey] || ROLE_CONFIG[rawRole.toLowerCase()] || ROLE_CONFIG.founder;
  const roleLabel = rc?.label || 'Member';

  const name = user?.name || 'Member';
  const title = user?.title || user?.role || 'Professional';
  const bio = user?.bio || user?.about || user?.summary || user?.description || '';
  const location = user?.location || '';
  const avatar = user?.avatar;

  // Role Specific metadata
  const startupName = user?.startupName || user?.company || '';
  const startupStage = user?.startupStage || user?.stage || '';
  const fundingRequired = user?.fundingRequired || user?.fundingGoal || '';
  const industry = user?.industry || user?.category || '';
  const patentStatus = user?.patentStatus || '';

  const investorType = user?.investorType || '';
  const investmentRange = user?.investmentRange || user?.checkSize || '';
  const preferredIndustry = user?.preferredIndustry || '';
  const preferredStage = user?.preferredStage || '';
  const portfolio = user?.portfolio || user?.investmentExperience || user?.experience || '';

  const expertise = Array.isArray(user?.expertise)
    ? user.expertise
    : (user?.expertise ? user.expertise.split(',') : []);
  const yearsOfExperience = user?.yearsOfExperience || user?.experience || '';
  const availability = user?.availability || '';
  const goals = user?.goals || user?.investmentGoals || '';

  const skills = Array.isArray(user?.skills)
    ? user.skills
    : (typeof user?.skills === 'string' ? user.skills.split(',') : []);

  const needs = Array.isArray(user?.needs)
    ? user.needs
    : (typeof user?.needs === 'string' ? user.needs.split(',') : []);

  const isLongBio = bio.length > 140;
  const bioDisplay = isLongBio && !expandedBio ? `${bio.slice(0, 140)}...` : bio;

  return (
    <div className={`group relative flex flex-col justify-between p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl hover:border-slate-700 transition-all duration-200 overflow-hidden`}>
      {/* Subtle background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${rc.bg} rounded-full blur-3xl opacity-20 pointer-events-none`} />

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg ${rc.bg} ${rc.color} border ${rc.border} shadow-inner`}>
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                (name[0] || '?').toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-slate-100 truncate flex items-center gap-1.5">
                {name}
              </h4>
              <p className="text-xs text-slate-400 truncate">{title}</p>
              {location && <p className="text-[11px] text-slate-500 mt-0.5">📍 {location}</p>}
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${rc.bg} ${rc.color} ${rc.border} whitespace-nowrap shadow-sm`}>
            <span>{rc.icon}</span>
            <span>{rc.label}</span>
          </span>
        </div>

        {/* Full Bio / About Section */}
        {bio ? (
          <div className="mb-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
              💬 <span className="uppercase text-[10px] tracking-wider text-slate-500 font-bold">About</span>
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line">
              {bioDisplay}
            </p>
            {isLongBio && (
              <button
                onClick={() => setExpandedBio(!expandedBio)}
                className="mt-1 text.xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                {expandedBio ? 'Read less ▴' : 'Read more ▾'}
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4 p-2.5 bg-slate-950/30 border border-slate-800/40 rounded-xl text-slate-500 text-xs italic">
            No bio provided yet.
          </div>
        )}

        {/* Role Specific Details Section ("all role") */}
        <div className="space-y-2 text-xs mb-4">

          {/* FOUNDER DETAILS */}
          {roleKey === 'founder' && (
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/40 border border-indigo-500/15 rounded-xl">
              {startupName && (
                <div className="col-span-2 flex items-center gap-1.5 text-slate-200 font-bold">
                  <span>🏢</span>
                  <span className="truncate">{startupName}</span>
                  {industry && <span className="text-[10px] font-normal text-indigo-400">({industry})</span>}
                </div>
              )}
              {startupStage && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Stage</span>
                  <span className="font-semibold text-indigo-300">{startupStage}</span>
                </div>
              )}
              {fundingRequired && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Funding Goal</span>
                  <span className="font-semibold text-emerald-400">{fundingRequired}</span>
                </div>
              )}
              {patentStatus && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 block">Patent Status</span>
                  <span className="font-semibold text-slate-300">🛡️ {patentStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* INVESTOR DETAILS */}
          {roleKey === 'investor' && (
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/40 border border-emerald-500/15 rounded-xl">
              {investmentRange && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Check Size</span>
                  <span className="font-bold text-emerald-400">{investmentRange}</span>
                </div>
              )}
              {preferredStage && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Pref. Stage</span>
                  <span className="font-semibold text-emerald-300">{preferredStage}</span>
                </div>
              )}
              {preferredIndustry && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 block">Target Sector</span>
                  <span className="font-semibold text-slate-200">🎯 {preferredIndustry}</span>
                </div>
              )}
              {portfolio && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 block">Experience / Portfolio</span>
                  <span className="text-slate-300 line-clamp-1">💼 {portfolio}</span>
                </div>
              )}
            </div>
          )}

          {/* MENTOR DETAILS */}
          {roleKey === 'mentor' && (
            <div className="space-y-2 p-3 bg-slate-950/40 border border-amber-500/15 rounded-xl">
              {expertise.length > 0 && (
                <div>
                  <span className="text-[10px] text-slate-500 block mb-1">Mentorship Expertise</span>
                  <div className="flex flex-wrap gap-1">
                    {expertise.map((exp, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-md">
                        🎓 {exp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {yearsOfExperience && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">Experience</span>
                    <span className="font-semibold text-amber-300">⏳ {yearsOfExperience}</span>
                  </div>
                )}
                {availability && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">Availability</span>
                    <span className="font-semibold text-slate-300">📅 {availability}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEAM MEMBER DETAILS */}
          {roleKey === 'team' && (
            <div className="space-y-2 p-3 bg-slate-950/40 border border-cyan-500/15 rounded-xl">
              <div className="grid grid-cols-2 gap-2">
                {yearsOfExperience && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">Experience</span>
                    <span className="font-semibold text-cyan-300">⚡ {yearsOfExperience}</span>
                  </div>
                )}
                {availability && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">Status</span>
                    <span className="font-semibold text-slate-300">📅 {availability}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SKILLS PILLS */}
          {skills.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block mb-1">Core Skills</span>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 6).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-slate-950 border border-slate-800 text-slate-300 rounded-md">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* NEEDS PILLS (for Founders) */}
          {needs.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block mb-1">Looking For</span>
              <div className="flex flex-wrap gap-1">
                {needs.map((need, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                    🔍 {need.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GOALS */}
          {goals && (
            <div className="pt-1 text-[11px] text-slate-400 italic">
              🎯 Goal: "{goals}"
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 mt-2">
        {connState?.status === 'accepted' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onStartChat && onStartChat(user)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20"
            >
              💬 Start Chat
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(connState.connectionId, name)}
                disabled={!!actionLoading}
                className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
                title="Remove connection"
              >
                {actionLoading ? <Spinner /> : '✕ Remove'}
              </button>
            )}
          </div>
        ) : connState?.status === 'pending' && connState?.isSender ? (
          <button
            type="button"
            onClick={() => onRemove && onRemove(connState.connectionId, name)}
            disabled={!!actionLoading}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition-all disabled:opacity-50"
          >
            {actionLoading ? <Spinner /> : '✕ Cancel Request'}
          </button>
        ) : (connState?.status === 'pending' && !connState?.isSender) || (onAccept && (connection._id || connection.connectionId) && connection._id !== user._id && connection._id !== user.id) ? (
          <div className="w-full">
            <button
              type="button"
              onClick={() => onAccept && onAccept(connState?.connectionId || connection._id || connection.connectionId)}
              disabled={!!actionLoading}
              className="w-full py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {actionLoading === 'accepting' ? <Spinner /> : `✓ Accept Connection with ${roleLabel}`}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onConnect) {
                onConnect(user);
              } else if (showConnectModal) {
                showConnectModal(user);
              }
            }}
            disabled={!!actionLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {actionLoading === 'sending' ? <Spinner /> : `🤝 Connect with ${roleLabel}`}
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectionCard;
