/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#EDE9FF",
          200: "#DCD6FF",
          300: "#BFB2FF",
          400: "#9B87F5",
          500: "#6F52EB",
          600: "#4B24FF",
        },
      },
    },
  },
  plugins: [],
};
