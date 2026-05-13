// Seeds reference content (ores, structures, mobs) from minecraft.wiki
// using the MediaWiki TextExtracts API (intro section only, clean HTML).
//
// Result is meant as a starting point — a human edits/extends the .mdx files
// afterward. Each generated article carries an attribution footer per the
// wiki's CC BY-NC-SA 3.0 license; never strip it.
//
// Run:  npm run fetch:wiki
//
// Re-running OVERWRITES auto-generated files (prefix `auto-`) but never
// touches hand-authored ones.

import { writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';

const WIKI_BASE = 'https://minecraft.wiki';
const API = `${WIKI_BASE}/api.php`;
const USER_AGENT = 'minewiki-seeder/1.0 (https://minewiki.example.com; non-commercial wiki)';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const AUTO_PREFIX = 'auto-';

// Mapping of page titles → our category. MediaWiki resolves redirects
// (`redirects=1`) so close-but-not-exact titles still hit.
const SEED = {
  ores: [
    'Diamond Ore',
    'Iron Ore',
    'Coal Ore',
    'Gold Ore',
    'Emerald Ore',
    'Redstone Ore',
    'Lapis Lazuli Ore',
    'Copper Ore',
    'Ancient Debris',
  ],
  structures: [
    'Mineshaft',
    'Stronghold',
    'Ancient City',
    'Geode',
    'Lush Caves',
    'Dripstone Caves',
    'Deep Dark',
  ],
  mobs: [
    'Warden',
    'Drowned',
    'Glow Squid',
    'Cave Spider',
    'Silverfish',
    'Sculk Shrieker',
  ],
};

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});
turndown.remove(['style', 'script', 'sup']); // sup = ref markers
turndown.addRule('absoluteLinks', {
  filter: 'a',
  replacement: (content, node) => {
    const href = node.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return content;
    const abs = href.startsWith('http')
      ? href
      : `${WIKI_BASE}${href.startsWith('/') ? '' : '/'}${href}`;
    return `[${content}](${abs})`;
  },
});
turndown.addRule('absoluteImages', {
  filter: 'img',
  replacement: (_c, node) => {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';
    if (!src) return '';
    const abs = src.startsWith('http')
      ? src
      : `${WIKI_BASE}${src.startsWith('/') ? '' : '/'}${src}`;
    return `![${alt}](${abs})`;
  },
});

function slugify(s) {
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

/**
 * Fetches the intro section HTML of a MediaWiki page.
 * Returns { title, html, sourceUrl } or null on failure.
 */
async function fetchIntro(title) {
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
  const url = `${API}?${params.toString()}`;
  const data = await fetchJson(url);
  const page = data?.query?.pages?.[0];
  if (!page || page.missing) return null;

  const html = page.extract || '';
  if (!html) return null;

  const finalTitle = page.title || title;
  // Build the public canonical URL for attribution.
  const sourceUrl = `${WIKI_BASE}/w/${encodeURIComponent(finalTitle.replace(/ /g, '_'))}`;
  return { title: finalTitle, html, sourceUrl };
}

/**
 * Tries to grab a page's lead image via pageprops.pageimage.
 */
async function fetchLeadImage(title) {
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
    const data = await fetchJson(`${API}?${params}`);
    return data?.query?.pages?.[0]?.thumbnail?.source;
  } catch {
    return undefined;
  }
}

function buildFrontmatter({
  title,
  date,
  category,
  excerpt,
  cover,
  tags,
  attribution,
}) {
  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `date: ${yamlString(date)}`,
    `category: ${yamlString(category)}`,
    `excerpt: ${yamlString(excerpt)}`,
  ];
  if (cover) lines.push(`cover: ${yamlString(cover)}`);
  if (tags?.length) {
    lines.push(`tags: [${tags.map((t) => yamlString(t)).join(', ')}]`);
  }
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

async function clearAutoGenerated(category) {
  const dir = path.join(CONTENT_ROOT, category);
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

async function processCategory(category, titles) {
  const dir = path.join(CONTENT_ROOT, category);
  await mkdir(dir, { recursive: true });
  await clearAutoGenerated(category);

  let written = 0;
  for (const title of titles) {
    try {
      const intro = await fetchIntro(title);
      if (!intro) {
        console.warn(`  ! ${category}/${title}: page not found`);
        continue;
      }
      const cover = await fetchLeadImage(title);
      const md = turndown.turndown(intro.html).trim();
      if (!md) {
        console.warn(`  ! ${category}/${title}: empty extract`);
        continue;
      }

      const slug = slugify(intro.title);
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
          sourceName: 'minecraft.wiki',
          license: 'CC BY-NC-SA 3.0',
        },
      });

      const filename = `${AUTO_PREFIX}${slug}.mdx`;
      await writeFile(path.join(dir, filename), fm + md + '\n', 'utf8');
      written++;
      // Polite pause between requests — minecraft.wiki is community-run.
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.warn(`  ! ${category}/${title}: ${e.message}`);
    }
  }
  console.log(`  ✓ ${category}: wrote ${written}/${titles.length}`);
  return written;
}

async function main() {
  console.log('Seeding reference content from minecraft.wiki…\n');
  try {
    let total = 0;
    for (const [category, titles] of Object.entries(SEED)) {
      console.log(`→ ${category}`);
      total += await processCategory(category, titles);
    }
    console.log(`\nDone. Total articles: ${total}`);
    console.log(
      'Reminder: content from minecraft.wiki is CC BY-NC-SA 3.0.',
    );
    console.log('Keep the attribution block intact when editing.');
  } catch (e) {
    console.error(`\n! Seed failed: ${e.message}`);
    process.exit(0);
  }
}

main();
