"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Home, Users, PenSquare, User } from "lucide-react";

/* =============================================
   하단 네비게이션 바
   - 홈, 그룹, 글쓰기, 프로필 메뉴
   - 현재 경로에 따라 활성화 상태 표시
   ============================================= */

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/groups", icon: Users, label: "그룹" },
  { href: "/write", icon: PenSquare, label: "글쓰기" },
  { href: "/profile", icon: User, label: "프로필" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <NavContainer>
      <NavContent>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <NavItem key={item.href} href={item.href} $active={isActive}>
              <IconWrapper>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </IconWrapper>
              <NavLabel>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </NavContent>
    </NavContainer>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const NavContainer = styled.nav`
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

const NavContent = styled.div`
  /* 네비게이션 내부 레이아웃 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
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

const IconWrapper = styled.div`
  /* 아이콘 래퍼 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
`;

const NavLabel = styled.span`
  /* 네비게이션 레이블 */
  font-size: 11px;
  font-weight: 500;
`;
