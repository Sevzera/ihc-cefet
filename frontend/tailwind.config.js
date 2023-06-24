/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  important: true,
  theme: {
    extend: {
      fontFamily: {
        archivoNarrow: ["Archivo Narrow", "sans-serif"],
        balooChettan: ['"Baloo Chettan 2"', "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        light: {
          background: "#FFFFFF",
          backgroundSecondary: "#D9D9D9",
          primary: "#2B8CE5",
          secondary: "#565656",
          // inputFill: "#E7E7E7",
          inputFill: "#FFFFFF",
          commentFill: "#D9D9D9"
        },
        dark: {
          background: "#3A3A3A",
          backgroundSecondary: "#202020",
          primary: "#2B8CE5",
          secondary: "#DADADA",
          // inputFill: "#D9D9D9",
          inputFill: "#FFFFFF",
          commentFill: "#D9D9D9"
        },
        input: {
          stroke: "#3A3A3A",
          icon: "#7E7E7E",
          text: "#9E9E9E",
        },
        divider: {
          light: "#6A6A6A",
          dark: "#6A6A6A",
        },
        success: "#00C851",
        info: "#2B8CE5",
        warn: "#FFBB33",
        error: "#FE4E4E"
      },
    },
  },
  plugins: [],
};
