import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrainerLedger "midnight" system: a near-black navy ground, frosted
        // glass surfaces, and blue light. Keep the palette to these named
        // tokens; don't introduce ad-hoc hex values in components.
        ink: "#05080f", // page ground
        ink2: "#070c18", // quieter bands
        panel: "#0a1122", // opaque surface (mobile bar, menus, selects)
        deep: "#0d172e",
        deep2: "#081022",
        deep3: "#12203d",
        offwhite: "#f4f7fc",

        // Text on dark, below offwhite. All ≥4.5:1 on ink and on glass cards.
        haze: "#c2cbe0", // secondary
        dusk: "#9ba7c2", // tertiary — supporting copy, legends
        fog: "#8491ae", // captions and meta

        // Form-field boundaries: 3:1 against glass and ink (WCAG 1.4.11).
        // Decorative hairlines use white/10 instead.
        edge: "#636e8a",

        accent: {
          DEFAULT: "#1fb6ff", // sky-cyan: hero CTAs, key figures, SE-tax series
          light: "#7cd0ff", // eyebrows and links
          soft: "#66c8ff",
        },
        // Electric blue: the calculator's primary action and focus glow.
        electric: {
          DEFAULT: "#2a62ff",
          light: "#4d86ff",
          dark: "#1d48d9",
        },
        violet: "#6b5cff", // federal-tax series
        gold: {
          DEFAULT: "#d9b25f", // sparing premium highlight: logo, tips, warnings
          light: "#f0d595",
        },
        danger: "#ff9b9b", // inline errors (7:1 on ink)
      },
      // The two in-between sizes the form uses, named instead of ad hoc.
      fontSize: {
        label: ["14px", { lineHeight: "1.35" }], // field labels and choice-card titles
        field: ["17px", { lineHeight: "1.5" }], // text typed into money fields
      },
      // Four radii, by role. Buttons, chips and avatars stay rounded-full.
      borderRadius: {
        card: "28px", // top-level surfaces: form, results panel, article cards
        tile: "18px", // cards inside a surface: deduction tiles, guide cards
        control: "12px", // inputs, selects, callouts, tooltips, list rows
      },
      boxShadow: {
        card: "0 30px 80px -30px rgba(0,0,0,.75)",
        glow: "0 12px 40px -8px rgba(31,182,255,.55)", // cyan CTA hover
        "glow-blue": "0 12px 40px -8px rgba(42,98,255,.7)", // electric CTA
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        condensed: ["var(--font-condensed)", "var(--font-sans)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
