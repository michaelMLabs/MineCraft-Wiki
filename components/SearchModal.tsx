'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import type { ArticleMeta, Category } from '@/lib/content-types';
import { CATEGORY_LABEL_I18N, t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  locale: Locale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index: ArticleMeta[];
}

export function SearchModal({ locale, open, onOpenChange, index }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const labels = CATEGORY_LABEL_I18N[locale];
  const FILTERS: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: t(locale, 'search.filter.all') },
    { id: 'news', label: labels.news },
    { id: 'sneakpeeks', label: labels.sneakpeeks },
    { id: 'ores', label: labels.ores },
    { id: 'structures', label: labels.structures },
    { id: 'mobs', label: labels.mobs },
    { id: 'tips', label: labels.tips },
  ];

  // Fuse instance built once per index.
  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'excerpt', weight: 0.25 },
          { name: 'tags', weight: 0.15 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  const results = useMemo(() => {
    const pool = filter === 'all' ? index : index.filter((a) => a.category === filter);
    if (!query.trim()) return pool.slice(0, 8);
    const subset = filter === 'all' ? index : pool;
    const fuseLocal =
      filter === 'all'
        ? fuse
        : new Fuse(subset, {
            keys: [
              { name: 'title', weight: 0.6 },
              { name: 'excerpt', weight: 0.25 },
              { name: 'tags', weight: 0.15 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
          });
    return fuseLocal.search(query).slice(0, 8).map((r) => r.item);
  }, [query, filter, index, fuse]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        const target = results[activeIdx];
        if (target) {
          onOpenChange(false);
          router.push(`/${locale}/wiki/${target.slug}`);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIdx, onOpenChange, router, locale]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-md"
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, 'search.aria')}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-2xl overflow-hidden rounded-3xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4
                            [.light_&]:border-zinc-200">
              <SearchIcon className="h-4 w-4 text-zinc-400" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                placeholder={t(locale, 'search.placeholder')}
                className="flex-1 bg-transparent text-base text-white placeholder:text-zinc-500
                           outline-none focus:outline-none
                           [.light_&]:text-zinc-900 [.light_&]:placeholder:text-zinc-400"
                type="search"
                aria-label={t(locale, 'search.queryAria')}
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label={t(locale, 'search.close')}
                className="rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white
                           [.light_&]:hover:bg-zinc-100 [.light_&]:hover:text-zinc-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-white/10 px-5 py-3
                            [.light_&]:border-zinc-200">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilter(f.id);
                    setActiveIdx(0);
                  }}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors duration-300 ease-apple',
                    filter === f.id
                      ? 'bg-accent text-black'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 [.light_&]:bg-zinc-100 [.light_&]:text-zinc-700',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox" aria-label={t(locale, 'search.resultsAria')}>
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-zinc-400">
                  {t(locale, 'search.noResults')}
                </li>
              )}
              {results.map((r, i) => (
                <li key={r.slug} role="option" aria-selected={i === activeIdx}>
                  <Link
                    href={`/${locale}/wiki/${r.slug}`}
                    onClick={() => onOpenChange(false)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={cn(
                      'flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors duration-200',
                      i === activeIdx
                        ? 'bg-white/8 text-white [.light_&]:bg-zinc-100'
                        : 'text-zinc-300 hover:bg-white/5 [.light_&]:text-zinc-700 [.light_&]:hover:bg-zinc-50',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="chip">{labels[r.category]}</span>
                        <span className="truncate text-sm font-medium">{r.title}</span>
                      </div>
                      {r.excerpt && (
                        <p className="mt-1 truncate text-xs text-zinc-400">{r.excerpt}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] text-zinc-500
                            [.light_&]:border-zinc-200">
              <span>
                <kbd className="mr-1 rounded border border-white/10 bg-white/5 px-1 py-0.5 [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100">↑↓</kbd>
                {t(locale, 'search.kbd.navigate')}
              </span>
              <span>
                <kbd className="mr-1 rounded border border-white/10 bg-white/5 px-1 py-0.5 [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100">↵</kbd>
                {t(locale, 'search.kbd.open')}
              </span>
              <span>
                <kbd className="mr-1 rounded border border-white/10 bg-white/5 px-1 py-0.5 [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100">esc</kbd>
                {t(locale, 'search.kbd.close')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
