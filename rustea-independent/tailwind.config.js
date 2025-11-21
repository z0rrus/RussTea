/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d97706',
        secondary: '#ea580c',
        accent: '#dc2626'
      }
    },
  },
  plugins: [],
}