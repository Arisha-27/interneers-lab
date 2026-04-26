/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0B0F19', 
          800: '#111827', 
          700: '#1F2937', 
          600: '#374151',
          500: '#4B5563',
          400: '#9CA3AF', 
          100: '#F3F4F6', 
        },
        brand: {
          400: '#60A5FA',
          500: '#3B82F6', 
          600: '#2563EB',
        },
        accent: {
          purple: '#8B5CF6',
          teal: '#14B8A6',
          rose: '#F43F5E',
          amber: '#F59E0B'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
