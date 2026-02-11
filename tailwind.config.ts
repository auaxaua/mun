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
        // ألوان جامعة شقراء - أخضر زيتي غامق
        primary: {
          50: '#f0f4f0',
          100: '#d4e0d4',
          200: '#a8c1a8',
          300: '#7ca27c',
          400: '#5a8359',
          500: '#3d5a3c',  // أخضر زيتي غامق - اللون الرئيسي
          600: '#334d33',
          700: '#2a402a',
          800: '#213321',
          900: '#182618',
          950: '#0f1a0f',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // الذهبي - لون تكميلي
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
