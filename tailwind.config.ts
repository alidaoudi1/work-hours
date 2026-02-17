import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'SF Pro Text', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: '#050816',
          subtle: '#0b1020',
          softer: '#111827',
        },
        foreground: {
          DEFAULT: '#e5e7eb',
          muted: '#9ca3af',
        },
        accent: {
          DEFAULT: '#4f46e5',
          soft: '#6366f1',
        },
        danger: {
          DEFAULT: '#f97373',
        },
        border: '#1f2937',
      },
      boxShadow: {
        soft: '0 18px 40px rgba(15, 23, 42, 0.55)',
      },
    },
  },
  plugins: [],
}

export default config

