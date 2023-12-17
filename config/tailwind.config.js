/** @type {import('tailwindcss').Config} */
const content = ['./views/**/*.{hbs,js}', './public/**/*.{hbs,js}', "./node_modules/flowbite/**/*.js"]
const mode = 'jit'
const daisyui = {
  themes: [{
    mytheme: {
      /* Primary color for brand */
      'primary': '#005f73',
      /* Secondary color for accents */
      'secondary': '#94d2bd',
      /* Neutral colors for backgrounds and text */
      'neutral': '#e0e0e0',
      'base-100': '#ffffff',
      'base-200': '#f0f0f0',
      'base-300': '#d9d9d9',
      /* Fonts should be professional and readable */
      'font-base': '"Segoe UI", Arial, sans-serif',
      /* Other color customizations */
      'info': '#3ABFF8',
      'success': '#36D399',
      'warning': '#FBBD23',
      'error': '#F87272',
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
  extend: {
    maxHeight: {
      '0': '0',
      '500': '500px', // Adjust as per your content's needs
    },
    transitionProperty: {
      'height': 'max-height',
    },
    transitionDuration: {
      '500': '500ms',
    },
    transitionTimingFunction: {
      'in': 'ease-in',
      'out': 'ease-out',
    }
  }
}
const variants = { display: ['responsive', 'dropdown'] }

const plugins = [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('daisyui'), require('flowbite')]

export default { content, daisyui, theme, plugins, variants, mode, darkMode: 'class' }
