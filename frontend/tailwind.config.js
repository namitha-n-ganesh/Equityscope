/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          dark: '#0B0F19',
          cardDark: '#111827',
          borderDark: '#1F2937',
          accent: '#10B981',       // emerald green
          accentHover: '#059669',
          danger: '#EF4444',       // red
          warning: '#F59E0B',      // amber
          info: '#3B82F6',         // blue
          purple: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
