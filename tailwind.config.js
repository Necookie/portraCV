/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Cozy Café" Aesthetic Palette
        background: '#fafaf9', // Stone-50 (Warm off-white)
        surface: '#ffffff', // White (Cards, Sidebars, Inputs)
        primary: '#e11d48', // Rose-600 (Soft, warm brand accent)
        paper: '#ffffff', // Pure White

        // Status colors
        success: '#059669', // Emerald-600
        warning: '#d97706', // Amber-600
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}