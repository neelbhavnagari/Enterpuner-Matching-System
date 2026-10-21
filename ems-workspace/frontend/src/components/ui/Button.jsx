import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Reusable animated Button primitive built with Framer Motion and Tailwind CSS.
 * Supports role accents (Founder, Investor, Mentor, Team Member), variants, sizes, and loading states.
 */
export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      role = null,
      size = 'md',
      isLoading = false,
      disabled = false,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

    // Size variants
    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    // Role-specific button accents
    const roleStyles = {
      founder:
        'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-indigo-500/20 shadow-md',
      investor:
        'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 shadow-emerald-500/20 shadow-md',
      mentor:
        'bg-amber-500 hover:bg-amber-400 text-slate-950 focus:ring-amber-500 shadow-amber-500/20 shadow-md',
      team:
        'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 shadow-cyan-500/20 shadow-md',
    };

    // Standard variants
    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500 shadow-md shadow-indigo-500/20',
      secondary:
        'bg-slate-700/60 hover:bg-slate-600/80 text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-600/60',
      outline:
        'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 focus:ring-indigo-500',
      ghost:
        'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-slate-100',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-md shadow-rose-500/20',
    };

    const selectedStyle =
      role && roleStyles[role] ? roleStyles[role] : variants[variant];

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(baseStyles, sizes[size], selectedStyle, className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
