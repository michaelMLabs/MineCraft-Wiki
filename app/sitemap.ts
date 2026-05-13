import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minewiki.example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/wiki/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleEntries,
  ];
}
