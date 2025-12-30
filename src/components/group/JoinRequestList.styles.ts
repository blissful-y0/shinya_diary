import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   JoinRequestList 스타일
   - 가입 요청 목록 레이아웃
   ============================================= */

export const Container = styled.div`
  /* 컨테이너 */
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
`;

export const Title = styled.h3`
  /* 제목 */
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
  background-color: var(--muted);
  border-bottom: 1px solid var(--border);
`;

export const RequestList = styled.div`
  /* 요청 목록 */
  display: flex;
  flex-direction: column;
`;

export const RequestItem = styled.div`
  /* 요청 아이템 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }
`;

export const UserInfo = styled.div`
  /* 사용자 정보 */
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserName = styled.span`
  /* 사용자 이름 */
  font-size: 15px;
  font-weight: 500;
  color: var(--foreground);
`;

export const Actions = styled.div`
  /* 액션 버튼 */
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
`;

export const RejectButton = styled(Button)`
  /* 거절 버튼 */
  width: 32px;
  height: 32px;
  padding: 0;
  color: var(--destructive);
`;

export const ApproveButton = styled(Button)`
  /* 승인 버튼 */
  width: 32px;
  height: 32px;
  padding: 0;
`;
