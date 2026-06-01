// src/app/layout.tsx
import "./globals.css";
import Header from "@/components/Header"; // 헤더 불러오기

export const metadata = {
  title: "ESSUE",
  description: "AI-Based Anonymous Community", // 신입생과 재학생을 위한 익명 소통 창구
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-slate-50 min-h-screen">
        <Header /> 
        <main className="max-w-4xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}