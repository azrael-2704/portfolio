/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-(cyan|sky|blue|indigo|purple|pink|red|orange|amber|green|teal|emerald|violet|yellow|fuchsia|rose)-500/,
    },
  ],
  plugins: [],
}
