import { NextResponse } from 'next/server';

// Server status proxy with multi-provider fallback.
//
// Some servers (Hypixel, CYTooXIEN, ...) block one provider but not the other.
// We try mcsrvstat.us first; if it reports offline, we double-check via
// mcapi.us. Online wins. Genuine offlines (both say offline) get a short
// 60s cache so transient errors recover quickly.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ONLINE_CACHE_SECONDS = 180; // confident online → 3 min
const OFFLINE_CACHE_SECONDS = 60; // possibly transient → 1 min
const TIMEOUT_MS = 8_000;

const IP_RE = /^[a-zA-Z0-9.\-_]+(:\d{1,5})?$/;

export interface ServerStatus {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
  motd?: string[];
  icon?: string; // base64 data URL
}

async function fetchJsonSafe(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: ONLINE_CACHE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'minewiki-status/1.0' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined;
}

// Strip Minecraft color codes (§a, §c, ...) from any user-facing string.
function stripColors(v: string | undefined): string | undefined {
  if (!v) return v;
  const cleaned = v.replace(/§./g, '').trim();
  return cleaned || undefined;
}

function asNumber(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

// Stitch a single object out of either mcsrvstat or mcapi.us payloads.
function normaliseMcsrvstat(raw: unknown): ServerStatus | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const playersRaw = r.players as Record<string, unknown> | undefined;
  const motdRaw = r.motd as Record<string, unknown> | undefined;
  const motd = Array.isArray(motdRaw?.clean) ? (motdRaw.clean as unknown[]).slice(0, 3).map(String) : undefined;
  return {
    online: !!r.online,
    players: playersRaw ? { online: asNumber(playersRaw.online), max: asNumber(playersRaw.max) } : undefined,
    version: stripColors(asString(r.version)),
    motd,
    icon: asString(r.icon),
  };
}

function normaliseMcapi(raw: unknown): ServerStatus | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  // mcapi.us returns { status: "success", online, players: { now, max }, server: { name }, motd, favicon }
  if (r.status !== 'success') return null;
  const playersRaw = r.players as Record<string, unknown> | undefined;
  const serverRaw = r.server as Record<string, unknown> | undefined;
  return {
    online: !!r.online,
    players: playersRaw
      ? { online: asNumber(playersRaw.now), max: asNumber(playersRaw.max) }
      : undefined,
    version: stripColors(asString(serverRaw?.name)),
    motd: stripColors(asString(r.motd)) ? [stripColors(asString(r.motd))!] : undefined,
    icon: asString(r.favicon),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ip = (searchParams.get('ip') || '').trim();

  if (!ip || !IP_RE.test(ip) || ip.length > 100) {
    return NextResponse.json({ online: false, error: 'invalid ip' }, { status: 400 });
  }

  // Race-of-two: query both providers in parallel; pick whichever says online.
  // Total wall time stays at one API call (~hundreds of ms) since they run together.
  const [mcsrvRaw, mcapiRaw] = await Promise.all([
    fetchJsonSafe(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`),
    fetchJsonSafe(`https://mcapi.us/server/status?ip=${encodeURIComponent(ip)}`),
  ]);

  const mcsrv = normaliseMcsrvstat(mcsrvRaw);
  const mcapi = normaliseMcapi(mcapiRaw);

  // Prefer the one that reports online; if neither, return mcsrvstat shape (richer fields).
  let body: ServerStatus;
  if (mcsrv?.online) {
    body = mcsrv;
  } else if (mcapi?.online) {
    // Borrow icon from mcsrvstat if mcapi didn't return one — mcsrvstat icons are nicer base64.
    body = { ...mcapi, icon: mcapi.icon || mcsrv?.icon };
  } else {
    body = mcsrv || { online: false };
  }

  const ttl = body.online ? ONLINE_CACHE_SECONDS : OFFLINE_CACHE_SECONDS;
  return NextResponse.json(body, {
    status: 200,
    headers: {
      'cache-control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl}`,
    },
  });
}
