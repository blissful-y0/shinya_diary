"use client";

import MobileLayout from "@/components/layout/MobileLayout";
import * as S from "./styles/page.styles";

/* =============================================
   홈 페이지
   - 오늘의 다이어리 요약 표시
   - 최근 그룹 활동 미리보기
   ============================================= */

export default function HomePage() {
  return (
    <MobileLayout headerTitle="Shinya Diary">
      <S.Container>
        {/* 추후 구현: 오늘의 다이어리 카드 */}
        <S.PlaceholderCard>
          <S.PlaceholderTitle>오늘의 다이어리</S.PlaceholderTitle>
          <S.PlaceholderText>
            아직 오늘의 일기를 작성하지 않았어요.
            <br />
            소중한 하루를 기록해보세요.
          </S.PlaceholderText>
        </S.PlaceholderCard>

        {/* 추후 구현: 그룹 활동 피드 */}
        <S.SectionTitle>최근 활동</S.SectionTitle>
        <S.PlaceholderCard>
          <S.PlaceholderText>
            그룹에 가입하면 친구들의 일기를 볼 수 있어요.
          </S.PlaceholderText>
        </S.PlaceholderCard>
      </S.Container>
    </MobileLayout>
  );
}
