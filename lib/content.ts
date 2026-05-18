import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {
  CATEGORY_LABEL,
  type Article,
  type ArticleMeta,
  type Category,
} from './content-types';
import { DEFAULT_LOCALE, type Locale } from './i18n';

// Re-export for convenience.
export {
  CATEGORY_LABEL,
  CATEGORY_DESCRIPTION,
  type Article,
  type ArticleMeta,
  type ArticleFrontmatter,
  type Category,
  type Attribution,
} from './content-types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function localeRoot(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale);
}

async function readCategory(locale: Locale, category: Category): Promise<Article[]> {
  const dir = path.join(localeRoot(locale), category);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const mdx = files.filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  const parsed = await Promise.all(
    mdx.map(async (filename) => {
      const fullPath = path.join(dir, filename);
      const raw = await fs.readFile(fullPath, 'utf8');
      const { data, content } = matter(raw);
      const slug = filename.replace(/\.mdx?$/, '');

      const attribution =
        data.attribution && typeof data.attribution === 'object'
          ? {
              source: String((data.attribution as Record<string, unknown>).source ?? ''),
              license: String((data.attribution as Record<string, unknown>).license ?? ''),
              sourceName: (data.attribution as Record<string, unknown>).sourceName
                ? String((data.attribution as Record<string, unknown>).sourceName)
                : undefined,
            }
          : undefined;

      return {
        slug,
        body: content,
        title: String(data.title ?? slug),
        date: String(data.date ?? new Date().toISOString()),
        category,
        excerpt: String(data.excerpt ?? ''),
        cover: data.cover ? String(data.cover) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        attribution: attribution?.source ? attribution : undefined,
      } satisfies Article;
    }),
  );

  return parsed;
}

export async function getAllArticles(locale: Locale = DEFAULT_LOCALE): Promise<Article[]> {
  const all = await Promise.all(
    (Object.keys(CATEGORY_LABEL) as Category[]).map((c) => readCategory(locale, c)),
  );
  return all.flat().sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getArticlesByCategory(
  locale: Locale,
  category: Category,
): Promise<Article[]> {
  return readCategory(locale, category).then((arr) =>
    arr.sort((a, b) => +new Date(b.date) - +new Date(a.date)),
  );
}

export async function getArticleBySlug(
  locale: Locale,
  slug: string,
): Promise<Article | null> {
  const all = await getAllArticles(locale);
  return all.find((a) => a.slug === slug) ?? null;
}

/**
 * Lightweight metadata list — used by the search modal.
 * The body is stripped to keep the client bundle small.
 */
export async function getSearchIndex(locale: Locale = DEFAULT_LOCALE): Promise<ArticleMeta[]> {
  const all = await getAllArticles(locale);
  return all.map(({ body: _omit, ...meta }) => meta);
}

export async function getAdjacent(
  locale: Locale,
  slug: string,
): Promise<{ prev: ArticleMeta | null; next: ArticleMeta | null }> {
  const all = await getAllArticles(locale);
  const idx = all.findIndex((a) => a.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  const toMeta = (a: Article | undefined): ArticleMeta | null => {
    if (!a) return null;
    const { body: _omit, ...meta } = a;
    return meta;
  };
  return {
    // Newer-first sort means index-1 is "next" (newer) and index+1 is "prev" (older).
    next: toMeta(all[idx - 1]),
    prev: toMeta(all[idx + 1]),
  };
}
