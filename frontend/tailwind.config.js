/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        secondary: {
          DEFAULT: '#111827',
          800: '#1F2937',
          900: '#111827',
          950: '#0A0E16',
        },
        accent: {
          DEFAULT: '#F59E0B',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        surface: '#F8FAFC',
        ink: '#1F2937',
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(to bottom, rgba(17,24,39,0.92), rgba(17,24,39,0.55))',
        'pulse-line': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40'%3E%3C/svg%3E\")",
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(17, 24, 39, 0.15)',
        card: '0 4px 24px -6px rgba(17, 24, 39, 0.08)',
        glow: '0 0 40px -8px rgba(239, 68, 68, 0.45)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(1.35)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        heartbeat: 'heartbeat 1.6s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
