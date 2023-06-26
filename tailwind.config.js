/** @type {import('tailwindcss').Config} */
module.exports = {
<<<<<<< HEAD
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
=======
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [ require('flowbite/plugin')],
>>>>>>> 06f6fa61c184ffd4c9d1a74f2593eb2a9e20f953
}

