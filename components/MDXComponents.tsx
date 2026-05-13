import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Link from 'next/link';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'tip';
  children: ReactNode;
}) {
  const styles = {
    info: { icon: Info, ring: 'border-sky-400/30 bg-sky-400/5 text-sky-200' },
    warning: { icon: AlertTriangle, ring: 'border-amber-400/30 bg-amber-400/5 text-amber-100' },
    tip: { icon: Lightbulb, ring: 'border-accent/40 bg-accent/5 text-emerald-100' },
  } as const;
  const { icon: Icon, ring } = styles[type];
  return (
    <aside
      className={`not-prose my-6 flex gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md ${ring}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="text-sm leading-relaxed">{children}</div>
    </aside>
  );
}

function MDXLink({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  if (isInternal) return <Link href={href} {...props} />;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

export const mdxComponents: MDXComponentsType = {
  a: MDXLink,
  Callout,
  // Headings get scroll-margin so anchor jumps land below the sticky header.
  h2: (props) => <h2 className="scroll-mt-24" {...props} />,
  h3: (props) => <h3 className="scroll-mt-24" {...props} />,
};
