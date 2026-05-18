// Pure types & constants — safe to import from Client Components.
// Keep this file free of `node:*` imports so webpack doesn't try to bundle fs into the browser.

export type Category =
  | 'news'
  | 'tips'
  | 'sneakpeeks'
  | 'ores'
  | 'structures'
  | 'mobs';

export interface Attribution {
  /** Source URL (e.g. minecraft.wiki article) */
  source: string;
  /** Human-readable license name (e.g. "CC BY-NC-SA 3.0") */
  license: string;
  /** Optional display name for the source ("minecraft.wiki") */
  sourceName?: string;
}

export interface ArticleFrontmatter {
  title: string;
  date: string; // ISO 8601
  category: Category;
  excerpt: string;
  cover?: string;
  tags?: string[];
  attribution?: Attribution;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  body: string; // raw MDX source
}

export interface ArticleMeta extends ArticleFrontmatter {
  slug: string;
}

// CATEGORY labels & descriptions are translated — see lib/i18n.ts (CATEGORY_LABEL_I18N).
// We keep an English-only fallback here for any non-localised consumers.
export const CATEGORY_LABEL: Record<Category, string> = {
  news: 'News',
  tips: 'Tips & Tricks',
  sneakpeeks: 'Sneak Peeks',
  ores: 'Ores',
  structures: 'Structures',
  mobs: 'Mobs',
};

export const CATEGORY_DESCRIPTION: Record<Category, string> = {
  news: 'Patch notes, releases, and announcements.',
  tips: 'Strategies, redstone, builds, and survival know-how.',
  sneakpeeks: 'Snapshots, leaks, and a glimpse at upcoming features.',
  ores: 'Diamond, iron, copper, ancient debris — what to mine, where to find it.',
  structures: 'Mineshafts, strongholds, ancient cities, and the cave biomes themselves.',
  mobs: 'Wardens, drowned, sculk — the inhabitants of the deep.',
};
