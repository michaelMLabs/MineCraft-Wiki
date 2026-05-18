'use client';

import { Hero } from '@/components/Hero';
import type { Locale } from '@/lib/i18n';

/**
 * Tiny client wrapper around the Hero so the home page can stay a Server Component.
 * Triggers the search modal by dispatching a custom event the Header listens for —
 * keeps modal ownership in one place without prop drilling or a global store.
 */
export function LandingHero({ locale }: { locale: Locale }) {
  return (
    <Hero
      locale={locale}
      onSearch={() => window.dispatchEvent(new CustomEvent('minewiki:open-search'))}
    />
  );
}
