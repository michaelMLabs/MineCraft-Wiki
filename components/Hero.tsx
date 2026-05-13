'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onSearch: () => void;
}

export function Hero({ onSearch }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Layered gradient backdrop — Apple uses these subtle washes to add depth without noise. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 text-center md:px-10 md:pt-32 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5
                     px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md
                     [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-700"
        >
          <Sparkles className="h-3 w-3 text-accent" aria-hidden />
          Updated for the latest snapshot
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.05 }}
          className="h-display mt-6 text-balance text-white [.light_&]:text-zinc-900"
        >
          The Minecraft wiki,
          <br />
          <span className="bg-gradient-to-r from-accent to-emerald-300 bg-clip-text text-transparent">
            built like an app.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400
                     md:text-lg [.light_&]:text-zinc-600"
        >
          News, tips, and sneak peeks for builders, redstoners, and adventurers.
          Refined, fast, and quietly opinionated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onSearch}
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-white px-6
                       text-sm font-semibold text-black shadow-glass
                       transition-transform duration-300 ease-apple hover:scale-[1.02]"
          >
            Search the wiki
            <kbd
              className="rounded-md border border-black/10 bg-black/5 px-1.5 py-0.5 text-[11px]
                         font-medium text-zinc-700"
            >
              ⌘K
            </kbd>
          </button>

          <a
            href="#sections"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/15
                       bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-md
                       transition-colors duration-300 ease-apple hover:bg-white/10
                       [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-900 [.light_&]:hover:bg-zinc-100"
          >
            Browse sections
          </a>
        </motion.div>
      </div>
    </section>
  );
}
