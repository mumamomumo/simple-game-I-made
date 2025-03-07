/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        text: {
          50: "#020d18",
          100: "#031930",
          200: "#063360",
          300: "#094c90",
          400: "#0c66c0",
          500: "#0f7ff0",
          600: "#3f99f3",
          700: "#6fb2f6",
          800: "#9fccf9",
          900: "#cfe5fc",
          950: "#e7f2fd",
        },
        background: {
          50: "#030b17",
          100: "#06172d",
          200: "#0b2e5b",
          300: "#114588",
          400: "#165bb6",
          500: "#1c72e3",
          600: "#498ee9",
          700: "#77abee",
          800: "#a4c7f4",
          900: "#d2e3f9",
          950: "#e8f1fc",
        },
        primary: {
          50: "#020b18",
          100: "#031730",
          200: "#072d5f",
          300: "#0a448f",
          400: "#0d5abf",
          500: "#1171ee",
          600: "#408df2",
          700: "#70aaf5",
          800: "#a0c6f8",
          900: "#cfe3fc",
          950: "#e7f1fd",
        },
        secondary: {
          50: "#180502",
          100: "#300a03",
          200: "#5f1407",
          300: "#8f1e0a",
          400: "#bf280d",
          500: "#ee3211",
          600: "#f25b40",
          700: "#f58470",
          800: "#f8ada0",
          900: "#fcd6cf",
          950: "#fdeae7",
        },
        accent: {
          50: "#151802",
          100: "#293003",
          200: "#525f07",
          300: "#7b8f0a",
          400: "#a4bf0d",
          500: "#cdee11",
          600: "#d7f240",
          700: "#e1f570",
          800: "#ebf8a0",
          900: "#f5fccf",
          950: "#fafde7",
        },
      },
    },
  },
  plugins: [],
};
