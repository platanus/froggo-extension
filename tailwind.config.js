/* eslint-disable no-undef */
const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.html',
      './src/**/*.vue',
      './src/**/*.js',
      './src/**/*.erb',
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        'body': ['Open Sans', 'sans-serif'],
        'landing': ['Roboto', 'sans-serif'],
      },
      colors: {
        teal: colors.teal,
        froggo: {
          black: '#0e131f',
          blue: {
            DEFAULT: '#38405f',
            dark: '#232943',
          },
          gray: {
            DEFAULT: '#828282',
            light: '#d5d4d9',
          },
          green: {
            DEFAULT: '#27a594',
            '300': '#5ad8c7',
            '100': '#adece3',
          },
          red: {
            DEFAULT: '#ff1747',
            '300': '#ff7d98',
            '100': '#ffe3e9',
          },
          yellow: {
            DEFAULT: '#f5cb5c',
            '300': '#f9dd96',
            '100': '#fcf0cf',
          },
        },
      },
      height: {
        '13': '52px',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
