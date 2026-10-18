import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand red, darkening to charcoal at 900.
        primary: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ff9b9b',
          400: '#f56565',
          500: '#e0383f',
          600: '#d4202a',
          700: '#a8151d',
          800: '#2e2823',
          900: '#1e1a17',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gold: {
          400: '#f6b52e',
          500: '#f4a81d',
          600: '#c98408',
        },
        cream: '#faf1e1',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        logo: ['var(--font-heading)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(28,25,23,.08), 0 8px 24px rgba(28,25,23,.08)',
        lift: '0 12px 32px rgba(28,25,23,.16)',
      },
    },
  },
  plugins: [],
}
export default config
