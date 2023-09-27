/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1440px",
      // => @media (min-width: 1024px) { ... }

      xl: "1535px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1736px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        darkBlue: "#111827",
        darkGray: "#1f2937",
        darkestGray: "#1118274D",
        darkPurple: "#1D1A22",
        grayWhite: "#CAC4CF",
      },
      fontFamily: {
        sfPro: ["SF Pro"],
        helv: ["helvetica"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
    }),
  ],
};
