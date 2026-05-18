import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/styles/globals.css';

// Inter is self-hosted at build time (no FOUT, no render-blocking round-trip).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://minewiki.example.com';

// App-wide defaults; per-locale layout overrides `lang` and adds locale-specific
// alternate/openGraph links via its own generateMetadata.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MineWiki',
    template: '%s · MineWiki',
  },
  description:
    'A modern, fast Minecraft wiki with news, tips & tricks, and sneak peeks.',
  applicationName: 'MineWiki',
  authors: [{ name: 'MineWiki' }],
  generator: 'Next.js',
  keywords: ['Minecraft', 'wiki', 'news', 'tips', 'snapshots', 'redstone', 'updates'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang` is set per-locale by [locale]/layout.tsx via the `<html>` re-mount trick;
  // for static export and SSR we default to en here.
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
