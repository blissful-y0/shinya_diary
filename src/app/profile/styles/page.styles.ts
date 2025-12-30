import styled from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   프로필 페이지 스타일
   ============================================= */

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const ProfileHeader = styled.div`
  /* 프로필 헤더 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ProfileInfo = styled.div`
  /* 프로필 정보 */
  text-align: center;
`;

export const ProfileName = styled.h2`
  /* 프로필 이름 */
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
`;

export const ProfileEmail = styled.p`
  /* 프로필 이메일 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const EditProfileButton = styled(Button)`
  /* 프로필 수정 버튼 */
  border-radius: 20px;
  height: 36px;
  padding: 0 16px;
`;

export const StatsCard = styled.div`
  /* 통계 카드 */
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
`;

export const StatItem = styled.div`
  /* 통계 아이템 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatValue = styled.span`
  /* 통계 값 */
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
`;

export const StatLabel = styled.span`
  /* 통계 라벨 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

export const StatDivider = styled.div`
  /* 통계 구분선 */
  width: 1px;
  height: 40px;
  background-color: var(--border);
`;

export const MenuSection = styled.div`
  /* 메뉴 섹션 */
  display: flex;
  flex-direction: column;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

export const MenuItem = styled.button`
  /* 메뉴 아이템 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  &:hover {
    background-color: var(--accent);
  }
`;

export const MenuText = styled.span`
  /* 메뉴 텍스트 */
  font-size: 15px;
`;

export const MenuValue = styled.span`
  /* 메뉴 값 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

export const LogoutButton = styled(Button)`
  /* 로그아웃 버튼 */
  width: 100%;
  height: 48px;
  color: var(--destructive);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
`;
