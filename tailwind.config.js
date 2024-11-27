/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'radio-dark': '#0f172a',
        'radio-blue': '#1e293b',
        'radio-accent': '#334155',
        'radio-light': '#3b82f6',
        'radio-text': '#f8fafc',
        'radio-text-secondary': '#cbd5e1'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}