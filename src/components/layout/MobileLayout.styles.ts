import styled from "styled-components";

/* =============================================
   MobileLayout 스타일
   - 모바일 최적화 컨테이너
   ============================================= */

export const Container = styled.div`
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

export const Main = styled.main<{ $hasHeader: boolean; $hasNav: boolean }>`
  /* 메인 콘텐츠 영역 */
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* 헤더/네비게이션 여백 계산 */
  padding-top: ${({ $hasHeader }) => ($hasHeader ? "56px" : "0")};
  padding-bottom: ${({ $hasNav }) =>
    $hasNav ? "calc(64px + env(safe-area-inset-bottom, 0px))" : "0"};
`;
