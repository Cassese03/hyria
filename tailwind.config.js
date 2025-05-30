/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hyria: {
          primary: '#5e0303',   // Colore primario Hyria
          secondary: '#d96c00', // Colore secondario Hyria
          tertiary: '#ffffff',  // Colore terzo Hyria
          dark: '#020617',      // Colore scuro
          darker: '#000000',    // Ancora più scuro
          black: '#000000',     // Nero
          light: '#f8fafc',     // Chiaro
          orange: '#d96c00',    // Arancione
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        heading: ['Arvo', 'serif'],
      },
    },
  },
  plugins: [],
}