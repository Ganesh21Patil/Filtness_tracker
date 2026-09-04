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
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // energetic teal for fitness feel
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        dark: '#111827',
        // Figma "TrainerLedger" brand system — dark navy/violet/cyan editorial look.
        ink: '#0c0c1c',
        ink2: '#15152a',
        panel: '#17172c',
        deep: '#25204f',
        deep2: '#201b43',
        deep3: '#2d2759',
        cream: '#f5f2ed',
        offwhite: '#f6f5ff',
        accent: {
          DEFAULT: '#00c7ef',
          light: '#70ddf6',
        },
        violet: {
          DEFAULT: '#5447e8',
          light: '#9d96ff',
          lighter: '#a9a1ff',
          soft: '#756bff',
          text: '#615cc0',
          focus: '#6259d6',
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
