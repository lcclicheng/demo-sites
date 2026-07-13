/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { cream:'#faf8f5', charcoal:'#1a1814', amber:'#d97706', terracotta:'#c2410c' },
      fontFamily: { display: ['"Playfair Display"','Georgia','serif'], body: ['Inter','system-ui','sans-serif'] },
    },
  },
  plugins: [],
}
