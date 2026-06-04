import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        panel: "#181a1b",
        line: "#292d2b",
        wave: "#00c853",
        mint: "#adffc1"
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 200, 83, .18)",
        card: "0 15px 35px rgba(0,0,0,.25)"
      }
    }
  },
  plugins: []
};

export default config;
