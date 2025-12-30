"use client";

import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";

/* =============================================
   홈 페이지
   - 오늘의 다이어리 요약 표시
   - 최근 그룹 활동 미리보기
   ============================================= */

export default function HomePage() {
  return (
    <MobileLayout headerTitle="Shinya Diary">
      <Container>
        {/* 추후 구현: 오늘의 다이어리 카드 */}
        <PlaceholderCard>
          <PlaceholderTitle>오늘의 다이어리</PlaceholderTitle>
          <PlaceholderText>
            아직 오늘의 일기를 작성하지 않았어요.
            <br />
            소중한 하루를 기록해보세요.
          </PlaceholderText>
        </PlaceholderCard>

        {/* 추후 구현: 그룹 활동 피드 */}
        <SectionTitle>최근 활동</SectionTitle>
        <PlaceholderCard>
          <PlaceholderText>
            그룹에 가입하면 친구들의 일기를 볼 수 있어요.
          </PlaceholderText>
        </PlaceholderCard>
      </Container>
    </MobileLayout>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PlaceholderCard = styled.div`
  /* 플레이스홀더 카드 */
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const PlaceholderTitle = styled.h2`
  /* 카드 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 12px;
`;

const PlaceholderText = styled.p`
  /* 카드 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

const SectionTitle = styled.h3`
  /* 섹션 제목 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-top: 8px;
`;
