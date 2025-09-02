/** @type {import('tailwindcss').Config} */
module.exports = {
  // This tells Tailwind to scan all files in the `app` directory for class names
  // so it can generate the correct CSS.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
