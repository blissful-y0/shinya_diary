"use client";

import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "@/lib/supabase/auth";

/* =============================================
   프로필 페이지
   - 사용자 정보 표시
   - 설정 및 로그아웃
   ============================================= */

export default function ProfilePage() {
  /* 로그아웃 핸들러 */
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  /* 설정 버튼 */
  const headerRight = (
    <SettingsButton>
      <Settings size={20} />
    </SettingsButton>
  );

  return (
    <MobileLayout headerTitle="프로필" headerRight={headerRight}>
      <Container>
        {/* 프로필 헤더 */}
        <ProfileHeader>
          <Avatar className="w-20 h-20">
            <AvatarImage src="" alt="프로필 이미지" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <ProfileInfo>
            <ProfileName>로그인이 필요해요</ProfileName>
            <ProfileEmail>로그인 후 프로필을 확인하세요</ProfileEmail>
          </ProfileInfo>
          <EditProfileButton variant="outline" size="sm">
            프로필 수정
          </EditProfileButton>
        </ProfileHeader>

        {/* 통계 */}
        <StatsCard>
          <StatItem>
            <StatValue>0</StatValue>
            <StatLabel>작성한 일기</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatValue>0</StatValue>
            <StatLabel>참여 그룹</StatLabel>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatValue>0</StatValue>
            <StatLabel>연속 작성</StatLabel>
          </StatItem>
        </StatsCard>

        {/* 메뉴 리스트 */}
        <MenuSection>
          <MenuItem>
            <MenuText>알림 설정</MenuText>
            <ChevronRight size={18} />
          </MenuItem>
          <MenuItem>
            <MenuText>이용약관</MenuText>
            <ChevronRight size={18} />
          </MenuItem>
          <MenuItem>
            <MenuText>개인정보처리방침</MenuText>
            <ChevronRight size={18} />
          </MenuItem>
          <MenuItem>
            <MenuText>버전 정보</MenuText>
            <MenuValue>1.0.0</MenuValue>
          </MenuItem>
        </MenuSection>

        {/* 로그아웃 */}
        <LogoutButton variant="ghost" onClick={handleLogout}>
          <LogOut size={18} />
          로그아웃
        </LogoutButton>
      </Container>
    </MobileLayout>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SettingsButton = styled.button`
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

const ProfileHeader = styled.div`
  /* 프로필 헤더 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ProfileInfo = styled.div`
  /* 프로필 정보 */
  text-align: center;
`;

const ProfileName = styled.h2`
  /* 프로필 이름 */
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
`;

const ProfileEmail = styled.p`
  /* 프로필 이메일 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

const EditProfileButton = styled(Button)`
  /* 프로필 수정 버튼 */
  border-radius: 20px;
  height: 36px;
  padding: 0 16px;
`;

const StatsCard = styled.div`
  /* 통계 카드 */
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
`;

const StatItem = styled.div`
  /* 통계 아이템 */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.span`
  /* 통계 값 */
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
`;

const StatLabel = styled.span`
  /* 통계 라벨 */
  font-size: 12px;
  color: var(--muted-foreground);
`;

const StatDivider = styled.div`
  /* 통계 구분선 */
  width: 1px;
  height: 40px;
  background-color: var(--border);
`;

const MenuSection = styled.div`
  /* 메뉴 섹션 */
  display: flex;
  flex-direction: column;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
`;

const MenuItem = styled.button`
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

const MenuText = styled.span`
  /* 메뉴 텍스트 */
  font-size: 15px;
`;

const MenuValue = styled.span`
  /* 메뉴 값 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

const LogoutButton = styled(Button)`
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
