'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ArticleMeta } from '@/lib/content-types';
import { CATEGORY_LABEL_I18N, type Locale } from '@/lib/i18n';
import { formatDate } from '@/lib/utils';

interface SectionCardProps {
  locale: Locale;
  article: ArticleMeta;
  index?: number;
}

export function SectionCard({ locale, article, index = 0 }: SectionCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
        delay: Math.min(index * 0.05, 0.3),
      }}
      whileHover={{ scale: 1.015 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      <Link href={`/${locale}/wiki/${article.slug}`} className="block">
        <div
          className="glass relative h-full overflow-hidden rounded-3xl p-6
                     transition-shadow duration-500 ease-apple
                     group-hover:shadow-glow"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full
                       bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500
                       group-hover:opacity-100"
          />

          <div className="flex items-center justify-between">
            <span className="chip">{CATEGORY_LABEL_I18N[locale][article.category]}</span>
            <ArrowUpRight
              className="h-4 w-4 text-zinc-500 transition-all duration-300 ease-apple
                         group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              aria-hidden
            />
          </div>

          <h3 className="mt-5 text-xl font-semibold tracking-tight text-white
                         [.light_&]:text-zinc-900">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400
                          [.light_&]:text-zinc-600">
              {article.excerpt}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-1.5">
                {article.tags.slice(0, 2).map((tg) => (
                  <span key={tg} className="text-zinc-500">
                    #{tg}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
