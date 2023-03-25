const plugin = require('tailwindcss/plugin')
module.exports = {
  presets: [require('@vercel/examples-ui/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './node_modules/@vercel/examples-ui/**/*.js',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scroll-shadows': {    
          'background':
            'linear-gradient(rgb(31 41 55), rgb(31 41 55)) center top,\
            linear-gradient(rgb(31 41 55), rgb(31 41 55)) center bottom,\
            radial-gradient( farthest-side at 50% 0, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0)) center top,\
            radial-gradient( farthest-side at 50% 100%, rgba(255, 255, 255, 0.3), rgba(0, 0, 0, 0)) center bottom',
          'background-repeat': 'no-repeat',
          'background-size': '100% 40px, 100% 40px, 100% 14px, 100% 14px',
          'background-attachment': 'local, local, scroll, scroll'
        }
      }
      )
    })
  ]
}
