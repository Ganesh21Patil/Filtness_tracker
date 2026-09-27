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
        // Electric blue is atmosphere only — the edge light on the calculator
        // cards. It is never an interactive colour: every action is `accent`.
        electric: {
          DEFAULT: "#2a62ff",
          light: "#4d86ff",
          dark: "#1d48d9",
        },
        violet: "#6b5cff", // chart series only (federal tax), never text or UI
        gold: {
          DEFAULT: "#d9b25f", // sparing premium highlight: logo, tips, warnings
          light: "#f0d595",
        },
        danger: "#ff9b9b", // inline errors (7:1 on ink)
      },
      // The two in-between sizes the form uses, named instead of ad hoc.
      fontSize: {
        // Helper and instructional text — the smallest size for anything a
        // person has to read to use the page. 12px (text-xs) is reserved for
        // uppercase labels, chart ticks, badges and legal fine print.
        hint: ["13px", { lineHeight: "1.45" }],
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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        condensed: ["var(--font-condensed)", "var(--font-sans)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      // Motion. Durations by role: 150ms for hover, press and colour; ~200ms
      // for small things that open (tooltips, menus, disclosures); 320ms for
      // a panel arriving; 500ms+ only for one-time entrances and data
      // changes. Everything that arrives uses the "settle" curve: quick off
      // the mark, soft landing. Nothing loops — the skeleton pulse and the
      // spinner repeat only while something loads. Use these through
      // motion-safe: so reduced motion turns them off.
      transitionTimingFunction: {
        settle: "cubic-bezier(.22,1,.36,1)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "rise-in": { from: { opacity: "0", translate: "0 10px" }, to: { opacity: "1", translate: "0 0" } },
        "pop-in": { from: { opacity: "0", scale: ".5" }, to: { opacity: "1", scale: "1" } },
        "drop-in": { from: { opacity: "0", translate: "0 -8px" }, to: { opacity: "1", translate: "0 0" } },
        "drop-out": { from: { opacity: "1", translate: "0 0" }, to: { opacity: "0", translate: "0 -8px" } },
        // A deep-linked field lights up once, so you can see where you landed.
        "flash-ring": {
          "0%, 100%": { "box-shadow": "0 0 0 0 rgb(31 182 255 / 0)" },
          "25%": { "box-shadow": "0 0 0 4px rgb(31 182 255 / .35)" },
        },
        // A value that just changed nudges up into place.
        "value-pop": { from: { opacity: ".5", translate: "0 3px" }, to: { opacity: "1", translate: "0 0" } },
        // The hero card drops into its tilt once, then stays put. It rides on
        // the individual translate/rotate properties, so the element's own
        // -rotate-6 (a transform) is untouched and is the resting state.
        "card-settle": {
          from: { opacity: "0", translate: "0 28px", rotate: "5deg" },
          to: { opacity: "1", translate: "0 0", rotate: "0deg" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms cubic-bezier(.22,1,.36,1) both",
        "rise-in": "rise-in 320ms cubic-bezier(.22,1,.36,1) both",
        "pop-in": "pop-in 260ms cubic-bezier(.22,1,.36,1) both",
        "drop-in": "drop-in 260ms cubic-bezier(.22,1,.36,1) both",
        // Exits accelerate away (ease-in) and are quicker than entrances.
        "drop-out": "drop-out 180ms cubic-bezier(.4,0,1,1) both",
        "flash-ring": "flash-ring 1600ms cubic-bezier(.22,1,.36,1) 2",
        "value-pop": "value-pop 220ms cubic-bezier(.22,1,.36,1)",
        "card-settle": "card-settle 1100ms cubic-bezier(.22,1,.36,1) 300ms both",
      },
    },
  },
  plugins: [],
};
export default config;
