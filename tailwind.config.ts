import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          app: "#1FFF69",
          dark: "#0D1F23"
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'hero-pattern':
          "linear-gradient(to left, #1FFF69, #00524F)",
        'hero-pattern-btn':
          "linear-gradient(to right, #00524F 0%, #1FFF69 100%)",
      },
    },
  },
  plugins: [
  ],
}
export default config
