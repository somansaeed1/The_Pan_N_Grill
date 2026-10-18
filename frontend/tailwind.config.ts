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
          500: '#e63946',
          600: '#d62828',
          700: '#b01e1e',
          800: '#2b2623',
          900: '#1c1917',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        gold: {
          400: '#fcbf49',
          500: '#f9a826',
          600: '#d98a0b',
        },
        cream: '#fff8ec',
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
