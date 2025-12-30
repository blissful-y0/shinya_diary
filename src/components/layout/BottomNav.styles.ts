import styled from "styled-components";
import Link from "next/link";

/* =============================================
   BottomNav 스타일
   - 고정 하단 네비게이션
   ============================================= */

export const NavContainer = styled.nav`
  /* 고정 하단 네비게이션 */
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background-color: var(--background);
  border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 100;
`;

export const NavContent = styled.div`
  /* 네비게이션 내부 레이아웃 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
`;

export const NavItem = styled(Link)<{ $active: boolean }>`
  /* 네비게이션 아이템 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: ${({ $active }) =>
    $active ? "var(--primary)" : "var(--muted-foreground)"};
  text-decoration: none;
  transition: color 0.2s;

  &:active {
    transform: scale(0.95);
  }
`;

export const IconWrapper = styled.div`
  /* 아이콘 래퍼 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

export const NavLabel = styled.span`
  /* 네비게이션 레이블 */
  font-size: 11px;
  font-weight: 500;
`;
