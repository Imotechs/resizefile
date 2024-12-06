/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to your app's files
    "./public/index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        drawCircle: {
          "0%": { strokeDasharray: "0 63" },
          "100%": { strokeDasharray: "63 0" },
        },
        drawCheck: {
          "0%": { strokeDashoffset: "30" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "draw-circle": "drawCircle 0.6s ease-in-out forwards",
        "draw-check": "drawCheck 0.4s ease-in-out forwards 0.6s",
      },
    },
  },
  plugins: [],
}

