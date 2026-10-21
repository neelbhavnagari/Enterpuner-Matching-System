import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility helper to conditionally merge Tailwind CSS classes safely.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
