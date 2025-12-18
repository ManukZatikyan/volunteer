import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        "noto-sans": ["var(--font-noto-sans)", "sans-serif"],
      },
      colors: {
        // Primary Colors
        primary: {
          default: "#050927",
          light: "#111947",
          dark: "#000418",
          gray: "#CACACA",
        },
        // Secondary Colors
        secondary: {
          "orange-bright": "#FFA008",
          "orange-light": "#FFBF48",
          "orange-dark": "#CB8100",
          gray: "#CACACA",
        },
        // Background Colors
        background: {
          white: "#FFFFFF",
          "light-1": "#F6F6F6",
          "light-2": "#E0E0E0",
          dark: "#666666",
        },
        // Text Colors
        text: {
          "dark-blue": "#050927",
          "gray-1": "#666666",
          white: "#FFFFFF",
          "gray-2": "#999999",
          green: "#27AE60",
          red: "#E53935",
          yellow: "#FFD600",
          blue: "#2F80ED",
        },
        // Semantic Colors
        success: "#27AE60",
        error: "#E53935",
        warning: "#FFD600",
        info: "#2F80ED",
        // Button Variant Colors
        button: {
          orange: "#FFA008",
          "orange-light": "#FFC966",
          "orange-dark": "#8B5800",
          white: "#FFFFFF",
          "grey-light": "#D9D9D9",
          "grey-medium": "#CBCBCB",
          "grey-dark": "#999999",
          "grey-disabled": "#D9D9D9",
          "text-disabled": "#999999",
        },
      },
    },
  },
  plugins: [],
};

export default config;
