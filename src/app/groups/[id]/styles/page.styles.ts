import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   그룹 상세 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SettingsButton = styled.button`
  /* 설정 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

export const InviteCodeBanner = styled.div`
  /* 초대 코드 배너 */
  background-color: var(--muted);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
`;

export const InviteCodeLabel = styled.span`
  /* 초대 코드 레이블 */
  font-size: 13px;
  color: var(--muted-foreground);
`;

export const InviteCodeRow = styled.div`
  /* 초대 코드 행 */
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InviteCodeText = styled.span`
  /* 초대 코드 텍스트 */
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 1px;
  color: var(--foreground);
`;

export const CopyButton = styled.button`
  /* 복사 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--muted-foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

export const WriteStatusCard = styled.div`
  /* 글쓰기 상태 카드 */
  background: linear-gradient(135deg, #7c9eb2 0%, #a8c5d8 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: white;
`;

export const WriteStatusText = styled.p`
  /* 상태 텍스트 */
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  opacity: 0.95;
`;

export const WriteButton = styled(Button)`
  /* 글쓰기 버튼 */
  background-color: white;
  color: #5a7a8a;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
  border-radius: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

export const LoadingContainer = styled.div`
  /* 로딩 컨테이너 */
  display: flex;
  justify-content: center;
  padding: 48px 0;
  color: var(--muted-foreground);
`;

export const FeedSection = styled.section`
  /* 피드 섹션 */
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const LockedFeed = styled.div`
  /* 잠긴 피드 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background-color: var(--muted);
  border-radius: 12px;
`;

export const LockedIcon = styled.div`
  /* 잠금 아이콘 */
  color: var(--muted-foreground);
  margin-bottom: 12px;
`;

export const LockedText = styled.p`
  /* 잠금 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const EmptyState = styled.div`
  /* 빈 상태 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

export const EmptyText = styled.p`
  /* 빈 상태 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
`;
