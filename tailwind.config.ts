/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#1B3A5C', dark: '#122843', light: '#E8F0FE' },
        gold:    { DEFAULT: '#C9A84C', light: '#E8C96A', pale: '#FFF8E1' },
        cream:   '#FAFAF7',
        surface: '#F7F9FC',
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}