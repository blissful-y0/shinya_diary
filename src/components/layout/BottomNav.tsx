"use client";

import { usePathname } from "next/navigation";
import { Home, Users, User } from "lucide-react";
import * as S from "./BottomNav.styles";

/* =============================================
   하단 네비게이션 바
   - 홈, 그룹, 프로필 메뉴
   - 현재 경로에 따라 활성화 상태 표시
   ============================================= */

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/groups", icon: Users, label: "그룹" },
  { href: "/profile", icon: User, label: "프로필" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <S.NavContainer>
      <S.NavContent>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <S.NavItem key={item.href} href={item.href} $active={isActive}>
              <S.IconWrapper>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </S.IconWrapper>
              <S.NavLabel>{item.label}</S.NavLabel>
            </S.NavItem>
          );
        })}
      </S.NavContent>
    </S.NavContainer>
  );
}
