'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Users } from 'lucide-react';
import type { ServerEntry } from '@/data/servers';
import { t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LiveStatus {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
  motd?: string[];
  icon?: string;
}

interface ServerCardProps {
  locale: Locale;
  server: ServerEntry;
  index?: number;
}

export function ServerCard({ locale, server, index = 0 }: ServerCardProps) {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const description = server.description?.[locale] ?? server.description?.en;

  // Fetch live status once per mount. The Next route caches upstream by IP +
  // 3-minute window, so re-mounts inside that window are free.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/server-status?ip=${encodeURIComponent(server.ip)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: LiveStatus | null) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {
        if (!cancelled) setStatus({ online: false });
      });
    return () => {
      cancelled = true;
    };
  }, [server.ip]);

  async function copyIp() {
    try {
      await navigator.clipboard.writeText(server.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Older browsers / non-https contexts — silently fail rather than throw.
    }
  }

  const iconSrc = server.iconUrl || status?.icon || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
        delay: Math.min(index * 0.04, 0.3),
      }}
      whileHover={{ scale: 1.015 }}
      className="group relative overflow-hidden rounded-3xl"
    >
      <div className="glass relative h-full overflow-hidden rounded-3xl p-6">
        {/* Top row: rank chip + status pill */}
        <div className="flex items-center justify-between gap-2">
          <span className="chip text-accent">{t(locale, 'servers.rank', { rank: server.rank })}</span>
          <StatusPill locale={locale} status={status} />
        </div>

        {/* Icon + name */}
        <div className="mt-5 flex items-center gap-3">
          {iconSrc ? (
            // The icon is a base64 data URL from mcsrvstat.us — safe to inline.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconSrc}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl border border-white/10 bg-black/20"
            />
          ) : (
            <div
              className="grid h-12 w-12 place-items-center rounded-xl border border-white/10
                         bg-white/5 text-sm font-semibold text-zinc-400"
              aria-hidden
            >
              {server.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-white
                           [.light_&]:text-zinc-900">
              {server.name}
            </h3>
            {(status?.version || server.version) && (
              <p className="truncate text-xs text-zinc-500">
                {t(locale, 'servers.version')}: {status?.version || server.version}
              </p>
            )}
          </div>
        </div>

        {description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-400 [.light_&]:text-zinc-600">
            {description}
          </p>
        )}

        {/* Player count strip */}
        {status?.players && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 [.light_&]:text-zinc-600">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {t(locale, 'servers.players', {
              online: status.players.online.toLocaleString(),
              max: status.players.max.toLocaleString(),
            })}
          </div>
        )}

        {/* Tags */}
        {server.tags && server.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {server.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* IP + actions */}
        <div className="mt-5 flex items-center gap-2">
          <code
            className="flex-1 truncate rounded-lg border border-white/10 bg-black/20 px-3 py-2
                       font-mono text-xs text-zinc-200
                       [.light_&]:border-zinc-200 [.light_&]:bg-zinc-100 [.light_&]:text-zinc-800"
            title={server.ip}
          >
            {server.ip}
          </code>
          <button
            type="button"
            onClick={copyIp}
            aria-label={t(locale, 'servers.copyIp')}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-medium',
              'transition-colors duration-300 ease-apple',
              copied
                ? 'bg-accent text-black'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 [.light_&]:bg-zinc-100 [.light_&]:text-zinc-700 [.light_&]:hover:bg-zinc-200',
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden />
                {t(locale, 'servers.copied')}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {t(locale, 'servers.copyIp')}
              </>
            )}
          </button>
          {server.website && (
            <a
              href={server.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(locale, 'servers.website')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5
                         text-zinc-300 transition-colors duration-300 ease-apple hover:bg-white/10
                         hover:text-white
                         [.light_&]:bg-zinc-100 [.light_&]:text-zinc-700 [.light_&]:hover:bg-zinc-200"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function StatusPill({ locale, status }: { locale: Locale; status: LiveStatus | null }) {
  if (status === null) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500" />
        {t(locale, 'servers.unknown')}
      </span>
    );
  }
  if (!status.online) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-300">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        {t(locale, 'servers.offline')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
      {t(locale, 'servers.online')}
    </span>
  );
}
