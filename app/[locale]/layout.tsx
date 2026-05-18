import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSearchIndex } from '@/lib/content';
import { LOCALES, htmlLang, isLocale, t, type Locale } from '@/lib/i18n';
import { LocaleHtmlLang } from '@/components/LocaleHtmlLang';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minewiki.example.com';

// Pre-render both locales at build time.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await props.params;
  const locale: Locale = isLocale(raw) ? raw : 'en';

  const title =
    locale === 'de'
      ? 'MineWiki — Neuigkeiten, Tipps & Snapshots'
      : 'MineWiki — News, Tips & Sneak Peeks';
  const description =
    locale === 'de'
      ? 'Ein modernes, schnelles Minecraft-Wiki mit Neuigkeiten, Tipps und Snapshots zu kommenden Features.'
      : 'A modern, fast Minecraft wiki with news, tips & tricks, and sneak peeks at upcoming features.';

  return {
    title: { default: title, template: '%s · MineWiki' },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        de: '/de',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'MineWiki',
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: locale === 'de' ? ['en_US'] : ['de_DE'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'MineWiki',
      description,
    },
  };
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await props.params;
  if (!isLocale(raw)) notFound();
  const locale = raw;

  // Server-built search index, passed to the client header → no MDX reparse at runtime.
  const searchIndex = await getSearchIndex(locale);

  return (
    <>
      {/* Updates the <html lang> attribute on the client when the locale changes,
          so screen readers and browsers see the right language. */}
      <LocaleHtmlLang locale={htmlLang(locale)} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
                   focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-black"
      >
        {t(locale, 'skipLink')}
      </a>
      <Header locale={locale} searchIndex={searchIndex} />
      <div id="main">{props.children}</div>
      <Footer locale={locale} />
    </>
  );
}
