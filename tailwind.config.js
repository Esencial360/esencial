/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      strongBrown: '#362317',
      lightBrown: '#825F3E',
      veige: '#B89B80',
      bone: '#f7f5ef',
      blue: '#5C7A83',
      stronger_blue: '#1f657aff',
      red: '#aa2a2aff',
      orange: '#a85a10ff',
      gray: '#84827fff',
      teal: {
        100: '#e6fffa',
        200: '#b2f5ea',
        300: '#81e6d9',
        400: '#4fd1c5',
        500: '#38b2ac',
        600: '#319795',
        700: '#2c7a7b',
        800: '#285e61',
        900: '#234e52',
      },
    },
  },
  plugins: [],
}

