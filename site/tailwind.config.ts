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
        // TrainerLedger brand system: dark navy/cream neutrals + one cyan accent.
        // "accent" and "accent-deep" are the SAME hue at two weights — dark-bg vs
        // light-bg — not two competing accent colors. Keep the palette to these
        // named tokens; don't introduce ad-hoc hex values in components.
        ink: '#0c0c1c',
        ink2: '#15152a',
        panel: '#17172c',
        deep: '#25204f',
        deep2: '#201b43',
        deep3: '#2d2759',
        cream: '#f5f2ed',
        offwhite: '#f6f5ff',
        inktext: '#17162a',
        accent: {
          DEFAULT: '#00c7ef', // on dark backgrounds
          light: '#70ddf6',
          deep: '#08647f', // on light backgrounds — same hue, WCAG AA safe on cream/white
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
