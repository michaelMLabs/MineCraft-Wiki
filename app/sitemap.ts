import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content';
import { LOCALES } from '@/lib/i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minewiki.example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    LOCALES.map(async (locale) => {
      const articles = await getAllArticles(locale);
      const entries: MetadataRoute.Sitemap = [
        {
          url: `${SITE_URL}/${locale}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1,
        },
        ...articles.map((a) => ({
          url: `${SITE_URL}/${locale}/wiki/${a.slug}`,
          lastModified: new Date(a.date),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
      ];
      return entries;
    }),
  );
  return perLocale.flat();
}
