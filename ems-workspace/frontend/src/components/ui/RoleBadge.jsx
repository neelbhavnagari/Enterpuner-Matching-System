import React from 'react';
import { cn } from '../../utils/cn';

/**
 * RoleBadge Primitive - Standardized badge component enforcing design system
 * styling across all 4 registered roles: Founder (Idea/Venture), Investor, Mentor, and Team Member.
 */
export const ROLE_CONFIG = {
  founder: {
    label: 'Founder',
    sublabel: 'Idea & Venture',
    icon: '🚀',
    accentColor: 'indigo',
    classes: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 dark:bg-indigo-950/70 dark:text-indigo-200 hover:border-indigo-400/50 shadow-indigo-500/10',
    glowClass: 'from-indigo-500/20 via-purple-500/10 to-transparent'
  },
  investor: {
    label: 'Investor',
    sublabel: 'Capital & Deals',
    icon: '💼',
    accentColor: 'emerald',
    classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 dark:bg-emerald-950/70 dark:text-emerald-200 hover:border-emerald-400/50 shadow-emerald-500/10',
    glowClass: 'from-emerald-500/20 via-teal-500/10 to-transparent'
  },
  mentor: {
    label: 'Mentor',
    sublabel: 'Advisory & Growth',
    icon: '🎓',
    accentColor: 'amber',
    classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30 dark:bg-amber-950/70 dark:text-amber-200 hover:border-amber-400/50 shadow-amber-500/10',
    glowClass: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  team: {
    label: 'Team Member',
    sublabel: 'Talent & Execution',
    icon: '⚡',
    accentColor: 'cyan',
    classes: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 dark:bg-cyan-950/70 dark:text-cyan-200 hover:border-cyan-400/50 shadow-cyan-500/10',
    glowClass: 'from-cyan-500/20 via-blue-500/10 to-transparent'
  },
};

export function RoleBadge({ role = 'founder', customLabel, className, size = 'md', showSublabel = false }) {
  const roleKey = role?.toLowerCase() || 'founder';
  const config = ROLE_CONFIG[roleKey] || ROLE_CONFIG.founder;

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-extrabold gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border shadow-sm transition-all select-none backdrop-blur-md',
        config.classes,
        sizes[size],
        className
      )}
    >
      <span className="text-xs">{config.icon}</span>
      <span>{customLabel || config.label}</span>
      {showSublabel && (
        <span className="opacity-75 text-[10px] font-normal border-l border-current/30 pl-1.5 ml-0.5">
          {config.sublabel}
        </span>
      )}
    </span>
  );
}

export default RoleBadge;

