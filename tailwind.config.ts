import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Calm, healthcare-appropriate palette — muted sage/teal, warm neutrals.
        // Avoids clinical cold blues/whites and gamified brights.
        sage: {
          50: "#f4f7f5",
          100: "#e6ede8",
          200: "#cdd9d1",
          300: "#a9bdb0",
          400: "#7f9c89",
          500: "#5f7f6a",
          600: "#4a6555",
          700: "#3d5346",
          800: "#33443a",
          900: "#2b3931",
        },
        canvas: "#faf9f6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        screen: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
