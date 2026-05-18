'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { LOCALES, LOCALE_LABEL, isLocale, t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const COOKIE_NAME = 'minewiki-locale';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function LanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();

  function switchTo(target: Locale) {
    if (target === locale) return;

    // Replace the first segment of the path. Search params + hash are preserved
    // because pathname only contains the path; we rebuild the URL by hand.
    const parts = pathname.split('/');
    if (parts.length > 1 && isLocale(parts[1])) {
      parts[1] = target;
    } else {
      parts.splice(1, 0, target);
    }
    const newPath = parts.join('/') || `/${target}`;

    // Persist preference so the middleware honours it for any later visit to `/`.
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=${target}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    router.push(newPath);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={t(locale, 'header.langAria')}
      className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/5 p-0.5
                 text-xs font-semibold text-zinc-400
                 [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-500"
    >
      <Languages className="ml-2 mr-1 h-3.5 w-3.5" aria-hidden />
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            aria-label={`Switch to ${LOCALE_LABEL[l]}`}
            className={cn(
              'inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full px-2',
              'transition-colors duration-300 ease-apple',
              active
                ? 'bg-white text-black [.light_&]:bg-zinc-900 [.light_&]:text-white'
                : 'hover:bg-white/10 hover:text-white [.light_&]:hover:bg-zinc-100 [.light_&]:hover:text-zinc-900',
            )}
          >
            {LOCALE_LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}
