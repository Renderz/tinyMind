/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"Comic Sans MS"', '"PingFang SC"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
