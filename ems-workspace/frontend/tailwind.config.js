/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        role: {
          founder: {
            DEFAULT: '#6366f1',
            light: '#e0e7ff',
            dark: '#4338ca',
            border: '#818cf8',
          },
          investor: {
            DEFAULT: '#10b981',
            light: '#d1fae5',
            dark: '#047857',
            border: '#34d399',
          },
          mentor: {
            DEFAULT: '#f59e0b',
            light: '#fef3c7',
            dark: '#b45309',
            border: '#fbbf24',
          },
          team: {
            DEFAULT: '#06b6d4',
            light: '#cffaff',
            dark: '#0e7490',
            border: '#38bdf8',
          },
        },
        surface: {
          dark: '#0f172a',
          darkCard: '#1e293b',
          light: '#f8fafc',
          lightCard: '#ffffff',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(99, 102, 241, 0.35)',
      },
      animation: {
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
