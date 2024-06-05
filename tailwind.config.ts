import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'black-right-bottom': '5px 5px 0px 0px rgba(0, 0, 0, 1)',
      },
      colors: {
        primary: {
          app: "#1FFF69",
          dark: "#0D1F23"
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'hero-pattern':
          "linear-gradient(to left, #1FFF69, #00524F)",
        'hero-pattern-2':
          "linear-gradient(to bottom left, #1FFF69, #00524F 90%)",
        'hero-pattern-btn':
          "linear-gradient(to right, #00524F 0%, #1FFF69 100%)",
      },
    },
  },
  plugins: [
  ],
}
export default config
