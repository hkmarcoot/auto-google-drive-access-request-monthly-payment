const colors = require("tailwindcss/colors")
/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.{tsx,html}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        stone: colors.stone,
        sky: colors.sky,
        neutral: colors.neutral,
        gray: colors.gray,
        slate: colors.slate,
        lime: colors.lime,
        rose: colors.rose
      },
      height: {
        128: "32rem"
      }
    }
  },
  plugins: []
}
