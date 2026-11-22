/** Tailwind do portfólio. Gerado por "npm run build" em styles.css. */
export default {
  content: ['./index.html', './src/**/*.jsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Montserrat"', 'system-ui', 'sans-serif'],
        montserrat: ['"Montserrat"', 'system-ui', 'sans-serif'],
        mono: ['"Montserrat"', 'monospace'],
        stretch: ['"StretchPro"', '"Montserrat"', 'sans-serif'],
        display: ['"StretchPro"', '"Montserrat"', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
};
