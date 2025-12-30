import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   그룹 목록 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ActionButtons = styled.div`
  /* 액션 버튼 그룹 */
  display: flex;
  gap: 12px;
`;

export const ActionButton = styled(Button)`
  /* 액션 버튼 */
  flex: 1;
  height: 48px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
`;

export const GroupList = styled.div`
  /* 그룹 리스트 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LoadingText = styled.p`
  /* 로딩 텍스트 */
  text-align: center;
  padding: 48px 0;
  color: var(--muted-foreground);
`;

export const EmptyState = styled.div`
  /* 빈 상태 표시 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  /* 빈 상태 아이콘 */
  color: var(--muted-foreground);
  margin-bottom: 16px;
`;

export const EmptyTitle = styled.h3`
  /* 빈 상태 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
`;

export const EmptyText = styled.p`
  /* 빈 상태 설명 */
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;
