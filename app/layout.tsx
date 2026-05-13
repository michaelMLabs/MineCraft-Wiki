import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSearchIndex } from '@/lib/content';
import '@/styles/globals.css';

// next/font self-hosts Inter at build time (no FOUT, no extra round-trips).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minewiki.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MineWiki — News, Tips & Sneak Peeks',
    template: '%s · MineWiki',
  },
  description:
    'A modern, fast Minecraft wiki with news, tips & tricks, and sneak peeks at upcoming features.',
  applicationName: 'MineWiki',
  authors: [{ name: 'MineWiki' }],
  generator: 'Next.js',
  keywords: ['Minecraft', 'wiki', 'news', 'tips', 'snapshots', 'redstone', 'updates'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'MineWiki',
    title: 'MineWiki — News, Tips & Sneak Peeks',
    description: 'A modern, fast Minecraft wiki.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MineWiki',
    description: 'A modern, fast Minecraft wiki.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Search index is computed once on the server and passed to the client header,
  // so the client never has to fetch or parse MDX files at runtime.
  const searchIndex = await getSearchIndex();

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
                       focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-black"
          >
            Skip to content
          </a>
          <Header searchIndex={searchIndex} />
          <div id="main">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
