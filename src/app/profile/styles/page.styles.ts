import styled, { keyframes } from "styled-components";
import { Button } from "@/components/ui/button";

/* =============================================
   프로필 페이지 스타일
   - 타겟: 1020 여성
   - 컨셉: 미니멀 B&W 모노톤 + 세련된 타이포그래피
   ============================================= */

/* 부드러운 떠오르는 애니메이션 */
const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* 페이드인 애니메이션 */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/* 라인 드로잉 애니메이션 */
const drawLine = keyframes`
  from {
    width: 0;
  }
  to {
    width: 32px;
  }
`;

export const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const ProfileHeader = styled.div`
  /* 프로필 헤더 - 중앙 정렬 레이아웃 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px 0;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  
  /* 아바타 스타일링 */
  .w-20 {
    width: 88px;
    height: 88px;
    border: 1px solid var(--border);
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  
  /* 데코레이션 라인 */
  &::after {
    content: "";
    display: block;
    width: 32px;
    height: 1px;
    background: var(--foreground);
    margin-top: 4px;
    animation: ${drawLine} 0.6s ease-out 0.3s both;
  }
`;

export const ProfileInfo = styled.div`
  /* 프로필 정보 */
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProfileName = styled.h2`
  /* 프로필 이름 - 우아한 타이포그래피 */
  font-size: 22px;
  font-weight: 400;
  color: var(--foreground);
  letter-spacing: 0.5px;
  animation: ${fadeIn} 0.5s ease-out 0.1s both;
`;

export const ProfileEmail = styled.p`
  /* 프로필 이메일 */
  font-size: 13px;
  color: var(--muted-foreground);
  font-weight: 300;
  letter-spacing: 0.3px;
  animation: ${fadeIn} 0.5s ease-out 0.15s both;
`;

export const EditProfileButton = styled(Button)`
  /* 프로필 수정 버튼 - B&W 아웃라인 스타일 */
  height: 44px;
  padding: 0 24px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: transparent;
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  animation: ${fadeIn} 0.5s ease-out 0.2s both;
  
  &:hover {
    background: var(--foreground);
    color: var(--background);
    border-color: var(--foreground);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const StatsCard = styled.div`
  /* 통계 카드 - 미니멀 디자인 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px 20px;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  animation-delay: 0.1s;
  animation-fill-mode: both;
`;

export const StatItem = styled.div`
  /* 통계 아이템 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatValue = styled.span`
  /* 통계 값 - 라이트 웨이트 타이포그래피 */
  font-size: 24px;
  font-weight: 300;
  color: var(--foreground);
  letter-spacing: -0.5px;
`;

export const StatLabel = styled.span`
  /* 통계 라벨 */
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const StatDivider = styled.div`
  /* 통계 구분선 */
  width: 1px;
  height: 40px;
  background: var(--border);
  margin: 0 32px;
`;

export const MenuSection = styled.div`
  /* 메뉴 섹션 - 클린 리스트 스타일 */
  display: flex;
  flex-direction: column;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  animation-delay: 0.15s;
  animation-fill-mode: both;
`;

export const MenuItem = styled.button`
  /* 메뉴 아이템 - 터치 친화적 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  min-height: 52px;
  color: var(--foreground);
  background: transparent;
  transition: all 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  &:hover {
    background: var(--accent);
  }
  
  &:active {
    background: var(--accent);
    opacity: 0.8;
  }
  
  svg {
    color: var(--muted-foreground);
    opacity: 0.6;
  }
`;

export const MenuText = styled.span`
  /* 메뉴 텍스트 */
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.2px;
`;

export const MenuValue = styled.span`
  /* 메뉴 값 */
  font-size: 13px;
  color: var(--muted-foreground);
  font-weight: 300;
`;

export const LogoutButton = styled(Button)`
  /* 로그아웃 버튼 - 서브틀 스타일 */
  width: 100%;
  height: 52px;
  min-height: 44px;
  color: var(--muted-foreground);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.3px;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  animation: ${floatUp} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  animation-delay: 0.2s;
  animation-fill-mode: both;

  &:hover {
    color: var(--foreground);
    border-color: var(--foreground);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  svg {
    opacity: 0.7;
  }
`;

export const DeleteAccountButton = styled(Button)`
  /* 회원 탈퇴 버튼 - 최소화된 스타일 */
  width: 100%;
  height: 44px;
  min-height: 44px;
  color: var(--muted-foreground);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.2px;
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.5s ease-out 0.3s both;

  &:hover {
    color: var(--foreground);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

export const LoadingContainer = styled.div`
  /* 로딩 컨테이너 */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.3px;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const SettingsButton = styled.button`
  /* 설정 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--foreground);
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;
