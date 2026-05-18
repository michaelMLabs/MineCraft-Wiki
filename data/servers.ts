// Top 15 Minecraft Java servers — the source of truth for the "Top Servers"
// section on the home page.
//
// Edit this file to update the list. The site rebuilds automatically from
// these values; live status (player count, online/offline, MOTD, icon) is
// fetched at request time from mcsrvstat.us — see app/api/server-status.

export interface ServerEntry {
  /** Display rank, 1-based. Lowest renders first. */
  rank: number;
  /** Public server name shown on the card. */
  name: string;
  /** Connect address. With port if non-default: "example.com:25566". */
  ip: string;
  /** Short tagline shown under the name. Bilingual. */
  description?: {
    en: string;
    de: string;
  };
  /** Tags like "Survival", "PvP", "Skyblock". Short, English; rendered as chips. */
  tags?: string[];
  /** Public website / Discord — opens in a new tab. */
  website?: string;
  /** Declared Java version, e.g. "1.21.x". Optional — usually inferred from live status. */
  version?: string;
  /** Optional manual icon override (URL). Otherwise we use the live status icon. */
  iconUrl?: string;
}

// ⬇️ Replace this list with the real top 15. Keep ranks 1..15, ascending.
// Placeholders are real, well-known public servers so the section renders
// something meaningful before the real list arrives.
export const SERVERS: ServerEntry[] = [
  {
    rank: 1,
    name: 'DonutSMP',
    ip: 'donutsmp.net',
    description: {
      en: 'Lifesteal SMP with an economy — rob, steal, scam, survive. One of the biggest SMPs out there.',
      de: 'Lifesteal-SMP mit Wirtschaftssystem — rauben, klauen, betrügen, überleben. Einer der größten SMPs überhaupt.',
    },
    tags: ['Survival', 'SMP', 'Lifesteal', 'Economy'],
    website: 'https://donutsmp.net',
  },
  {
    rank: 2,
    name: 'Unstable Events',
    ip: 'unstableevents.net',
    description: {
      en: 'Event-driven SMP — limited slots, scripted chaos, official Unstable Events server.',
      de: 'Event-getriebener SMP — limitierte Slots, inszeniertes Chaos, der offizielle Unstable-Events-Server.',
    },
    tags: ['SMP', 'Events'],
    website: 'https://unstableevents.net',
  },
  {
    rank: 3,
    name: 'CubeCraft',
    ip: 'play.cubecraft.net',
    description: {
      en: 'Classic minigames with a polished experience.',
      de: 'Klassische Minigames in polierter Umgebung.',
    },
    tags: ['Minigames', 'EggWars'],
    website: 'https://www.cubecraft.net',
  },
  // Slots 4, 5, 7-11, 13-15 are placeholders — replace as the real list arrives.
  { rank: 4, name: 'Placeholder #4', ip: 'placeholder4.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 5, name: 'Placeholder #5', ip: 'placeholder5.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  {
    rank: 6,
    name: 'Lostpiece',
    ip: 'play.lostpiece.net',
    description: {
      en: 'One Piece themed SMP — sail, fight for Devil Fruits, build your crew. Currently Season 5.',
      de: 'One-Piece-Themen-SMP — segeln, um Teufelsfrüchte kämpfen, Crew aufbauen. Aktuell Season 5.',
    },
    tags: ['SMP', 'One Piece', 'RPG', 'Adventure'],
    website: 'https://lostpiece.net',
  },
  { rank: 7, name: 'Placeholder #7', ip: 'placeholder7.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 8, name: 'Placeholder #8', ip: 'placeholder8.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 9, name: 'Placeholder #9', ip: 'placeholder9.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 10, name: 'Placeholder #10', ip: 'placeholder10.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 11, name: 'Placeholder #11', ip: 'placeholder11.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  {
    rank: 12,
    name: 'Landania',
    ip: 'landania.net',
    description: {
      en: 'German Citybuild server with ranks, jobs and an active community.',
      de: 'Deutscher Citybuild-Server mit Rängen, Jobs und aktiver Community.',
    },
    tags: ['Citybuild', 'German', 'Survival', 'Economy'],
    website: 'https://landania.net',
  },
  { rank: 13, name: 'Placeholder #13', ip: 'placeholder13.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 14, name: 'Placeholder #14', ip: 'placeholder14.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
  { rank: 15, name: 'Placeholder #15', ip: 'placeholder15.example.com',
    description: { en: 'Add the real server here.', de: 'Hier den echten Server eintragen.' }, tags: [] },
];

/** Sorted-by-rank getter used by the homepage. */
export function getServers(): ServerEntry[] {
  return [...SERVERS].sort((a, b) => a.rank - b.rank);
}
