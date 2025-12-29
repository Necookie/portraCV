/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "The Executive" (Light Mode) Palette
        background: '#f8fafc', // Slate-50 (Light Grey-Blue foundation)
        surface:    '#ffffff', // White (Cards, Sidebars, Inputs)
        primary:    '#4f46e5', // Indigo-600 (Darker Indigo for contrast on white)
        paper:      '#ffffff', // Pure White (The Resume/Photo Sheet)
        
        // Status colors
        success:    '#059669', // Emerald-600 (Darker for light mode)
        warning:    '#d97706', // Amber-600
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}