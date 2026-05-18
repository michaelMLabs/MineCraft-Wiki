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
    name: 'Hypixel',
    ip: 'mc.hypixel.net',
    description: {
      en: 'The largest minigame network — Bedwars, Skywars, Skyblock, Murder Mystery and dozens more.',
      de: 'Das größte Minigame-Netzwerk — Bedwars, Skywars, Skyblock, Murder Mystery und Dutzende mehr.',
    },
    tags: ['Minigames', 'Bedwars', 'Skywars', 'Skyblock'],
    website: 'https://hypixel.net',
  },
  {
    rank: 4,
    name: 'Hugo SMP',
    ip: 'HugoSMP.net',
    description: {
      en: 'Massive German SMP with thousands of players — survival, spawners and an active economy.',
      de: 'Riesiger deutscher SMP mit tausenden Spielern — Survival, Spawner und aktive Wirtschaft.',
    },
    tags: ['SMP', 'Survival', 'German', 'Economy'],
    website: 'https://hugosmp.net',
  },
  {
    rank: 5,
    name: 'FreshSMP',
    ip: 'play.freshsmp.fun',
    description: {
      en: 'Season-based survival network — fresh world, fresh ranks, fresh start every season.',
      de: 'Season-basiertes Survival-Netzwerk — neue Welt, neue Ränge, frischer Start jede Season.',
    },
    tags: ['SMP', 'Survival', 'Seasons'],
    website: 'https://freshsmp.fun',
  },
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
  {
    rank: 7,
    name: 'LifeStealSMP',
    ip: 'lifesteal.net',
    description: {
      en: 'The classic lifesteal experience — kill players to take their hearts. Season 7 is live.',
      de: 'Das klassische Lifesteal-Erlebnis — Spieler töten, ihre Herzen nehmen. Season 7 läuft.',
    },
    tags: ['SMP', 'Lifesteal', 'PvP', 'Seasons'],
    website: 'https://lifesteal.net',
  },
  {
    rank: 8,
    name: 'FlameFragsSMP',
    ip: 'play.flamefrags.com',
    description: {
      en: 'PvP-focused SMP with duels, custom kits and survival — built for fighters.',
      de: 'PvP-fokussierter SMP mit Duels, Custom-Kits und Survival — gemacht für Kämpfer.',
    },
    tags: ['SMP', 'PvP', 'Duels', 'Survival'],
    website: 'https://flamefrags.com',
  },
  {
    rank: 9,
    name: 'Srino',
    ip: 'Srino.net',
    description: {
      en: 'Community-driven SMP with a focus on long-term progression. Active Discord.',
      de: 'Community-getriebener SMP mit Fokus auf Langzeit-Progression. Aktiver Discord.',
    },
    tags: ['SMP', 'Survival', 'Community'],
    website: 'https://srino.net',
  },
  {
    rank: 10,
    name: 'SuperSMP',
    ip: 'supernet.gg',
    description: {
      en: 'Survival multiplayer with custom mechanics and a tight-knit community.',
      de: 'Survival-Multiplayer mit Custom-Mechaniken und eingespielter Community.',
    },
    tags: ['SMP', 'Survival'],
    website: 'https://supernet.gg',
  },
  {
    rank: 11,
    name: 'PlumpSMP',
    ip: 'plumpsmp.net',
    description: {
      en: 'Casual SMP — chill survival without the lifesteal chaos.',
      de: 'Casual-SMP — entspanntes Survival ohne Lifesteal-Chaos.',
    },
    tags: ['SMP', 'Survival', 'Casual'],
    website: 'https://plumpsmp.net',
  },
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
  {
    rank: 13,
    name: 'CYTooXIEN',
    ip: 'cytooxien.net',
    description: {
      en: 'Big German minigame network — SkyWars, BedWars, FFA and a huge German-speaking community.',
      de: 'Großes deutsches Minigame-Netzwerk — SkyWars, BedWars, FFA und riesige deutschsprachige Community.',
    },
    tags: ['Minigames', 'German', 'SkyWars', 'BedWars'],
    website: 'https://cytooxien.net',
  },
  {
    rank: 14,
    name: 'BoxSMP',
    ip: 'tk.boxmc.net',
    description: {
      en: 'Box-themed SMP with rotating updates and the recent BoxTop expansion.',
      de: 'Box-Themen-SMP mit rotierenden Updates und der aktuellen BoxTop-Erweiterung.',
    },
    tags: ['SMP', 'Survival'],
    website: 'https://boxmc.net',
  },
  {
    rank: 15,
    name: 'CoastSMP',
    ip: 'yt.coastsmp.net',
    description: {
      en: 'Coast-themed SMP with crates, bundles and a creator-friendly setup.',
      de: 'Coast-Themen-SMP mit Crates, Bundles und Creator-freundlichem Setup',
    },
    tags: ['SMP', 'Survival', 'Crates'],
    website: 'https://coastsmp.net',
  },
];

/** Sorted-by-rank getter used by the homepage. */
export function getServers(): ServerEntry[] {
  return [...SERVERS].sort((a, b) => a.rank - b.rank);
}
