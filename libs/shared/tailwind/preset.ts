/**
 * @file libs/shared/tailwind/preset.ts
 * @description Shared Tailwind CSS preset for all DevFolio frontends.
 *
 * This is the single source of truth for the design system.
 * Every frontend extends this preset in its own tailwind.config.ts:
 *
 *   import { devfolioPreset } from '@devfolio/tailwind-preset';
 *   export default { presets: [devfolioPreset], content: [...] };
 *
 * Change a color here → updates every frontend on next build.
 * No hunting across three separate config files.
 *
 * DESIGN LANGUAGE
 * ───────────────
 * Dark, technical, minimal. Deep slate backgrounds with amber/gold
 * accents — warm enough to feel human, precise enough to feel like
 * a developer built it. Typography pairs Syne (geometric display)
 * with JetBrains Mono (code labels and tech tags).
 */

import type { Config } from 'tailwindcss';

export const devfolioPreset: Omit<Config, 'content'> = {
  // darkMode via 'class' lets us respect OS preference while
  // allowing a manual toggle. Default is dark (set on <html>).
  darkMode: 'class',

  theme: {
    extend: {
      // ── Colors ───────────────────────────────────────────────────
      // Values are CSS custom properties defined in globals.css.
      // The '<alpha-value>' placeholder is how Tailwind injects
      // opacity — e.g. bg-bg-surface/80 for 80% opacity.
      colors: {
        // Backgrounds — deep slate family
        bg: {
          base:    'rgb(var(--color-bg-base)    / <alpha-value>)',
          surface: 'rgb(var(--color-bg-surface) / <alpha-value>)',
          raised:  'rgb(var(--color-bg-raised)  / <alpha-value>)',
          border:  'rgb(var(--color-bg-border)  / <alpha-value>)',
        },
        // Text hierarchy
        text: {
          primary:   'rgb(var(--color-text-primary)   / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted:     'rgb(var(--color-text-muted)     / <alpha-value>)',
          inverted:  'rgb(var(--color-text-inverted)  / <alpha-value>)',
        },
        // Accent — amber/gold for CTAs, highlights, active states
        accent: {
          DEFAULT: 'rgb(var(--color-accent)     / <alpha-value>)',
          dim:     'rgb(var(--color-accent-dim)  / <alpha-value>)',
          glow:    'rgb(var(--color-accent-glow) / <alpha-value>)',
        },
        // Semantic status colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error:   'rgb(var(--color-error)   / <alpha-value>)',
        info:    'rgb(var(--color-info)    / <alpha-value>)',
      },

      // ── Typography ───────────────────────────────────────────────
      fontFamily: {
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      fontSize: {
        // Fluid type scale — clamp() grows between viewport sizes
        'display-2xl': ['clamp(2.5rem, 5vw, 4rem)',    { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-xl':  ['clamp(2rem,   4vw, 3rem)',    { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-lg':  ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },

      // ── Spacing ──────────────────────────────────────────────────
      spacing: {
        'section': '5rem',    // vertical padding between page sections
        'card':    '1.5rem',  // inner padding on cards
        'nav':     '4rem',    // height of the navigation bar
      },

      // ── Border Radius ────────────────────────────────────────────
      borderRadius: {
        'card': '0.75rem',   // cards and panels
        'tag':  '0.375rem',  // tech tags and badges
        'pill': '9999px',    // status pills and avatars
      },

      // ── Shadows ──────────────────────────────────────────────────
      boxShadow: {
        'card':        '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
        'card-hover':  '0 10px 30px -5px rgb(0 0 0 / 0.5)',
        'accent-glow': '0 0 20px -5px rgb(var(--color-accent-glow) / 0.4)',
        'nav':         '0 1px 0 0 rgb(var(--color-bg-border) / 1)',
      },

      // ── Animations ───────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease-out both',
        'fade-in':    'fade-in 0.3s ease-out both',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s linear infinite',
      },

      // ── Transition Timing ────────────────────────────────────────
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },

  plugins: [],
};
