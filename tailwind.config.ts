import type { Config } from "tailwindcss";

// Stouchi visual identity — "Carnet de poche" (a warm Tunisian pocket ledger).
// Deliberately NOT the generic white-card / emerald-red / gray palette.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4ECDD",        // warm cream canvas
        "paper-deep": "#EADFC9", // darker inset
        "paper-card": "#FBF6EC", // raised surface (warm, not pure white)
        ink: "#221E1A",          // warm near-black — text + the "wallet"
        "ink-soft": "#7A6F62",   // muted warm secondary text
        line: "#DED0B6",         // warm hairline border
        clay: "#C8472A",         // terracotta — brand / expense
        "clay-deep": "#A8371F",
        olive: "#3C6B4A",        // botanical green — income
        "olive-deep": "#2C543A",
        saffron: "#E0A12E",      // gold — the coin / accents
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        // soft, warm, layered — not the flat default shadow-sm
        card: "0 1px 0 0 rgba(255,255,255,0.5) inset, 0 8px 24px -12px rgba(76,55,30,0.25)",
        wallet: "0 18px 40px -18px rgba(34,30,26,0.55)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
