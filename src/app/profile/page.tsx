"use client";

import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "@/lib/supabase/auth";
import * as S from "./styles/page.styles";

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
    <S.SettingsButton>
      <Settings size={20} />
    </S.SettingsButton>
  );

  return (
    <MobileLayout headerTitle="프로필" headerRight={headerRight}>
      <S.Container>
        {/* 프로필 헤더 */}
        <S.ProfileHeader>
          <Avatar className="w-20 h-20">
            <AvatarImage src="" alt="프로필 이미지" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <S.ProfileInfo>
            <S.ProfileName>로그인이 필요해요</S.ProfileName>
            <S.ProfileEmail>로그인 후 프로필을 확인하세요</S.ProfileEmail>
          </S.ProfileInfo>
          <S.EditProfileButton variant="outline" size="sm">
            프로필 수정
          </S.EditProfileButton>
        </S.ProfileHeader>

        {/* 통계 */}
        <S.StatsCard>
          <S.StatItem>
            <S.StatValue>0</S.StatValue>
            <S.StatLabel>작성한 일기</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>0</S.StatValue>
            <S.StatLabel>참여 그룹</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>0</S.StatValue>
            <S.StatLabel>연속 작성</S.StatLabel>
          </S.StatItem>
        </S.StatsCard>

        {/* 메뉴 리스트 */}
        <S.MenuSection>
          <S.MenuItem>
            <S.MenuText>알림 설정</S.MenuText>
            <ChevronRight size={18} />
          </S.MenuItem>
          <S.MenuItem>
            <S.MenuText>이용약관</S.MenuText>
            <ChevronRight size={18} />
          </S.MenuItem>
          <S.MenuItem>
            <S.MenuText>개인정보처리방침</S.MenuText>
            <ChevronRight size={18} />
          </S.MenuItem>
          <S.MenuItem>
            <S.MenuText>버전 정보</S.MenuText>
            <S.MenuValue>1.0.0</S.MenuValue>
          </S.MenuItem>
        </S.MenuSection>

        {/* 로그아웃 */}
        <S.LogoutButton variant="ghost" onClick={handleLogout}>
          <LogOut size={18} />
          로그아웃
        </S.LogoutButton>
      </S.Container>
    </MobileLayout>
  );
}
