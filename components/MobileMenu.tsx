'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full
                   border border-white/10 bg-white/5 text-zinc-300
                   transition-colors duration-300 ease-apple hover:bg-white/10 hover:text-white
                   md:hidden
                   [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-700"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            // Backdrop blur + glass panel — Apple-iOS sheet feel.
            className="fixed inset-0 top-16 z-30 bg-canvas/80 backdrop-blur-xl md:hidden
                       [.light_&]:bg-white/80"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6"
              aria-label="Mobile primary"
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-lg font-medium text-zinc-200
                             transition-colors duration-300 ease-apple
                             hover:bg-white/5 hover:text-white
                             [.light_&]:text-zinc-800 [.light_&]:hover:bg-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
