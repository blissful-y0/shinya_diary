import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/* =============================================
   루트 레이아웃
   - Shinya Diary 앱의 최상위 레이아웃
   - styled-components SSR 지원
   - 모바일 최적화 뷰포트 설정
   ============================================= */

/* 한국어 폰트 설정 */
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* 메타데이터 */
export const metadata: Metadata = {
  title: "Shinya Diary - 소중한 순간을 함께",
  description: "소규모 그룹을 위한 감성 교환일기 서비스",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shinya Diary",
  },
};

/* 뷰포트 설정 - 모바일 최적화 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body>
        <StyledComponentsRegistry>
          {children}
          <Toaster position="top-center" richColors />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
