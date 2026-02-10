import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/app/providers/QueryProvider";

export const metadata: Metadata = {
  title: "날씨 앱",
  description: "한국 지역 날씨 정보 조회 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
