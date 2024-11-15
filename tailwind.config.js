module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-dark': 'var(--primary-color-dark)',
        blue: '#1E3A8A',
      },
    },
  },
  plugins: [],
}
