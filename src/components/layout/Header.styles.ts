import styled from "styled-components";
import Link from "next/link";

/* =============================================
   Header 스타일
   - 고정 헤더 레이아웃
   ============================================= */

export const HeaderContainer = styled.header`
  /* 고정 헤더 */
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 56px;
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
  z-index: 100;
`;

export const HeaderContent = styled.div`
  /* 헤더 내부 레이아웃 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 8px;
`;

export const LeftSection = styled.div`
  /* 좌측 섹션 */
  display: flex;
  align-items: center;
  min-width: 48px;
`;

export const CenterSection = styled.div`
  /* 중앙 섹션 */
  flex: 1;
  display: flex;
  justify-content: center;
  overflow: hidden;
`;

export const RightSection = styled.div`
  /* 우측 섹션 */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 48px;
`;

export const BackButton = styled(Link)`
  /* 뒤로가기 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }

  &:active {
    background-color: var(--muted);
  }
`;

export const Title = styled.h1`
  /* 헤더 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
