module.exports = {
  darkMode: 'class',
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`],
  theme: {
    extend: {
      colors: {
        'main': '#F5F5F5',
        'light': '#FEFEFE',
        'primary': '#006888',
        'primarydark': '#004255',
        'text': '#121110',
        'text-light': '#636256',
        'jelly-bean': {
          DEFAULT: '#2A959F',
          '50': '#F7FDFD',
          '100': '#DCF6F5',
          '200': '#A8E7E8',
          '300': '#74D7DA',
          '400': '#3FC4CC',
          '500': '#2A959F',
          '600': '#22747F',
          '700': '#19555E',
          '800': '#11373E',
          '900': '#081A1E'
        },
        'mexican-red': {
          DEFAULT: '#9F342A',
          '50': '#FDF7F7',
          '100': '#F6DCDD',
          '200': '#E8A9A8',
          '300': '#DA7774',
          '400': '#CC473F',
          '500': '#9F342A',
          '600': '#7F2C22',
          '700': '#5E2219',
          '800': '#3E1811',
          '900': '#1E0C08'
        },
      }
    }
  },
  plugins: [],
}
