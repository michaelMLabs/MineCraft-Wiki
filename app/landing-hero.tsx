'use client';

import { Hero } from '@/components/Hero';

/**
 * Tiny client wrapper around the Hero so the home page can stay a Server Component.
 * Triggers the search modal by dispatching a custom event the Header listens for —
 * keeps modal ownership in one place without prop drilling or a global store.
 */
export function LandingHero() {
  return (
    <Hero
      onSearch={() => window.dispatchEvent(new CustomEvent('minewiki:open-search'))}
    />
  );
}
