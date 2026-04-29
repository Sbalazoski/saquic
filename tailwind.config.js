/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EE',
        warm: '#EDE5D8',
        tan: '#C9A87C',
        rust: '#B5541E',
        deep: '#5C3317',
        earth: '#7A5C3A',
        saqgreen: '#3D6142',
        gold: '#D4922A',
        sky: '#4A7FA5',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
