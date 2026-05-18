// Tiny LibreTranslate client with on-disk cache, global serialisation,
// and multi-instance fallback.
//
// Why a cache: public instances are slow and rate-limited. We hash source
// text and skip identical re-translations forever (.cache/translations.json).
//
// Why a global queue: public instances rate-limit aggressively. We send ONE
// request at a time across the whole script, with a throttle in between.
//
// Failure mode: on total failure we return the source unchanged so the build
// never breaks.

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'translations.json');

const INSTANCES = [
  'https://translate.disroot.org',
  'https://lt.vern.cc',
  'https://translate.argosopentech.com',
  'https://translate.terraprint.co',
];

const REQUEST_TIMEOUT_MS = 60_000;
const THROTTLE_MS = 1500;        // between any two requests, anywhere
const MAX_CHUNK_CHARS = 3500;    // most public instances cap around 5000
const MAX_TOTAL_CHARS = 20_000;  // anything bigger and we give up to save time
const BACKOFF_MS = 5000;         // after a failure on one instance

let cache = null;
let cacheDirty = false;
let saveTimer = null;

async function loadCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(await readFile(CACHE_FILE, 'utf8'));
  } catch {
    cache = {};
  }
  return cache;
}

function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(async () => {
    saveTimer = null;
    if (!cacheDirty) return;
    cacheDirty = false;
    try {
      await mkdir(CACHE_DIR, { recursive: true });
      await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    } catch (e) {
      console.warn(`  ! translation cache save failed: ${e.message}`);
    }
  }, 500);
}

export async function flushTranslationCache() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (!cacheDirty || !cache) return;
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    cacheDirty = false;
  } catch (e) {
    console.warn(`  ! translation cache flush failed: ${e.message}`);
  }
}

function cacheKey(text, source, target, format) {
  const h = createHash('sha1').update(text).digest('hex');
  return `${source}_${target}_${format}_${h}`;
}

// ---- global request queue ------------------------------------------------

let queueTail = Promise.resolve();
let lastRequestAt = 0;
// Per-instance failure tracking; skipped for a while after a rate-limit.
const instanceCooldownUntil = new Map();

async function throttledFetch(url, init) {
  // Serialize across the whole process and pace requests.
  const slot = queueTail.then(async () => {
    const since = Date.now() - lastRequestAt;
    if (since < THROTTLE_MS) {
      await new Promise((r) => setTimeout(r, THROTTLE_MS - since));
    }
    lastRequestAt = Date.now();
    return fetch(url, init);
  });
  queueTail = slot.then(
    () => undefined,
    () => undefined,
  );
  return slot;
}

async function translateOnce(instance, text, source, target, format) {
  const res = await throttledFetch(`${instance}/translate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: text, source, target, format }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (res.status === 429 || res.status === 403) {
    instanceCooldownUntil.set(instance, Date.now() + 5 * 60_000); // 5 min cooldown
    throw new Error(`HTTP ${res.status} (rate-limited)`);
  }
  if (!res.ok) {
    instanceCooldownUntil.set(instance, Date.now() + 60_000);
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data || typeof data.translatedText !== 'string') {
    throw new Error('malformed response');
  }
  return data.translatedText;
}

// ---- chunking ------------------------------------------------------------

// Split HTML on a generous set of block-closing tags. Falls back to plain-text
// sentence splitting when no tags are present at all.
function chunkHtml(html, maxLen) {
  if (html.length <= maxLen) return [html];

  const tagRe = /(<\/(?:p|li|div|h[1-6]|tr|td|th|section|article|blockquote|ul|ol|table)>)/gi;
  const parts = html.split(tagRe);
  const chunks = [];
  let cur = '';
  for (const part of parts) {
    if (!part) continue;
    if ((cur + part).length > maxLen && cur) {
      chunks.push(cur);
      cur = part;
    } else {
      cur += part;
    }
  }
  if (cur) chunks.push(cur);

  // If a single chunk is still too big (rare — pathological HTML), hard-cut.
  const out = [];
  for (const c of chunks) {
    if (c.length <= maxLen) {
      out.push(c);
    } else {
      for (let i = 0; i < c.length; i += maxLen) {
        out.push(c.slice(i, i + maxLen));
      }
    }
  }
  return out;
}

function chunkText(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const parts = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + p).length > maxLen && cur) {
      chunks.push(cur);
      cur = p + ' ';
    } else {
      cur += p + ' ';
    }
  }
  if (cur.trim()) chunks.push(cur);
  return chunks;
}

// ---- public API ----------------------------------------------------------

/**
 * Translate a piece of text/HTML. Returns the source unchanged on failure.
 *
 * Refuses to translate inputs over `MAX_TOTAL_CHARS` and returns null in that
 * case — caller should fall back gracefully (e.g. show source with a notice).
 */
export async function translate(
  text,
  { source = 'en', target = 'de', format = 'text', maxChars = MAX_TOTAL_CHARS } = {},
) {
  if (!text || !text.trim()) return text;
  if (source === target) return text;
  if (text.length > maxChars) return null;

  await loadCache();
  const key = cacheKey(text, source, target, format);
  if (cache[key]) return cache[key];

  const chunker = format === 'html' ? chunkHtml : chunkText;
  const chunks = chunker(text, MAX_CHUNK_CHARS);
  const translated = [];
  let anyChunkSucceeded = false;

  for (const chunk of chunks) {
    let result = null;
    for (const instance of INSTANCES) {
      const cooldown = instanceCooldownUntil.get(instance) ?? 0;
      if (cooldown > Date.now()) continue;
      try {
        result = await translateOnce(instance, chunk, source, target, format);
        break;
      } catch {
        // Try next instance; cooldown was set inside translateOnce on bad status.
      }
    }
    if (result === null) {
      await new Promise((r) => setTimeout(r, BACKOFF_MS));
      for (const instance of INSTANCES) {
        const cooldown = instanceCooldownUntil.get(instance) ?? 0;
        if (cooldown > Date.now()) continue;
        try {
          result = await translateOnce(instance, chunk, source, target, format);
          break;
        } catch {
          // give up on this chunk
        }
      }
    }
    if (result === null || result.trim() === chunk.trim()) {
      // Translation effectively failed for this chunk — keep the source so
      // the caller gets partial output, but don't poison the cache.
      result = chunk;
    } else {
      anyChunkSucceeded = true;
    }
    translated.push(result);
  }

  const full = translated.join('');
  // Only cache results that genuinely changed (i.e. translation worked
  // for at least one chunk). This prevents a flaky upstream from
  // permanently caching the English source as the "German" version.
  if (anyChunkSucceeded) {
    cache[key] = full;
    cacheDirty = true;
    scheduleSave();
  }
  return full;
}

/** True if every chunk was returned untouched (i.e. translation effectively failed). */
export function looksUntranslated(original, translated) {
  if (!translated) return true;
  // Cheap heuristic: identical strings → translation didn't do anything.
  return original.trim() === translated.trim();
}
