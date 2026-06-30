/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--accent)',
          dark: 'var(--accent-press)',
          soft: 'var(--accent-soft)',
          text: 'var(--accent-text)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          muted: 'var(--bg)',
          secondary: 'var(--surface-2)',
          border: 'var(--border)',
        },
      },
      fontFamily: {
        sans: ['var(--sans)'],
        mono: ['var(--mono)'],
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed)',
      },
      borderRadius: {
        cc: '9px',
        card: '14px',
      },
    },
  },
  plugins: [],
};
