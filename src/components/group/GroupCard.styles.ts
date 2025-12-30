import styled from "styled-components";
import Link from "next/link";

/* =============================================
   GroupCard 스타일
   - 그룹 카드 레이아웃
   ============================================= */

export const CardLink = styled(Link)`
  /* 카드 링크 */
  display: block;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const CoverImage = styled.img`
  /* 커버 이미지 */
  width: 100%;
  height: 80px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  /* 카드 내용 */
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

export const GroupIcon = styled.div<{ $hasImage?: boolean }>`
  /* 그룹 아이콘 */
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $hasImage }) => ($hasImage ? "transparent" : "var(--muted)")};
  border-radius: 12px;
  color: var(--muted-foreground);
  overflow: hidden;
  flex-shrink: 0;
`;

export const IconImage = styled.img`
  /* 아이콘 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const GroupInfo = styled.div`
  /* 그룹 정보 */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const GroupNameRow = styled.div`
  /* 그룹 이름 행 */
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GroupName = styled.span`
  /* 그룹 이름 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
`;

export const OwnerBadge = styled.span`
  /* 방장 뱃지 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
`;

export const MemberCount = styled.span`
  /* 멤버 수 */
  font-size: 13px;
  color: var(--muted-foreground);
`;

export const RightSection = styled.div`
  /* 우측 섹션 */
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
`;

export const PendingDot = styled.div`
  /* 대기 중 표시 */
  width: 8px;
  height: 8px;
  background-color: var(--destructive);
  border-radius: 50%;
`;
