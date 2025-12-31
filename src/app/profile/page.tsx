"use client";

import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, ChevronRight } from "lucide-react";
import { updateMyProfile } from "@/lib/api/client";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import * as S from "./styles/page.styles";

/* =============================================
   프로필 페이지
   - 사용자 정보 표시
   - 설정 및 로그아웃
   ============================================= */

export default function ProfilePage() {
  const { profile, stats, isLoading, signOut, deleteAccount, refreshProfile } = useRequireAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
  };

  const handleProfileUpdate = async (nickname: string, avatarUrl: string | null) => {
    const result = await updateMyProfile({ nickname, avatarUrl });
    if (result.success) {
      await refreshProfile();
    }
    return result.success;
  };

  const headerRight = (
    <S.SettingsButton>
      <Settings size={20} />
    </S.SettingsButton>
  );

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.charAt(0).toUpperCase();
    return email.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <MobileLayout headerTitle="프로필">
        <S.Container>
          <S.LoadingContainer>로딩 중...</S.LoadingContainer>
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="프로필" headerRight={headerRight}>
      <S.Container>
        {/* 프로필 헤더 */}
        <S.ProfileHeader>
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || ""} alt="프로필 이미지" />
            <AvatarFallback>
              {getInitials(profile?.nickname || null, profile?.email || "U")}
            </AvatarFallback>
          </Avatar>
          <S.ProfileInfo>
            <S.ProfileName>{profile?.nickname || "닉네임을 설정해주세요"}</S.ProfileName>
            <S.ProfileEmail>{profile?.email}</S.ProfileEmail>
          </S.ProfileInfo>
          <S.EditProfileButton
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          >
            프로필 수정
          </S.EditProfileButton>
        </S.ProfileHeader>

        {/* 통계 */}
        <S.StatsCard>
          <S.StatItem>
            <S.StatValue>{stats.diaryCount}</S.StatValue>
            <S.StatLabel>작성한 일기</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>{stats.groupCount}</S.StatValue>
            <S.StatLabel>참여 그룹</S.StatLabel>
          </S.StatItem>
          <S.StatDivider />
          <S.StatItem>
            <S.StatValue>{stats.streakDays}</S.StatValue>
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

        {/* 회원 탈퇴 */}
        <S.DeleteAccountButton
          variant="ghost"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          회원 탈퇴
        </S.DeleteAccountButton>
      </S.Container>

      {/* 프로필 수정 모달 */}
      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentNickname={profile.nickname || ""}
          currentAvatarUrl={profile.avatar_url}
          onSave={handleProfileUpdate}
        />
      )}

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="회원 탈퇴"
        description="정말로 탈퇴하시겠습니까? 모든 데이터(다이어리, 그룹 등)가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다."
        confirmText="회원탈퇴"
        confirmLabel="탈퇴하려면 '회원탈퇴'를 입력하세요"
        onConfirm={handleDeleteAccount}
      />
    </MobileLayout>
  );
}
