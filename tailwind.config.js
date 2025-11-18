/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ongc': {
          'maroon': '#800020',
          'dark-maroon': '#5a0016',
          'yellow': '#FFD700',
          'orange': '#FF8C00',
          'light-orange': '#FFA500',
          'white': '#FFFFFF',
          'off-white': '#F5F5F5',
          'gray': '#4A4A4A',
          'light-gray': '#E0E0E0',
        },
        'gem': {
          'onyx': '#800020',
          'slate': '#5a0016',
          'mist': '#E0E0E0',
          'offwhite': '#F5F5F5',
          'blue': '#FF8C00',
          'teal': '#FFD700',
        }
      },
    },
  },
  plugins: [],
}
