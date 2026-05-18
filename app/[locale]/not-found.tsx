'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, isLocale, t, type Locale } from '@/lib/i18n';

export default function NotFound() {
  // `not-found.tsx` doesn't receive route params, so derive locale from the URL.
  const pathname = usePathname() || '/';
  const seg = pathname.split('/')[1];
  const locale: Locale = isLocale(seg) ? seg : DEFAULT_LOCALE;

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center md:px-10">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">
        {t(locale, 'notfound.eyebrow')}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tightest text-white md:text-5xl
                     [.light_&]:text-zinc-900">
        {t(locale, 'notfound.title')}
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-400 [.light_&]:text-zinc-600">
        {t(locale, 'notfound.subtitle')}
      </p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm
                   font-semibold text-black transition-transform duration-300 ease-apple hover:scale-[1.02]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t(locale, 'notfound.cta')}
      </Link>
    </section>
  );
}
