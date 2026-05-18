// Seeds reference content (ores, structures, mobs) from minecraft.wiki and
// de.minecraft.wiki using the MediaWiki TextExtracts API.
//
// Slugs stay English so the same URL works in both locales:
//   /en/wiki/auto-diamond-ore   ← fetched from minecraft.wiki ("Diamond Ore")
//   /de/wiki/auto-diamond-ore   ← fetched from de.minecraft.wiki ("Diamanterz")
//
// CC BY-NC-SA 3.0 attribution is baked into each file's frontmatter and
// rendered by the article page. Keep it intact when editing.
//
// Run:
//   npm run fetch:wiki                     (both locales)
//   node scripts/fetch-wiki.mjs --locale=en
//   node scripts/fetch-wiki.mjs --locale=de

import { writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const WIKI_BY_LOCALE = {
  en: { base: 'https://minecraft.wiki', label: 'minecraft.wiki' },
  de: { base: 'https://de.minecraft.wiki', label: 'de.minecraft.wiki' },
};
const USER_AGENT =
  'minewiki-seeder/1.0 (https://minewiki.example.com; non-commercial wiki)';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const AUTO_PREFIX = 'auto-';

const LOCALES_ALL = ['en', 'de'];
const argLocale = process.argv
  .find((a) => a.startsWith('--locale='))
  ?.split('=')[1];
const TARGET_LOCALES = argLocale ? [argLocale] : LOCALES_ALL;

// Seed: each entry has a stable English slug + the page title per locale.
// Titles are passed to the MediaWiki API which resolves redirects, so
// near-matches still hit (e.g. "Geode" → "Amethyst geode").
const SEED = {
  ores: [
    { slug: 'diamond-ore',      en: 'Diamond Ore',      de: 'Diamanterz' },
    { slug: 'iron-ore',         en: 'Iron Ore',         de: 'Eisenerz' },
    { slug: 'coal-ore',         en: 'Coal Ore',         de: 'Kohleerz' },
    { slug: 'gold-ore',         en: 'Gold Ore',         de: 'Golderz' },
    { slug: 'emerald-ore',      en: 'Emerald Ore',      de: 'Smaragderz' },
    { slug: 'redstone-ore',     en: 'Redstone Ore',     de: 'Redstone-Erz' },
    { slug: 'lapis-lazuli-ore', en: 'Lapis Lazuli Ore', de: 'Lapislazulierz' },
    { slug: 'copper-ore',       en: 'Copper Ore',       de: 'Kupfererz' },
    { slug: 'ancient-debris',   en: 'Ancient Debris',   de: 'Antiker Schrott' },
  ],
  structures: [
    { slug: 'mineshaft',        en: 'Mineshaft',       de: 'Mine' },
    { slug: 'stronghold',       en: 'Stronghold',      de: 'Festung' },
    { slug: 'ancient-city',     en: 'Ancient City',    de: 'Antike Stätte' },
    { slug: 'geode',            en: 'Geode',           de: 'Geode' },
    { slug: 'lush-caves',       en: 'Lush Caves',      de: 'Üppige Höhle' },
    { slug: 'dripstone-caves',  en: 'Dripstone Caves', de: 'Tropfsteinhöhle' },
    { slug: 'deep-dark',        en: 'Deep Dark',       de: 'Tiefes Dunkel' },
  ],
  mobs: [
    { slug: 'warden',           en: 'Warden',          de: 'Wächter' },
    { slug: 'drowned',          en: 'Drowned',         de: 'Ertrunkener' },
    { slug: 'glow-squid',       en: 'Glow Squid',      de: 'Leuchttintenfisch' },
    { slug: 'cave-spider',      en: 'Cave Spider',     de: 'Höhlenspinne' },
    { slug: 'silverfish',       en: 'Silverfish',      de: 'Silberfischchen' },
    { slug: 'sculk-shrieker',   en: 'Sculk Shrieker',  de: 'Sculk-Kreischer' },
  ],
};

function makeTurndown(wikiBase) {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  });
  td.remove(['style', 'script', 'sup']);
  td.addRule('absoluteLinks', {
    filter: 'a',
    replacement: (content, node) => {
      const href = node.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return content;
      const abs = href.startsWith('http')
        ? href
        : `${wikiBase}${href.startsWith('/') ? '' : '/'}${href}`;
      return `[${content}](${abs})`;
    },
  });
  td.addRule('absoluteImages', {
    filter: 'img',
    replacement: (_c, node) => {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || '';
      if (!src) return '';
      const abs = src.startsWith('http')
        ? src
        : `${wikiBase}${src.startsWith('/') ? '' : '/'}${src}`;
      return `![${alt}](${abs})`;
    },
  });
  return td;
}

function slugifyKeepAscii(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function yamlString(s) {
  return `"${String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ')
    .trim()}"`;
}

async function fetchJson(url) {
  const r = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function fetchIntro(wikiBase, title) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    titles: title,
    format: 'json',
    formatversion: '2',
    exintro: 'true',
    explaintext: 'false',
    redirects: '1',
  });
  const url = `${wikiBase}/api.php?${params.toString()}`;
  const data = await fetchJson(url);
  const page = data?.query?.pages?.[0];
  if (!page || page.missing) return null;
  const html = page.extract || '';
  if (!html) return null;
  const finalTitle = page.title || title;
  const sourceUrl = `${wikiBase}/w/${encodeURIComponent(finalTitle.replace(/ /g, '_'))}`;
  return { title: finalTitle, html, sourceUrl };
}

async function fetchLeadImage(wikiBase, title) {
  try {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'pageimages',
      titles: title,
      format: 'json',
      formatversion: '2',
      pithumbsize: '600',
      redirects: '1',
    });
    const data = await fetchJson(`${wikiBase}/api.php?${params}`);
    return data?.query?.pages?.[0]?.thumbnail?.source;
  } catch {
    return undefined;
  }
}

function buildFrontmatter({ title, date, category, excerpt, cover, tags, attribution }) {
  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${yamlString(date)}`,
    `category: ${yamlString(category)}`,
    `excerpt: ${yamlString(excerpt)}`,
  ];
  if (cover) lines.push(`cover: ${yamlString(cover)}`);
  if (tags?.length) lines.push(`tags: [${tags.map((t) => yamlString(t)).join(', ')}]`);
  if (attribution) {
    lines.push('attribution:');
    lines.push(`  source: ${yamlString(attribution.source)}`);
    lines.push(`  sourceName: ${yamlString(attribution.sourceName)}`);
    lines.push(`  license: ${yamlString(attribution.license)}`);
  }
  lines.push('_generated: true');
  lines.push('---', '');
  return lines.join('\n');
}

async function clearAutoGenerated(locale, category) {
  const dir = path.join(CONTENT_ROOT, locale, category);
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return;
  }
  await Promise.all(
    files
      .filter((f) => f.startsWith(AUTO_PREFIX) && f.endsWith('.mdx'))
      .map((f) => unlink(path.join(dir, f))),
  );
}

async function processCategoryForLocale(locale, category, seeds) {
  const wiki = WIKI_BY_LOCALE[locale];
  const turndown = makeTurndown(wiki.base);
  const dir = path.join(CONTENT_ROOT, locale, category);
  await mkdir(dir, { recursive: true });
  await clearAutoGenerated(locale, category);

  let written = 0;
  for (const seed of seeds) {
    const title = seed[locale];
    try {
      const intro = await fetchIntro(wiki.base, title);
      if (!intro) {
        console.warn(`  ! [${locale}] ${category}/${title}: not found`);
        continue;
      }
      const cover = await fetchLeadImage(wiki.base, title);
      const md = turndown.turndown(intro.html).trim();
      if (!md) {
        console.warn(`  ! [${locale}] ${category}/${title}: empty extract`);
        continue;
      }

      const excerpt = md
        .replace(/[#>*_`\[\]\(\)]/g, ' ')
        .replace(/\s+/g, ' ')
        .slice(0, 180)
        .trim();

      const fm = buildFrontmatter({
        title: intro.title,
        date: new Date().toISOString().slice(0, 10),
        category,
        excerpt,
        cover,
        tags: [category],
        attribution: {
          source: intro.sourceUrl,
          sourceName: wiki.label,
          license: 'CC BY-NC-SA 3.0',
        },
      });

      // Slug is the English-keyed `seed.slug` so the URL is the same in both locales.
      const filename = `${AUTO_PREFIX}${slugifyKeepAscii(seed.slug)}.mdx`;
      await writeFile(path.join(dir, filename), fm + md + '\n', 'utf8');
      written++;
      // Polite pause — community-run wiki, don't hammer it.
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.warn(`  ! [${locale}] ${category}/${title}: ${e.message}`);
    }
  }
  console.log(`  ✓ [${locale}] ${category}: wrote ${written}/${seeds.length}`);
  return written;
}

async function main() {
  console.log(
    `Seeding reference content from minecraft.wiki (locales: ${TARGET_LOCALES.join(', ')})…\n`,
  );
  try {
    let total = 0;
    for (const locale of TARGET_LOCALES) {
      console.log(`\n=== ${locale.toUpperCase()} ===`);
      for (const [category, seeds] of Object.entries(SEED)) {
        total += await processCategoryForLocale(locale, category, seeds);
      }
    }
    console.log(`\nDone. Total articles: ${total}`);
    console.log('Reminder: minecraft.wiki content is CC BY-NC-SA 3.0. Keep attribution intact.');
  } catch (e) {
    console.error(`\n! Seed failed: ${e.message}`);
    process.exit(0);
  }
}

main();
