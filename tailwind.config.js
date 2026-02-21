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
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-up-delay-1': 'fadeInUp 0.6s ease-out 0.2s forwards',
        'fade-in-up-delay-2': 'fadeInUp 0.6s ease-out 0.4s forwards',
        'fade-in-up-delay-3': 'fadeInUp 0.6s ease-out 0.6s forwards',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}