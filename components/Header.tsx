'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Pickaxe } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { SearchModal } from './SearchModal';
import { MobileMenu } from './MobileMenu';
import type { ArticleMeta } from '@/lib/content-types';
import { t, type Locale } from '@/lib/i18n';

interface HeaderProps {
  locale: Locale;
  searchIndex: ArticleMeta[];
}

export function Header({ locale, searchIndex }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const NAV = [
    { href: `/${locale}#section-news`, label: t(locale, 'nav.news') },
    { href: `/${locale}#section-servers`, label: t(locale, 'nav.servers') },
    { href: `/${locale}#section-sneakpeeks`, label: t(locale, 'nav.snapshots') },
    { href: `/${locale}#section-ores`, label: t(locale, 'nav.ores') },
    { href: `/${locale}#section-structures`, label: t(locale, 'nav.structures') },
    { href: `/${locale}#section-mobs`, label: t(locale, 'nav.mobs') },
    { href: `/${locale}#section-tips`, label: t(locale, 'nav.tips') },
  ];

  // ⌘K / Ctrl+K shortcut + custom event channel for other components.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    const onOpen = () => setSearchOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('minewiki:open-search', onOpen as EventListener);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('minewiki:open-search', onOpen as EventListener);
    };
  }, []);

  return (
    <>
      <header className="nav-blur sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 font-semibold tracking-tight"
            aria-label="MineWiki"
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-xl bg-accent/20 text-accent
                         transition-transform duration-300 ease-apple group-hover:rotate-[8deg]"
            >
              <Pickaxe className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-base">
              Mine<span className="text-accent">Wiki</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t(locale, 'nav.aria.primary')}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-zinc-300
                           transition-colors duration-300 ease-apple
                           hover:bg-white/5 hover:text-white
                           [.light_&]:text-zinc-700 [.light_&]:hover:bg-zinc-100 [.light_&]:hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t(locale, 'header.searchAria')}
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/10
                         bg-white/5 px-3 text-sm text-zinc-400
                         transition-colors duration-300 ease-apple hover:bg-white/10 hover:text-white
                         [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-500"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t(locale, 'header.search')}</span>
              <kbd
                className="hidden items-center gap-1 rounded-md border border-white/10 bg-black/20
                           px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-flex
                           [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100"
              >
                ⌘K
              </kbd>
            </button>

            <LanguageToggle locale={locale} />
            <ThemeToggle locale={locale} />
            <MobileMenu locale={locale} items={NAV} />
          </div>
        </div>
      </header>

      <SearchModal
        locale={locale}
        open={searchOpen}
        onOpenChange={setSearchOpen}
        index={searchIndex}
      />
    </>
  );
}
