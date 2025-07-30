/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        minimal: {
          bg: '#000000',
          surface: 'rgba(15, 23, 42, 0.6)',
          border: 'rgba(30, 41, 59, 0.8)',
          text: '#f8fafc',
          muted: '#94a3b8',
          accent: '#6366f1',
          hover: '#4f46e5',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}