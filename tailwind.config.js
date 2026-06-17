/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
      },
      colors: {
        // Lilac palette
        lilac: {
          50:  '#f5f0ff',
          100: '#ede4ff',
          200: '#daccff',
          300: '#c3adff',
          400: '#a880ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Green palette
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Dark backgrounds
        dark: {
          950: '#07070f',
          900: '#0d0d1a',
          800: '#12122a',
          700: '#1a1a35',
          600: '#22223f',
          500: '#2d2d52',
        },
      },
      backgroundImage: {
        'gradient-lilac': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-dark': 'linear-gradient(135deg, #12122a 0%, #0d0d1a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(16,185,129,0.04) 100%)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(139,92,246,0.6)' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.5s ease-out both',
        'fade-in':       'fade-in 0.4s ease-out both',
        'slide-in-left': 'slide-in-left 0.4s ease-out both',
        'scale-in':      'scale-in 0.3s ease-out both',
        'shimmer':       'shimmer 2s infinite',
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
      },
      boxShadow: {
        'lilac':     '0 4px 32px rgba(139,92,246,0.25)',
        'lilac-lg':  '0 8px 48px rgba(139,92,246,0.35)',
        'green':     '0 4px 32px rgba(16,185,129,0.25)',
        'card':      '0 2px 20px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
