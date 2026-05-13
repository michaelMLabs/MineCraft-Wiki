# MineWiki

A modern, fast Minecraft wiki built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Framer Motion. Apple-inspired UI: dark theme by default, glassmorphism surfaces, sticky blurred header, and a ⌘K command-palette search.

## Features

- **App Router + RSC** — content is read on the server, the client only ships interactive bits.
- **MDX content pipeline** — articles live in `/content/{news,tips,sneakpeeks}/*.mdx`, parsed with `gray-matter` and rendered with `next-mdx-remote/rsc`.
- **⌘K search** — `fuse.js` runs against an index built once at request time and passed in as props.
- **Dark / light / system** — `next-themes`, no flash.
- **Smooth motion** — Framer Motion page transitions and card hovers, all respecting `prefers-reduced-motion`.
- **SEO** — `metadataBase`, OpenGraph, Twitter cards, canonical URLs, dynamic `app/sitemap.ts`.
- **Accessibility** — semantic HTML, focus-visible rings, skip link, AA contrast.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| Motion | Framer Motion |
| Content | MDX via `next-mdx-remote` + `gray-matter` |
| Theme | `next-themes` |
| Search | `fuse.js` |
| Icons | `lucide-react` |
| Font | Inter via `next/font` |

## Project structure

```
.
├── app/
│   ├── layout.tsx          # Root layout, fonts, theme & header
│   ├── page.tsx            # Landing page (Server Component)
│   ├── landing-hero.tsx    # Tiny client wrapper for the Hero CTA
│   ├── not-found.tsx
│   ├── sitemap.ts          # Dynamic sitemap from MDX
│   └── wiki/[slug]/page.tsx
├── components/
│   ├── Header.tsx          # Sticky blurred nav + ⌘K trigger
│   ├── Footer.tsx
│   ├── Hero.tsx            # Landing hero
│   ├── MDXComponents.tsx   # Custom MDX (Callout, anchored headings)
│   ├── MobileMenu.tsx      # Hamburger sheet
│   ├── PageTransition.tsx  # Framer Motion route entrance
│   ├── SearchModal.tsx     # ⌘K command palette
│   ├── SectionCard.tsx     # Article card with hover lift
│   ├── ThemeProvider.tsx   # next-themes wrapper
│   └── ThemeToggle.tsx
├── content/
│   ├── news/*.mdx
│   ├── tips/*.mdx
│   └── sneakpeeks/*.mdx
├── lib/
│   ├── content.ts          # MDX read + typed frontmatter
│   └── utils.ts
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
└── tsconfig.json
```

## Getting started

### 1. Install

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

### 3. Type check (optional but recommended)

```bash
npm run type-check
```

### 4. Production build

```bash
npm run build
npm run start
```

## Adding content

Drop a new `.mdx` file into `/content/news`, `/content/tips`, or `/content/sneakpeeks` with this frontmatter:

```mdx
---
title: "Your title"
date: "2025-05-13"        # ISO 8601
category: "news"          # 'news' | 'tips' | 'sneakpeeks'
excerpt: "One-liner used in cards and search."
cover: "/images/foo.jpg"  # optional
tags: ["update", "1.21"]  # optional
---

# Your content here
```

Custom MDX components available in any article:

- `<Callout type="info|warning|tip">…</Callout>`

## Deploy to Vercel

1. Push to GitHub.
2. Import the repo at https://vercel.com/new.
3. (Optional) set `NEXT_PUBLIC_SITE_URL` to your production URL — used for absolute OpenGraph links and the sitemap.
4. Deploy. No other configuration required.

## Design notes

A few choices worth flagging:

- **`bg-canvas` / `bg-surface`** — defined in `tailwind.config.ts`. Using semantic tokens instead of raw zinc shades makes a future re-skin a one-file change.
- **Glass surface (`.glass`)** — `bg-white/5` + `backdrop-blur-md`, the same recipe Apple uses on visionOS sheets and macOS sidebars.
- **`ease-apple` (`cubic-bezier(0.32, 0.72, 0, 1)`)** — Apple's signature spring-flavored ease, used everywhere for consistency.
- **Hover lift is 1.5–2%** — anything more reads as bouncy/cartoonish; less and it's invisible.
- **Search index is server-built** — passed in as a prop to the header, so the client never reparses MDX or fetches a JSON blob.
- **`next/font/google`** — self-hosts Inter at build time, eliminating a render-blocking request and the FOUT.
- **`optimizePackageImports`** for `lucide-react` and `framer-motion` — significantly smaller server bundles.

## Performance targets

Out of the box, a Lighthouse run on `npm run build && npm run start` should clear:

- Performance: 95+
- Accessibility: 100
- Best practices: 100
- SEO: 100

## License

MIT.
