import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        // Light mode
        "app-bg": "#FFF8F0",
        "app-card": "#FFFFFF",
        "app-border": "#EAE2D3",
        "app-text": "#1F1B12",
        "app-muted": "#6B6560",
        "app-sidebar": "#FFFFFF",
        "app-hover": "#FFF3D6",
        // Dark mode surfaces
        "dark-bg": "#121212",
        "dark-card": "#1E1E1E",
        "dark-border": "#2C2C2C",
        "dark-text": "#F8F0E1",
        "dark-muted": "#8A8480",
        "dark-sidebar": "#1A1A1A",
        "dark-hover": "#2A2520",
        // Brand
        honey: "#FFD54F",
        "honey-dark": "#EBC23E",
        "honey-light": "#FFF3D6",
        "hive-black": "#1F1B12",
        // Semantic
        "pollinate": "#4CAF50",
        "sting": "#F44336",
        "pink-accent": "#AB2C5D",
        "pink-light": "#FFE0ED",
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        modal: "0 8px 32px rgba(0,0,0,0.12)",
        lift: "0 4px 16px rgba(0,0,0,0.08)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.25s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
