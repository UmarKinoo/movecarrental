import type { Config } from 'tailwindcss'

/**
 * MOVE design tokens — sporty / kinetic.
 * Base: white. Ink: deep charcoal-green from brand JPG. Lime: electric accent.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep ink-green — pulled from the brand JPG background, used for headline text,
        // dark sections, and high-contrast surfaces.
        ink: {
          DEFAULT: '#0E1A14',
          50: '#f3f6f4',
          100: '#dde3df',
          200: '#b6c1ba',
          300: '#7d8c83',
          400: '#465650',
          500: '#1f2d27',
          600: '#16221c',
          700: '#0E1A14',
          800: '#091410',
          900: '#050b08',
        },
        // Electric lime — the punch accent. Use sparingly: CTAs, active states,
        // diagonal stripes, KPI numbers, focus rings.
        lime: {
          DEFAULT: '#DDFF00',
          50: '#fbffe0',
          100: '#f6ffb3',
          200: '#ecff66',
          300: '#e3ff33',
          400: '#DDFF00',
          500: '#bde000',
          600: '#8aa400',
          700: '#5e7000',
        },
        paper: '#ffffff',
        bone: '#f5f5f0',
        // Keep `brand` as a pointer to lime for any leftover references.
        brand: {
          50: '#fbffe0',
          100: '#f6ffb3',
          500: '#DDFF00',
          600: '#bde000',
          900: '#5e7000',
        },
      },
      fontFamily: {
        sans: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        display: ['var(--font-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        kinetic: '-0.02em',
      },
      borderRadius: {
        // Sharper everything for a kinetic feel.
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '10px',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(14, 26, 20, 0.10)',
        kinetic: '0 12px 0 0 #0E1A14',
      },
      keyframes: {
        'filter-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'filter-bar': 'filter-bar 1.1s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        'slide-up': 'slide-up 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
