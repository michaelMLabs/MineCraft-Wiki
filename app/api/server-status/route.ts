import { NextResponse } from 'next/server';

// Proxy to https://api.mcsrvstat.us (Java endpoint) with edge caching so we
// never hammer them, and one shared response per (ip, 3-minute window).

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // we control caching via headers

const UPSTREAM = 'https://api.mcsrvstat.us/3';
const CACHE_SECONDS = 180; // 3 minutes — Hypixel's player count moves slower than that anyway
const TIMEOUT_MS = 8_000;

// Very loose validation so we don't proxy arbitrary URLs but also don't reject
// legitimate Minecraft addresses (subdomains, ports).
const IP_RE = /^[a-zA-Z0-9.\-_]+(:\d{1,5})?$/;

export interface ServerStatus {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
  motd?: string[];
  /** base64 data URL — comes straight from mcsrvstat.us. May be empty string. */
  icon?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = (searchParams.get('ip') || '').trim();

  if (!ip || !IP_RE.test(ip) || ip.length > 100) {
    return NextResponse.json({ online: false, error: 'invalid ip' }, { status: 400 });
  }

  try {
    const res = await fetch(`${UPSTREAM}/${encodeURIComponent(ip)}`, {
      // Next will dedupe + cache identical fetches across in-flight requests.
      next: { revalidate: CACHE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'minewiki-status/1.0' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { online: false, error: `upstream ${res.status}` },
        {
          status: 200,
          headers: { 'cache-control': `public, s-maxage=60, stale-while-revalidate=60` },
        },
      );
    }

    const raw = await res.json();
    // Normalise to a small, stable payload — don't leak upstream surface.
    const body: ServerStatus = {
      online: !!raw.online,
      players: raw.players
        ? { online: Number(raw.players.online ?? 0), max: Number(raw.players.max ?? 0) }
        : undefined,
      version: typeof raw.version === 'string' ? raw.version : undefined,
      motd: Array.isArray(raw.motd?.clean) ? raw.motd.clean.slice(0, 3) : undefined,
      icon: typeof raw.icon === 'string' ? raw.icon : undefined,
    };

    return NextResponse.json(body, {
      status: 200,
      headers: {
        'cache-control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { online: false, error: (e as Error).message },
      {
        status: 200,
        headers: { 'cache-control': `public, s-maxage=30, stale-while-revalidate=60` },
      },
    );
  }
}
