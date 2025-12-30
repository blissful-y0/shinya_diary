import styled from "styled-components";

/* =============================================
   홈 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const PlaceholderCard = styled.div`
  /* 플레이스홀더 카드 */
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

export const PlaceholderTitle = styled.h2`
  /* 카드 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 12px;
`;

export const PlaceholderText = styled.p`
  /* 카드 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;

export const SectionTitle = styled.h3`
  /* 섹션 제목 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin-top: 8px;
`;
