import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  // next-themes injects `class="dark"` on <html> — Tailwind reads it via this strategy.
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired neutral scale, slightly warmer than pure gray for readability.
        canvas: '#09090b',
        surface: '#121217',
        accent: {
          DEFAULT: '#10b981', // emerald-500 — Minecraft grass-block accent
          soft: 'rgba(16, 185, 129, 0.12)',
          ring: 'rgba(16, 185, 129, 0.45)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Soft, low-elevation shadow — Apple uses these to imply depth without distraction.
        glass: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 32px -8px rgba(0,0,0,0.4)',
        glow: '0 0 0 1px rgba(16,185,129,0.3), 0 8px 24px -4px rgba(16,185,129,0.25)',
      },
      transitionTimingFunction: {
        // Apple's signature spring-ish ease for UI motion.
        apple: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 400ms cubic-bezier(0.32, 0.72, 0, 1) both',
      },
    },
  },
  plugins: [typography],
};

export default config;
