"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import Header from "./Header";
import BottomNav from "./BottomNav";

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
    <Container>
      {showHeader && (
        <Header
          title={headerTitle}
          backHref={headerBackHref}
          right={headerRight}
        />
      )}
      <Main $hasHeader={showHeader} $hasNav={showNav}>
        {children}
      </Main>
      {showNav && <BottomNav />}
    </Container>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 루트 컨테이너 */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  background-color: var(--background);
  position: relative;

  /* 태블릿/데스크탑에서 그림자 효과 */
  @media (min-width: 481px) {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
`;

const Main = styled.main<{ $hasHeader: boolean; $hasNav: boolean }>`
  /* 메인 콘텐츠 영역 */
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* 헤더/네비게이션 여백 계산 */
  padding-top: ${({ $hasHeader }) => ($hasHeader ? "56px" : "0")};
  padding-bottom: ${({ $hasNav }) =>
    $hasNav ? "calc(64px + env(safe-area-inset-bottom, 0px))" : "0"};
`;
