import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[class~="dark"]'],   // 👈 هذا هو الحل
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;