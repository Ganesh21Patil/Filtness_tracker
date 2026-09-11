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
        cream2: '#faf9f7', // quieter light surface for callouts inside white cards
        offwhite: '#f6f5ff',

        // Text on light surfaces — three steps, all AA on white and cream.
        inktext: '#17162a', // headings, values
        inksoft: '#413d57', // body copy (9.3:1 on cream)
        inkmuted: '#66617a', // hints, captions (5.3:1 on cream — the floor for small text)

        // Lines on light surfaces.
        line: '#e5e1ec', // decorative hairlines and card borders
        linestrong: '#8d88a1', // form-field boundaries: 3:1 on white and cream (WCAG 1.4.11)

        // Text on dark surfaces, below offwhite.
        haze: '#cac7e6', // secondary (9:1 on deep)
        dusk: '#a7a2c8', // tertiary — disclaimers, captions (6.2:1 on deep)

        accent: {
          DEFAULT: '#00c7ef', // on dark backgrounds
          light: '#70ddf6', // eyebrows and links on dark
          deep: '#08647f', // on light backgrounds — same hue, WCAG AA safe on cream/white
          soft: '#66d8f1', // second chart series only (federal tax), never text
        },
      },
      boxShadow: {
        card: '0 18px 50px rgba(31,25,74,.1)', // cream/white cards on any ground
        glow: '0 16px 40px rgba(0,199,239,.25)', // primary CTA hover
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
