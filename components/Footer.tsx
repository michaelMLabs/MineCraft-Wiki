import Link from 'next/link';
import { Pickaxe } from 'lucide-react';

export function Footer() {
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

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400 [.light_&]:text-zinc-600">
          <Link href="/" className="hover:text-white [.light_&]:hover:text-zinc-900">Home</Link>
          <Link href="/#section-news" className="hover:text-white [.light_&]:hover:text-zinc-900">News</Link>
          <Link href="/#section-ores" className="hover:text-white [.light_&]:hover:text-zinc-900">Ores</Link>
          <Link href="/#section-structures" className="hover:text-white [.light_&]:hover:text-zinc-900">Structures</Link>
          <Link href="/#section-mobs" className="hover:text-white [.light_&]:hover:text-zinc-900">Mobs</Link>
          <Link href="/#section-tips" className="hover:text-white [.light_&]:hover:text-zinc-900">Tips</Link>
        </nav>

        <p className="text-xs text-zinc-500">
          Not affiliated with Mojang or Microsoft. © {new Date().getFullYear()} MineWiki.
        </p>
      </div>
    </footer>
  );
}
