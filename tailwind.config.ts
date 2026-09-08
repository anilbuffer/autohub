import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        autohub: {
          red: {
            DEFAULT: "#ed2025",
            hover: "#d3181d",
            light: "#fef2f2",
            subtle: "#fee2e2",
            dark: "#b91418",
          },
          navy: {
            DEFAULT: "#2b4499",
            hover: "#22377c",
            light: "#eff3ff",
            subtle: "#dbe4ff",
            dark: "#19285c",
            darker: "#101a3e",
            sidebar: "#070e1e",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(43, 68, 153, 0.08)",
        "glass-hover": "0 12px 40px 0 rgba(43, 68, 153, 0.16)",
        card: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 25px -5px rgba(43, 68, 153, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
