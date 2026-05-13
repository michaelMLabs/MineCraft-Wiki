'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Soft fade + lift on route entrance. Kept minimal — Apple's transitions
 * are short (≤ 350ms) and use the same custom easing across the whole product.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.main>
  );
}
