/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        galaxy: {
          darkest: '#05050D',
          dark: '#080A18',
          midnight: '#0F132A',
          card: 'rgba(16, 21, 46, 0.65)',
          border: 'rgba(139, 92, 246, 0.25)',
          violet: '#8B5CF6',
          violetGlow: '#A855F7',
          neonBlue: '#38BDF8',
          cyan: '#06B6D4',
          lavender: '#DDD6FE',
          softText: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.7))' },
        }
      },
      boxShadow: {
        'galaxy-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'galaxy-glow': '0 0 25px -5px rgba(139, 92, 246, 0.5), 0 0 10px -5px rgba(6, 182, 212, 0.4)',
        'galaxy-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.5)',
      }
    },
  },
  plugins: [],
}
