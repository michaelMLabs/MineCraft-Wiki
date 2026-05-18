import Link from 'next/link';
import { Pickaxe } from 'lucide-react';
import { t, type Locale } from '@/lib/i18n';

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-32 border-t border-white/10 [.light_&]:border-zinc-200">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/20 text-accent">
            <Pickaxe className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="text-sm font-medium tracking-tight">
            Mine<span className="text-accent">Wiki</span>
          </span>
        </div>

        <nav
          aria-label={t(locale, 'nav.aria.footer')}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400 [.light_&]:text-zinc-600"
        >
          <Link href={`/${locale}`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'footer.home')}
          </Link>
          <Link href={`/${locale}#section-news`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'nav.news')}
          </Link>
          <Link href={`/${locale}#section-ores`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'nav.ores')}
          </Link>
          <Link href={`/${locale}#section-structures`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'nav.structures')}
          </Link>
          <Link href={`/${locale}#section-mobs`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'nav.mobs')}
          </Link>
          <Link href={`/${locale}#section-tips`} className="hover:text-white [.light_&]:hover:text-zinc-900">
            {t(locale, 'nav.tips')}
          </Link>
        </nav>

        <p className="text-xs text-zinc-500">
          {t(locale, 'footer.disclaimer', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
