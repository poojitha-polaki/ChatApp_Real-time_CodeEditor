/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primay: '#d2fff6',
        secondary: '#5fedd0',
        third: '#0acfa6',
        fourth: '#02a180',
      }
    },
  },
  plugins: [],
}

