/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        jobitus: {
          primary: "#7c3aed", // Rich Violet
          secondary: "#1e293b", // Deep Slate
          accent: "#06b6d4", // Cyan for status
          bg: "#fdfdff",
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}