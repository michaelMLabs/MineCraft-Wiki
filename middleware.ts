import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, isLocale } from './lib/i18n';

const LOCALE_COOKIE = 'minewiki-locale';

function pickLocale(req: NextRequest): string {
  // 1. Sticky preference from a prior toggle wins.
  const fromCookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  // 2. Accept-Language header — naive parse, good enough for two locales.
  const header = req.headers.get('accept-language') || '';
  const preferred = header
    .split(',')
    .map((s) => s.split(';')[0].trim().toLowerCase());
  for (const tag of preferred) {
    const short = tag.split('-')[0];
    if (isLocale(short)) return short;
  }

  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip internals, assets, and already-locale-prefixed paths.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // any file with an extension
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];
  if (LOCALES.includes(firstSegment as (typeof LOCALES)[number])) {
    return NextResponse.next();
  }

  // Redirect /  → /<locale> and /foo → /<locale>/foo (preserves query).
  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except files & next internals (the function above also guards).
  matcher: ['/((?!_next|.*\\..*).*)'],
};
