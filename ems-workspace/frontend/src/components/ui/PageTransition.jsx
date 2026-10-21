import React from 'react';
import { motion } from 'framer-motion';


export function PageTransition({ children, activeKey }) {
  return (
    <motion.div
      key={activeKey}
      initial={{ opacity: 0, y: 15, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.99 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
