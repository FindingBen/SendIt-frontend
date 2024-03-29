/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1736px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      backgroundColor: {
        customColor: "#color",
      },
      colors: {
        darkBlue: "#111827",
        darkGray: "#1f2937",
        darkestGray: "#1118274D",
        darkPurple: "#1D1A22",
        grayWhite: "#CAC4CF",
        lightGray: "#2C365E",
        lightBlue: "#2C365E",
      },
      fontFamily: {
        sfPro: ["SF Pro"],
        helv: ["helvetica"],
        sans: ["Sans"],
      },
      height: {
        "90vh": "90vh",
      },
    },
  },
  plugins: [],
};
