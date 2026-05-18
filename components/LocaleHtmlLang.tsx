'use client';

import { useEffect } from 'react';

/**
 * Updates `document.documentElement.lang` to match the active locale.
 * Root layout defaults to "en"; this nudges it on route changes so screen
 * readers and browser auto-translate behave correctly without rebuilding
 * <html>.
 */
export function LocaleHtmlLang({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
