import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#151515',
        paper: '#f7f4ef',
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0369a1',
          900: '#0c4a6e',
        },
      },
      boxShadow: {
        soft: '0 18px 55px rgba(22, 30, 38, 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
