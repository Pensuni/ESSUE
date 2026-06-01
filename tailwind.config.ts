import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
 theme: {
    extend: {
      colors: {
        pink: {
          50: '#fff5f7',
          500: '#ff85a1', // 메인 핑크
          600: '#ff6b8d',
        },
      },
    },
  },
  plugins: [],
};

export default config;