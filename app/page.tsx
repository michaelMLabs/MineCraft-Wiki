import { Suspense } from 'react';
import {
  CATEGORY_DESCRIPTION,
  CATEGORY_LABEL,
  getAllArticles,
  type Category,
} from '@/lib/content';
import { SectionCard } from '@/components/SectionCard';
import { LandingHero } from './landing-hero';
import { PageTransition } from '@/components/PageTransition';

// Display order on the home page. Reference categories sit between the
// time-based feeds (News on top, Tips at the bottom for "go learn more").
const CATEGORIES: Category[] = [
  'news',
  'sneakpeeks',
  'ores',
  'structures',
  'mobs',
  'tips',
];

export default async function HomePage() {
  const articles = await getAllArticles();
  const grouped = CATEGORIES.map((c) => ({
    id: c,
    label: CATEGORY_LABEL[c],
    description: CATEGORY_DESCRIPTION[c],
    items: articles.filter((a) => a.category === c).slice(0, 6),
  }));

  return (
    <PageTransition>
      <LandingHero />

      <div id="sections" className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        {grouped.map((group) => (
          <section
            key={group.id}
            id={`section-${group.id}`}
            className="mt-20 scroll-mt-24 first:mt-0"
          >
            <header className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tightest text-white md:text-4xl
                               [.light_&]:text-zinc-900">
                  {group.label}
                </h2>
                <p className="mt-2 text-sm text-zinc-400 md:text-base [.light_&]:text-zinc-600">
                  {group.description}
                </p>
              </div>
            </header>

            {group.items.length === 0 ? (
              <p className="text-sm text-zinc-500">No articles yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((article, i) => (
                  <Suspense key={article.slug}>
                    <SectionCard
                      article={{
                        slug: article.slug,
                        title: article.title,
                        date: article.date,
                        category: article.category,
                        excerpt: article.excerpt,
                        cover: article.cover,
                        tags: article.tags,
                      }}
                      index={i}
                    />
                  </Suspense>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
