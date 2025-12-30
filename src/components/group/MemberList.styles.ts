import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   MemberList 스타일
   - 그룹 멤버 목록 및 관리
   ============================================= */

export const Container = styled.div`
  /* 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MemberCard = styled.div`
  /* 멤버 카드 */
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
`;

export const Avatar = styled.div`
  /* 아바타 */
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const AvatarImage = styled.img`
  /* 아바타 이미지 */
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.span`
  /* 아바타 플레이스홀더 */
  font-size: 18px;
  font-weight: 600;
  color: var(--muted-foreground);
`;

export const MemberInfo = styled.div`
  /* 멤버 정보 */
  flex: 1;
  min-width: 0;
`;

export const NicknameRow = styled.div`
  /* 닉네임 행 */
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Nickname = styled.span`
  /* 닉네임 */
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const OwnerBadge = styled.span`
  /* 방장 뱃지 */
  font-size: 10px;
  font-weight: 600;
  color: var(--primary-foreground);
  background-color: var(--primary);
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
`;

export const JoinedAt = styled.span`
  /* 가입일 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const RemoveButton = styled(Button)`
  /* 강퇴 버튼 */
  flex-shrink: 0;
`;

export const EmptyState = styled.p`
  /* 빈 상태 */
  font-size: 14px;
  color: var(--muted-foreground);
  text-align: center;
  padding: 24px;
  background-color: var(--muted);
  border-radius: 12px;
`;
