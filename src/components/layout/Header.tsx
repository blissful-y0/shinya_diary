"use client";

import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import * as S from "./Header.styles";

/* =============================================
   헤더 컴포넌트
   - 뒤로가기, 제목, 우측 액션 버튼 지원
   ============================================= */

interface HeaderProps {
  title?: string;
  backHref?: string;
  right?: ReactNode;
}

export default function Header({ title, backHref, right }: HeaderProps) {
  return (
    <S.HeaderContainer>
      <S.HeaderContent>
        {/* 좌측 영역 - 뒤로가기 버튼 */}
        <S.LeftSection>
          {backHref && (
            <S.BackButton href={backHref}>
              <ChevronLeft size={24} />
            </S.BackButton>
          )}
        </S.LeftSection>

        {/* 중앙 영역 - 제목 */}
        <S.CenterSection>
          {title && <S.Title>{title}</S.Title>}
        </S.CenterSection>

        {/* 우측 영역 - 액션 버튼 */}
        <S.RightSection>{right}</S.RightSection>
      </S.HeaderContent>
    </S.HeaderContainer>
  );
}
