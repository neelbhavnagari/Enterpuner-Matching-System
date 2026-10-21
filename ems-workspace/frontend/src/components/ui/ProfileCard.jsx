import React from 'react';
import { motion } from 'framer-motion';
import { RoleBadge, ROLE_CONFIG } from './RoleBadge';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function ProfileCard({
  profile,
  onConnect,
  onEdit,
  onDelete,
  isOwner = false,
  isConnected = false,
  className,
}) {
  const {
    id,
    _id,
    name = '',
    role = 'founder',
    title = '',
    score,
    matchScore,
    matchDetails,
    category,
    stage,
    fundingRequired,
    problemSolved,
    targetUsers,
    teamSize,
    bio = '',
    about = '',
    skills = [],
    location = '',
    avatar,
    patentStatus = '',
    // Investor specific 11 fields
    investmentRange,
    investmentPortfolio,
    preferredIndustry,
    preferredStage,
    investmentExperience,
    experience,
    yearsOfExperience,
    investmentGoals,
    goals,
    availability,
  } = profile || {};

  const roleKey = role?.toLowerCase() || 'founder';
  const isInvestor = roleKey === 'investor';
  const isMentor = roleKey === 'mentor';
  const displayScore = matchScore || score || 90;
  const keywords = matchDetails?.matchedKeywords || [];

  const effectiveInvestmentRange = investmentRange || fundingRequired;
  const effectivePreferredIndustry = preferredIndustry || category;
  const effectivePreferredStage = preferredStage || stage;
  const effectiveExperience = investmentExperience || experience || yearsOfExperience;
  const effectiveGoals = investmentGoals || goals;
  const effectiveAbout = about || bio;

  const roleBorderGlows = {
    founder: 'hover:border-indigo-500/60 hover:shadow-indigo-500/10',
    investor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
    mentor: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
    team: 'hover:border-cyan-500/60 hover:shadow-cyan-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col justify-between p-6 bg-slate-800/90 dark:bg-slate-900/90 border border-slate-700/70 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300',
        roleBorderGlows[roleKey],
        isOwner && 'border-indigo-500/60 ring-1 ring-indigo-500/30',
        className
      )}
    >
      <div>
        {/* Top Header: Avatar, Name, Title, Location & Role Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-500 text-white font-bold text-lg flex items-center justify-center shadow-md overflow-hidden shrink-0">
              {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : (name ? name.charAt(0).toUpperCase() : '?')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-slate-100 leading-snug">{name || 'Member'}</h4>
                {isOwner && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    💼 Your Listing
                  </span>
                )}
              </div>
              {title && <p className="text-xs font-medium text-slate-400">{title}</p>}
              {location && <span className="text-[11px] text-slate-500">📍 {location}</span>}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <RoleBadge role={roleKey} />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm">
              ⚡ {displayScore}% TF-IDF Match
            </span>
          </div>
        </div>

        {/* Dynamic Badges Container */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {isInvestor ? (
            <>
              {effectiveInvestmentRange && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                  💰 Check Size: {effectiveInvestmentRange}
                </span>
              )}
              {effectivePreferredIndustry && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
                  🏷️ Industry: {effectivePreferredIndustry}
                </span>
              )}
              {effectivePreferredStage && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-950/70 text-purple-300 border border-purple-800/60">
                  📊 Stage: {effectivePreferredStage}
                </span>
              )}
              {effectiveExperience && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-950/70 text-amber-300 border border-amber-800/60">
                  ⭐ Experience: {effectiveExperience}
                </span>
              )}
              {availability && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                  ⏳ Availability: {availability}
                </span>
              )}
            </>
          ) : isMentor ? (
            <>
              {category && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-950/70 text-amber-300 border border-amber-800/60">
                  🏷️ Industry: {category}
                </span>
              )}
              {effectiveExperience && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-950/70 text-purple-300 border border-purple-800/60">
                  ⭐ Experience: {effectiveExperience}
                </span>
              )}
              {availability && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-950/70 text-cyan-300 border border-cyan-800/60">
                  ⏳ Availability: {availability}
                </span>
              )}
            </>
          ) : (
            <>
              {category && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                  🏷️ {category}
                </span>
              )}
              {stage && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                  📊 {stage}
                </span>
              )}
              {fundingRequired && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/50">
                  💰 {fundingRequired}
                </span>
              )}
              {teamSize && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                  👥 {teamSize} Members
                </span>
              )}
              {patentStatus && patentStatus !== 'No Patent' && (
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border shadow-sm ${
                  patentStatus.includes('Patented')
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : patentStatus.includes('Pending')
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}>
                  📜 {patentStatus}
                </span>
              )}
            </>
          )}
        </div>

        {/* Mentor Expertise Section */}
        {isMentor && profile?.expertise && (Array.isArray(profile.expertise) ? profile.expertise.length > 0 : String(profile.expertise).length > 0) && (
          <div className="mb-3 bg-amber-950/30 p-2.5 rounded-xl border border-amber-900/40">
            <span className="block text-[10px] font-bold text-amber-400 mb-1">🌟 Mentorship Expertise</span>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(profile.expertise) ? profile.expertise : String(profile.expertise).split(',')).map((exp, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                  {String(exp).trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Investment Portfolio Section (Investor Only) */}
        {isInvestor && investmentPortfolio && (
          <div className="mb-3 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40">
            <span className="block text-[10px] font-bold text-emerald-400 mb-0.5">💼 Investment Portfolio</span>
            <p className="text-[11px] text-slate-200 leading-snug">{investmentPortfolio}</p>
          </div>
        )}

        {/* Goals Section */}
        {effectiveGoals && (
          <div className="mb-3 bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-900/40">
            <span className="block text-[10px] font-bold text-indigo-400 mb-0.5">
              {isMentor ? '🎯 Mentorship Goals' : isInvestor ? '🎯 Investment Goals' : '🎯 Goals'}
            </span>
            <p className="text-[11px] text-slate-200 leading-snug">{effectiveGoals}</p>
          </div>
        )}

        {/* About / Bio Description */}
        {effectiveAbout && (
          <div className="mb-3">
            <span className="block text-[10px] font-bold text-slate-400 mb-0.5">📝 About</span>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{effectiveAbout}</p>
          </div>
        )}

        {/* Matched Keywords Badge */}
        {keywords.length > 0 && (
          <div className="mb-3 px-2.5 py-1.5 bg-indigo-950/40 rounded-xl border border-indigo-900/40 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-indigo-400">🔍 TF-IDF Similarity Terms:</span>
            {keywords.map((kw, i) => (
              <span key={i} className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Problem Being Solved (Founder Only) */}
        {!isInvestor && !isMentor && problemSolved && (
          <div className="mb-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="block text-[10px] font-bold text-amber-400 mb-0.5">💡 Problem Being Solved</span>
            <p className="text-[11px] text-slate-300 leading-snug">{problemSolved}</p>
          </div>
        )}

        {/* Target Users (Founder Only) */}
        {!isInvestor && !isMentor && targetUsers && (
          <div className="mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
            <span className="block text-[10px] font-bold text-indigo-400 mb-0.5">🎯 Target Users</span>
            <p className="text-[11px] text-slate-300 leading-snug">{targetUsers}</p>
          </div>
        )}

        {/* Skill Pills */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Array.isArray(skills) ? skills : String(skills).split(',')).map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-slate-950/60 text-slate-300 border border-slate-800"
              >
                🛠️ {String(skill).trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800/80">
        {isOwner ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(profile)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-xs font-bold text-slate-200 border border-slate-600 transition flex items-center justify-center gap-1.5"
            >
              <span>✏️ Edit Listing</span>
            </button>
            <button
              onClick={() => onDelete?.(id || _id)}
              className="py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-xs font-bold text-rose-300 border border-rose-800/50 transition flex items-center justify-center gap-1.5"
            >
              <span>🗑️ Delete</span>
            </button>
          </div>
        ) : (
          <Button
            role={roleKey}
            onClick={() => onConnect?.(profile)}
            disabled={isConnected}
            className="w-full text-xs font-bold"
          >
            {isConnected ? '✓ Connection Sent' : `🤝 Connect with ${ROLE_CONFIG[roleKey]?.label || 'Member'}`}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export default ProfileCard;
