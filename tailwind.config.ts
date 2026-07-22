import type { Config } from "tailwindcss";

/**
 * FindDoc India design system.
 * Calm, clinical-but-warm healthcare palette:
 *  - brand (teal) : primary — trust, calm, medical
 *  - amber        : Featured/Sponsored accents only (clearly distinct from clinical teal)
 *  - rose/red     : emergency only (never used for marketing)
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Noto Sans",
          "sans-serif",
        ],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
