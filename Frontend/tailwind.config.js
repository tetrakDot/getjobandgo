/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf6fc',
          100: '#d7eaf8',
          200: '#a7d0ef',
          300: '#75b6e6',
          400: '#469cdd',
          500: '#1267ad',
          600: '#0e5590',
          700: '#0b416e',
          800: '#083050',
          900: '#051d31',
        },
        logoGreen: '#6bc24d'
      }
    }
  },
  plugins: []
};

