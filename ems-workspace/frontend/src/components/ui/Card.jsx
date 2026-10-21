import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-slate-800/80 dark:bg-slate-900/90 border border-slate-700/60 rounded-2xl p-6 shadow-xl backdrop-blur-md text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
