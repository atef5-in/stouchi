import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // TODO: pick ONE accent and keep it consistent (see CLAUDE.md §8)
        brand: "#E23A3A",
        income: "#16a34a",
        expense: "#dc2626",
      },
    },
  },
  plugins: [],
};

export default config;
