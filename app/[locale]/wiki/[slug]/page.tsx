import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getAdjacent,
  getAllArticles,
  getArticleBySlug,
} from '@/lib/content';
import {
  CATEGORY_LABEL_I18N,
  LOCALES,
  isLocale,
  t,
  type Locale,
} from '@/lib/i18n';
import { mdxComponents } from '@/components/MDXComponents';
import { PageTransition } from '@/components/PageTransition';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// SSG: prerender every (locale, slug) pair.
export async function generateStaticParams() {
  const all = await Promise.all(
    LOCALES.map(async (locale) => {
      const articles = await getAllArticles(locale);
      return articles.map((a) => ({ locale, slug: a.slug }));
    }),
  );
  return all.flat();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw;
  const article = await getArticleBySlug(locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/${locale}/wiki/${article.slug}`,
      languages: {
        en: `/en/wiki/${article.slug}`,
        de: `/de/wiki/${article.slug}`,
        'x-default': `/en/wiki/${article.slug}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      tags: article.tags,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

/**
 * Pulls top-level headings from raw MDX so we can render a sticky TOC.
 * Lightweight regex over the source — no extra MDX pass needed.
 */
function extractHeadings(source: string): { id: string; text: string; level: 2 | 3 }[] {
  const lines = source.split('\n');
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('```')) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length === 2 ? 2 : 3;
    const text = m[2].replace(/[#*`_]/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    out.push({ id, text, level });
  }
  return out;
}

export default async function WikiArticlePage({ params }: PageProps) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  const article = await getArticleBySlug(locale, slug);
  if (!article) notFound();

  const { prev, next } = await getAdjacent(locale, slug);
  const headings = extractHeadings(article.body);

  return (
    <PageTransition>
      <article className="mx-auto max-w-7xl px-6 pt-12 pb-24 md:px-10 md:pt-16">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400
                     transition-colors duration-300 ease-apple hover:text-white
                     [.light_&]:text-zinc-600 [.light_&]:hover:text-zinc-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t(locale, 'article.back')}
        </Link>

        <header className="mt-8 max-w-3xl">
          <span className="chip">{CATEGORY_LABEL_I18N[locale][article.category]}</span>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tightest text-white
                         md:text-5xl [.light_&]:text-zinc-900">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-zinc-400 [.light_&]:text-zinc-600">
              {article.excerpt}
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </span>
            {article.tags && article.tags.length > 0 && (
              <span className="flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag} className="chip">#{tag}</span>
                ))}
              </span>
            )}
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
          <div
            className="prose prose-invert prose-wiki max-w-none
                       prose-headings:tracking-tight prose-headings:font-semibold
                       prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-2xl prose-img:border prose-img:border-white/10
                       [.light_&]:prose"
          >
            <MDXRemote source={article.body} components={mdxComponents} />

            {article.attribution && (
              <aside
                className="not-prose mt-12 rounded-2xl border border-white/10 bg-white/[0.03]
                           p-5 text-sm text-zinc-400 backdrop-blur-md
                           [.light_&]:border-zinc-200 [.light_&]:bg-zinc-50 [.light_&]:text-zinc-600"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  {t(locale, 'article.attribution')}
                </p>
                <p className="mt-2 leading-relaxed">
                  {t(locale, 'article.attributionPrefix')}{' '}
                  <a
                    href={article.attribution.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    {article.attribution.sourceName ?? 'source'}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                  , {t(locale, 'article.attributionLicensed')} {article.attribution.license}.
                </p>
              </aside>
            )}
          </div>

          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
                  {t(locale, 'article.toc')}
                </p>
                <ul className="space-y-2 border-l border-white/10 [.light_&]:border-zinc-200">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'pl-6' : 'pl-3'}>
                      <a
                        href={`#${h.id}`}
                        className="block text-sm text-zinc-400 transition-colors duration-200
                                   hover:text-white [.light_&]:text-zinc-600 [.light_&]:hover:text-zinc-900"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>

        {(prev || next) && (
          <nav
            aria-label={t(locale, 'article.aria.nav')}
            className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/${locale}/wiki/${prev.slug}`}
                className="glass group flex flex-col items-start gap-1 rounded-2xl p-5
                           transition-transform duration-300 ease-apple hover:scale-[1.01]"
              >
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                  <ArrowLeft className="h-3 w-3" /> {t(locale, 'article.older')}
                </span>
                <span className="font-medium text-white group-hover:text-accent
                                 [.light_&]:text-zinc-900">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${locale}/wiki/${next.slug}`}
                className="glass group flex flex-col items-end gap-1 rounded-2xl p-5 text-right
                           transition-transform duration-300 ease-apple hover:scale-[1.01]"
              >
                <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                  {t(locale, 'article.newer')} <ArrowRight className="h-3 w-3" />
                </span>
                <span className="font-medium text-white group-hover:text-accent
                                 [.light_&]:text-zinc-900">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </PageTransition>
  );
}
