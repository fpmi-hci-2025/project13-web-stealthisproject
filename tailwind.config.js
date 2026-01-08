/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System: "Корпоративный / Надежный" (Blue & Grey)
        primary: {
          DEFAULT: '#0D47A1', // Основной темно-синий
          dark: '#0D47A1',
          light: '#42A5F5', // Ярко-голубой акцентный
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5', // Акцентный цвет
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1', // Основной цвет
        },
        neutral: {
          DEFAULT: '#212121', // Темно-серый текст
          light: '#F5F5F5', // Светло-серый фон
          dark: '#212121',
        },
        system: {
          success: '#4CAF50',
          error: '#F44336',
          warning: '#FF9800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      typography: {
        h1: {
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '1.2',
        },
        h2: {
          fontSize: '2rem',
          fontWeight: '600',
          lineHeight: '1.3',
        },
        h3: {
          fontSize: '1.5rem',
          fontWeight: '600',
          lineHeight: '1.4',
        },
      },
    },
  },
  plugins: [],
}

