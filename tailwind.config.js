/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'notion-bg': '#FAF9F6',
        'notion-border': '#E9E7E2',
        'notion-text': '#787774',
        'expense-red': '#E1B1B1',
        'allowance-green': '#A8C6A5',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
