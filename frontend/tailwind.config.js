/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festival: {
          maroon: '#800020',
          red: '#cc0000',
          darkRed: '#580510',
          saffron: '#e65100',
          orange: '#ff7722',
          gold: '#fccd71',
          goldDark: '#d4af37',
          goldLight: '#fcd146',
          amber: '#f59e0b',
          cream: '#FEF7DA',
          goldenYellow: '#FEF7DA',
          goldenYellowLight: '#FFFBF0',
          creamWarm: '#fff7de',
          creamDark: '#faf5eb'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Rozha One', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'festive-gradient': 'linear-gradient(135deg, #f19a5c 0%, #f9db6f 100%)',
        'canva-hero': 'linear-gradient(180deg, #ffda6a 0%, #fff7de 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #800020 0%, #cc0000 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #fcd146 0%, #fff7de 50%, #fcd146 100%)'
      }
    },
  },
  plugins: [],
}

