/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primaryColor:"#057979",
        brightColor: "#05c7c1",
      },
      fontFamily: {
        sans: ["Ubuntu", "sans-serif"],  
      },
    },
  },
  plugins: [],
}

