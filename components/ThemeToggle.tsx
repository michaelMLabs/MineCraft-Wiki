'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { t, DEFAULT_LOCALE, type Locale } from '@/lib/i18n';

export function ThemeToggle({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — the server can't know the user's stored preference.
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <button
      type="button"
      aria-label={isDark ? t(locale, 'header.themeToLight') : t(locale, 'header.themeToDark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full
                 border border-white/10 bg-white/5 text-zinc-300
                 transition-colors duration-300 ease-apple
                 hover:bg-white/10 hover:text-white
                 dark:border-white/10
                 [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-700"
    >
      <Sun className={`h-4 w-4 ${isDark ? 'hidden' : 'block'}`} aria-hidden />
      <Moon className={`h-4 w-4 ${isDark ? 'block' : 'hidden'}`} aria-hidden />
    </button>
  );
}
