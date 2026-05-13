import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center md:px-10">
      <p className="text-sm font-medium uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tightest text-white md:text-5xl
                     [.light_&]:text-zinc-900">
        That biome doesn&rsquo;t exist.
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-400 [.light_&]:text-zinc-600">
        The page you&rsquo;re looking for has been mined out, or maybe it never spawned.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm
                   font-semibold text-black transition-transform duration-300 ease-apple hover:scale-[1.02]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Return home
      </Link>
    </section>
  );
}
