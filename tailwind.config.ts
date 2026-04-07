import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        accent: "var(--accent)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "day-hover": "var(--day-hover)",
        "range-fill": "var(--range-fill)",
      },
    },
  },
  plugins: [],
};

export default config;