/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Palette SOINELY Official Collection™ — Bleu SOINELY (Titres, navigation, confiance)
        primary: {
          50:  '#eef4ff',
          100: '#dce8ff',
          200: '#b8d0ff',
          300: '#89b0ff',
          400: '#5589fd',
          500: '#2f5fe8',   // Bleu SOINELY principal
          600: '#2249c4',
          700: '#1c399b',
          800: '#182f79',
          900: '#152a62',
          950: '#0c1636',
        },
        // Bleu marine — couvertures, fonds sombres, header
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1e2a5e',
          600: '#192453',
          700: '#141d43',
          800: '#0f1632',
          900: '#0a0f21',
          950: '#050810',
        },
        // Or / Orange — badges, accents éditoriaux ("VOLUME", nouveautés)
        gold: {
          50:  '#fff8ec',
          100: '#ffecc7',
          200: '#ffd685',
          300: '#ffbc4a',
          400: '#ffa31f',
          500: '#f5870c',
          600: '#d96906',
          700: '#b34e08',
          800: '#8f3d0d',
          900: '#75330f',
        },
        // Niveaux de priorité SOINELY (SCR-003 / Design Book Loi n°7) :
        // Vert Clinique™ = information · Jaune = vigilance · Orange Vigilance™ = action
        // (jamais urgence) · Rouge Urgence™ = urgence (jamais ailleurs)
        priorite: {
          info:      '#12b76a', // Vert Clinique™
          vigilance: '#eab308',
          action:    '#f5870c', // Orange Vigilance™ — précautions/surveillance uniquement
          critique:  '#ef4444', // Rouge Urgence™ — réservé exclusivement à l'urgence
        },
        success:  '#12b76a',
        warning:  '#f5870c',
        danger:   '#ef4444',
        // Bleu Documentation™ — protocoles, références, guides (distinct du Bleu SOINELY
        // de marque/navigation ci-dessus) : signale une ressource documentaire.
        info:     '#3b82f6',
        border:   'hsl(var(--border))',
        input:    'hsl(var(--input))',
        ring:     'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      fontFamily: {
        // Design Book™ Chapitre 2 : "Une seule famille. Partout. Toujours." — Inter uniquement,
        // y compris pour les titres (font-heading conservé comme alias sémantique, même police).
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        // Design System™ Chapitre 4 : cartes/boutons/champs = 16px, jamais d'angles différents.
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        // Design Book™ Chapitre 9 : durée maximale 250ms, transitions douces, jamais de rebond.
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'slide-in':       'slide-in 0.25s ease-out',
        'fade-in':        'fade-in 0.25s ease-out',
        'pulse-slow':     'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
