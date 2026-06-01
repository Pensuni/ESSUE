// tailwind.config.ts 파일
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // image_e25781.jpg의 톤에 맞춰서 정의한 색상
        essue: {
          pink: "#FDF2F4",    // 배경용 아주 연한 핑크
          rose: "#E5A1A8",    // 버튼/포인트용 더스티 로즈
          dark: "#4A4A4A",    // 텍스트용 진한 회색
        },
      },
    },
  },
  plugins: [],
};
export default config;