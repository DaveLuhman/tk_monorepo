/** @type {import('tailwindcss').Config} */
const content = ['./src/views/**/*.{hbs,js}', './src/public/**/*.{hbs,js}']
const mode = 'jit'
const daisyui = {
  themes: [{
    mytheme: {
      primary: '#69eac1',
      secondary: '#b4d356',
      accent: '#2d25c4',
      neutral: '#22242f',
      'base-100': '#40474f',
      info: '#5bbff1',
      success: '#176d5c',
      warning: '#edb721',
      error: '#e77a65'
    }
  }, 'light', 'dark', 'business']
}
const theme = {
  fontFamily: {
    sans: ['Roboto', 'sans-serif'],
    serif: ['Merriweather', 'serif']
  },
  screens: {
    sm: '576px',
    md: '960px',
    lg: '1440px'
  },
  extend: {}
}
const variants = { display: ['responsive', 'dropdown'] }

const plugins = [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('daisyui')]

export default { content, daisyui, theme, plugins, variants, mode, darkMode: 'class' }
