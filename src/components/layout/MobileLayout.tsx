"use client";

import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import * as S from "./MobileLayout.styles";

/* =============================================
   모바일 레이아웃 컨테이너
   - 최대 너비 480px로 모바일 최적화
   - CSS 계층 구조 트리 형태로 구성
   ============================================= */

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
  headerTitle?: string;
  headerBackHref?: string;
  headerRight?: ReactNode;
}

export default function MobileLayout({
  children,
  showHeader = true,
  showNav = true,
  headerTitle,
  headerBackHref,
  headerRight,
}: MobileLayoutProps) {
  return (
    <S.Container>
      {showHeader && (
        <Header
          title={headerTitle}
          backHref={headerBackHref}
          right={headerRight}
        />
      )}
      <S.Main $hasHeader={showHeader} $hasNav={showNav}>
        {children}
      </S.Main>
      {showNav && <BottomNav />}
    </S.Container>
  );
}
