'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, Pickaxe } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SearchModal } from './SearchModal';
import { MobileMenu } from './MobileMenu';
import type { ArticleMeta } from '@/lib/content-types';

interface HeaderProps {
  searchIndex: ArticleMeta[];
}

const NAV = [
  { href: '/#section-news', label: 'News' },
  { href: '/#section-sneakpeeks', label: 'Snapshots' },
  { href: '/#section-ores', label: 'Ores' },
  { href: '/#section-structures', label: 'Structures' },
  { href: '/#section-mobs', label: 'Mobs' },
  { href: '/#section-tips', label: 'Tips' },
];

export function Header({ searchIndex }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut — Apple convention for invoking command palettes.
  // Also listens for a `minewiki:open-search` event so any component can trigger it.
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
          {/* Brand */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-semibold tracking-tight"
            aria-label="Minecraft Wiki home"
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

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-white/10
                         bg-white/5 px-3 text-sm text-zinc-400
                         transition-colors duration-300 ease-apple hover:bg-white/10 hover:text-white
                         [.light_&]:border-zinc-200 [.light_&]:bg-white [.light_&]:text-zinc-500"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Search</span>
              <kbd
                className="hidden items-center gap-1 rounded-md border border-white/10 bg-black/20
                           px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-flex
                           [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100"
              >
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />
            <MobileMenu items={NAV} />
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} index={searchIndex} />
    </>
  );
}
