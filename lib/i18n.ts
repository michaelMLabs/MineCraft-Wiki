// Tiny in-house i18n — no library needed for ~50 strings.
// Pass `dict(locale)` to components; for nested values use the typed helpers below.

import type { Category } from './content-types';

export type Locale = 'en' | 'de';
export const LOCALES: Locale[] = ['en', 'de'];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  de: 'DE',
};
export const LOCALE_LONG: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
};

// Per-locale category labels & descriptions. Live here (not content-types)
// because they ARE translations.
export const CATEGORY_LABEL_I18N: Record<Locale, Record<Category, string>> = {
  en: {
    news: 'News',
    tips: 'Tips & Tricks',
    sneakpeeks: 'Sneak Peeks',
    ores: 'Ores',
    structures: 'Structures',
    mobs: 'Mobs',
  },
  de: {
    news: 'Neuigkeiten',
    tips: 'Tipps & Tricks',
    sneakpeeks: 'Snapshots',
    ores: 'Erze',
    structures: 'Strukturen',
    mobs: 'Mobs',
  },
};

export const CATEGORY_DESCRIPTION_I18N: Record<Locale, Record<Category, string>> = {
  en: {
    news: 'Patch notes, releases, and announcements.',
    tips: 'Strategies, redstone, builds, and survival know-how.',
    sneakpeeks: 'Snapshots, leaks, and a glimpse at upcoming features.',
    ores: 'Diamond, iron, copper, ancient debris — what to mine, where to find it.',
    structures: 'Mineshafts, strongholds, ancient cities, and the cave biomes themselves.',
    mobs: 'Wardens, drowned, sculk — the inhabitants of the deep.',
  },
  de: {
    news: 'Patch Notes, Releases und Ankündigungen.',
    tips: 'Strategien, Redstone, Bauten und Survival-Know-how.',
    sneakpeeks: 'Snapshots, Leaks und ein Blick auf kommende Features.',
    ores: 'Diamant, Eisen, Kupfer, Alter Schutt — was du abbauen kannst und wo es liegt.',
    structures: 'Minen, Festungen, Antike Städte und die Höhlen-Biome selbst.',
    mobs: 'Wächter, Ertrunkene, Sculk — die Bewohner der Tiefe.',
  },
};

// Flat UI dictionary. Add keys as you need them; missing keys fall back to EN.
export const UI = {
  en: {
    'nav.news': 'News',
    'nav.snapshots': 'Snapshots',
    'nav.ores': 'Ores',
    'nav.structures': 'Structures',
    'nav.mobs': 'Mobs',
    'nav.tips': 'Tips',
    'nav.servers': 'Servers',
    'nav.aria.primary': 'Primary',
    'nav.aria.mobilePrimary': 'Mobile primary',
    'nav.aria.footer': 'Footer',
    'header.search': 'Search',
    'header.searchAria': 'Open search',
    'header.menuOpen': 'Open menu',
    'header.menuClose': 'Close menu',
    'header.themeToDark': 'Switch to dark theme',
    'header.themeToLight': 'Switch to light theme',
    'header.langAria': 'Change language',
    'hero.badge': 'Updated for the latest snapshot',
    'hero.title1': 'The Minecraft wiki,',
    'hero.title2': 'built like an app.',
    'hero.subtitle':
      'News, tips, and sneak peeks for builders, redstoners, and adventurers. Refined, fast, and quietly opinionated.',
    'hero.cta.search': 'Search the wiki',
    'hero.cta.browse': 'Browse sections',
    'search.placeholder': 'Search articles, tips, snapshots…',
    'search.aria': 'Search',
    'search.queryAria': 'Search query',
    'search.close': 'Close search',
    'search.resultsAria': 'Search results',
    'search.noResults': 'No results. Try a different query.',
    'search.filter.all': 'All',
    'search.kbd.navigate': 'navigate',
    'search.kbd.open': 'open',
    'search.kbd.close': 'close',
    'home.noArticles': 'No articles yet — check back soon.',
    'servers.title': 'Top 15 Java Servers',
    'servers.description': 'The most-played public servers right now. Live status checked every few minutes.',
    'servers.copyIp': 'Copy IP',
    'servers.copied': 'Copied!',
    'servers.online': 'Online',
    'servers.offline': 'Offline',
    'servers.unknown': 'Checking…',
    'servers.players': '{online}/{max} players',
    'servers.version': 'Version',
    'servers.website': 'Website',
    'servers.rank': '#{rank}',
    'article.back': 'Back to home',
    'article.toc': 'On this page',
    'article.older': 'Older',
    'article.newer': 'Newer',
    'article.aria.nav': 'Article navigation',
    'article.attribution': 'Attribution',
    'article.attributionPrefix': 'Adapted from',
    'article.attributionLicensed': 'licensed under',
    'notfound.eyebrow': '404',
    'notfound.title': 'That biome doesn’t exist.',
    'notfound.subtitle':
      'The page you’re looking for has been mined out, or maybe it never spawned.',
    'notfound.cta': 'Return home',
    'footer.home': 'Home',
    'footer.disclaimer':
      'Not affiliated with Mojang or Microsoft. © {year} MineWiki.',
    'skipLink': 'Skip to content',
  },
  de: {
    'nav.news': 'Neuigkeiten',
    'nav.snapshots': 'Snapshots',
    'nav.ores': 'Erze',
    'nav.structures': 'Strukturen',
    'nav.mobs': 'Mobs',
    'nav.tips': 'Tipps',
    'nav.servers': 'Server',
    'nav.aria.primary': 'Hauptnavigation',
    'nav.aria.mobilePrimary': 'Mobile Hauptnavigation',
    'nav.aria.footer': 'Fußzeile',
    'header.search': 'Suche',
    'header.searchAria': 'Suche öffnen',
    'header.menuOpen': 'Menü öffnen',
    'header.menuClose': 'Menü schließen',
    'header.themeToDark': 'Auf dunkles Theme wechseln',
    'header.themeToLight': 'Auf helles Theme wechseln',
    'header.langAria': 'Sprache wechseln',
    'hero.badge': 'Aktuell zum neuesten Snapshot',
    'hero.title1': 'Das Minecraft-Wiki,',
    'hero.title2': 'gebaut wie eine App.',
    'hero.subtitle':
      'Neuigkeiten, Tipps und Snapshots für Baumeister, Redstoner und Abenteurer. Fein, schnell und mit Haltung.',
    'hero.cta.search': 'Wiki durchsuchen',
    'hero.cta.browse': 'Bereiche entdecken',
    'search.placeholder': 'Artikel, Tipps, Snapshots suchen…',
    'search.aria': 'Suche',
    'search.queryAria': 'Suchbegriff',
    'search.close': 'Suche schließen',
    'search.resultsAria': 'Suchergebnisse',
    'search.noResults': 'Keine Treffer. Versuche eine andere Suche.',
    'search.filter.all': 'Alle',
    'search.kbd.navigate': 'navigieren',
    'search.kbd.open': 'öffnen',
    'search.kbd.close': 'schließen',
    'home.noArticles': 'Noch keine Artikel — schau bald wieder vorbei.',
    'servers.title': 'Top 15 Java-Server',
    'servers.description': 'Die meistgespielten öffentlichen Server gerade jetzt. Live-Status wird alle paar Minuten geprüft.',
    'servers.copyIp': 'IP kopieren',
    'servers.copied': 'Kopiert!',
    'servers.online': 'Online',
    'servers.offline': 'Offline',
    'servers.unknown': 'Prüfe…',
    'servers.players': '{online}/{max} Spieler',
    'servers.version': 'Version',
    'servers.website': 'Website',
    'servers.rank': '#{rank}',
    'article.back': 'Zurück zur Startseite',
    'article.toc': 'Auf dieser Seite',
    'article.older': 'Älter',
    'article.newer': 'Neuer',
    'article.aria.nav': 'Artikel-Navigation',
    'article.attribution': 'Quellenangabe',
    'article.attributionPrefix': 'Übernommen von',
    'article.attributionLicensed': 'lizenziert unter',
    'notfound.eyebrow': '404',
    'notfound.title': 'Dieses Biom existiert nicht.',
    'notfound.subtitle':
      'Die gesuchte Seite wurde abgebaut — oder ist nie gespawnt.',
    'notfound.cta': 'Zur Startseite',
    'footer.home': 'Start',
    'footer.disclaimer':
      'Keine Verbindung zu Mojang oder Microsoft. © {year} MineWiki.',
    'skipLink': 'Zum Inhalt springen',
  },
} as const;

export type UIKey = keyof (typeof UI)['en'];

export function t(locale: Locale, key: UIKey, vars?: Record<string, string | number>): string {
  const raw = (UI[locale] as Record<string, string>)[key] ?? (UI.en as Record<string, string>)[key] ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(`{${k}}`, String(v)),
    raw,
  );
}

/** Localised <html lang="…"> attribute. */
export function htmlLang(locale: Locale): string {
  return locale === 'de' ? 'de' : 'en';
}
