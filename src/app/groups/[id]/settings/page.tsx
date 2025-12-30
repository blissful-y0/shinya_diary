"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import JoinRequestList from "@/components/group/JoinRequestList";
import { Camera, Copy, Check, Loader2 } from "lucide-react";
import { isValidImageFile } from "@/utils/imageConverter";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 설정 페이지
   - 내 그룹 프로필 (모든 멤버)
   - 그룹 설정 (방장만)
   ============================================= */

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

interface JoinRequest {
  id: string;
  user: {
    nickname: string | null;
    avatar_url: string | null;
  };
  created_at: string;
}

export default function GroupSettingsPage({ params }: SettingsPageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const groupIconInputRef = useRef<HTMLInputElement>(null);
  const profileAvatarInputRef = useRef<HTMLInputElement>(null);

  /* 그룹 설정 (방장용) */
  const [isOwner, setIsOwner] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupIconPreview, setGroupIconPreview] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);

  /* 내 그룹 프로필 */
  const [myNickname, setMyNickname] = useState("");
  const [myAvatarPreview, setMyAvatarPreview] = useState<string | null>(null);

  /* 상태 */
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  /* 데이터 로드 */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const {
        getGroup,
        isGroupOwner,
        isGroupMember,
        getMyGroupProfile,
        getJoinRequests,
      } = await import("@/lib/mock/services");

      /* 멤버 여부 확인 */
      if (!isGroupMember(groupId)) {
        router.replace("/groups");
        return;
      }

      /* 방장 여부 확인 */
      const ownerStatus = isGroupOwner(groupId);
      setIsOwner(ownerStatus);

      /* 그룹 정보 */
      const group = getGroup(groupId);
      if (group) {
        setGroupName(group.name);
        setGroupIconPreview(group.icon_url);
        setInviteCode(group.invite_code);
      }

      /* 내 그룹 프로필 */
      const myProfile = getMyGroupProfile(groupId);
      if (myProfile) {
        setMyNickname(myProfile.nickname || "");
        setMyAvatarPreview(myProfile.avatar_url);
      }

      /* 방장이면 가입 요청 목록 조회 */
      if (ownerStatus) {
        const requests = getJoinRequests(groupId);
        setJoinRequests(
          requests.map((r) => ({
            id: r.id,
            user: {
              nickname: r.user.nickname,
              avatar_url: r.user.avatar_url,
            },
            created_at: r.created_at,
          }))
        );
      }

      setIsLoading(false);
    };

    loadData();
  }, [groupId, router]);

  /* 프로필 아바타 선택 */
  const handleProfileAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert("지원하지 않는 이미지 형식입니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setMyAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 그룹 아이콘 선택 */
  const handleGroupIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert("지원하지 않는 이미지 형식입니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setGroupIconPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 내 프로필 저장 */
  const handleSaveProfile = async () => {
    if (!myNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    setIsSavingProfile(true);

    const { updateMyGroupProfile } = await import("@/lib/mock/services");
    const success = updateMyGroupProfile(groupId, {
      nickname: myNickname.trim(),
      avatarUrl: myAvatarPreview,
    });

    if (success) {
      alert("프로필이 저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }

    setIsSavingProfile(false);
  };

  /* 그룹 설정 저장 */
  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      alert("그룹 이름을 입력해주세요.");
      return;
    }

    setIsSavingGroup(true);

    const { updateGroup } = await import("@/lib/mock/services");
    const success = updateGroup(groupId, {
      name: groupName.trim(),
      iconUrl: groupIconPreview,
    });

    if (success) {
      alert("그룹 설정이 저장되었습니다.");
    } else {
      alert("저장에 실패했습니다.");
    }

    setIsSavingGroup(false);
  };

  /* 초대 코드 복사 */
  const handleCopyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  /* 가입 요청 승인 */
  const handleApproveRequest = async (requestId: string) => {
    const { approveJoinRequest } = await import("@/lib/mock/services");
    const success = approveJoinRequest(requestId);
    if (success) {
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  /* 가입 요청 거절 */
  const handleRejectRequest = async (requestId: string) => {
    const { rejectJoinRequest } = await import("@/lib/mock/services");
    const success = rejectJoinRequest(requestId);
    if (success) {
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  if (isLoading) {
    return (
      <MobileLayout headerTitle="설정" headerBackHref={`/groups/${groupId}`}>
        <S.Container style={{ alignItems: "center", paddingTop: 48 }}>
          <Loader2 size={32} className="animate-spin" />
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="설정" headerBackHref={`/groups/${groupId}`}>
      <S.Container>
        {/* ========== 내 그룹 프로필 ========== */}
        <S.SectionHeader>내 그룹 프로필</S.SectionHeader>

        <S.IconSection>
          <S.IconPreview onClick={() => profileAvatarInputRef.current?.click()}>
            {myAvatarPreview ? (
              <S.IconImage src={myAvatarPreview} alt="내 프로필" />
            ) : (
              <S.IconPlaceholder>
                {myNickname.charAt(0).toUpperCase() || "?"}
              </S.IconPlaceholder>
            )}
            <S.IconOverlay>
              <Camera size={24} />
            </S.IconOverlay>
            <S.HiddenInput
              ref={profileAvatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileAvatarSelect}
            />
          </S.IconPreview>
        </S.IconSection>

        <S.Section>
          <S.SectionTitle>닉네임</S.SectionTitle>
          <S.NameInput
            value={myNickname}
            onChange={(e) => setMyNickname(e.target.value)}
            placeholder="이 그룹에서 사용할 닉네임"
          />
        </S.Section>

        <S.SaveButton onClick={handleSaveProfile} disabled={isSavingProfile}>
          {isSavingProfile ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "프로필 저장"
          )}
        </S.SaveButton>

        {/* ========== 초대 코드 (모든 멤버) ========== */}
        <S.Divider />

        <S.Section>
          <S.SectionTitle>초대 코드</S.SectionTitle>
          <S.InviteCodeCard>
            <S.InviteCodeText>{inviteCode}</S.InviteCodeText>
            <S.CopyButton variant="outline" size="sm" onClick={handleCopyInviteCode}>
              {codeCopied ? <Check size={16} /> : <Copy size={16} />}
              {codeCopied ? "복사됨" : "복사"}
            </S.CopyButton>
          </S.InviteCodeCard>
        </S.Section>

        {/* ========== 그룹 설정 (방장만) ========== */}
        {isOwner && (
          <>
            <S.Divider />

            <S.SectionHeader>그룹 관리</S.SectionHeader>

            <S.IconSection>
              <S.SectionTitle>그룹 아이콘</S.SectionTitle>
              <S.IconPreview onClick={() => groupIconInputRef.current?.click()}>
                {groupIconPreview ? (
                  <S.IconImage src={groupIconPreview} alt="그룹 아이콘" />
                ) : (
                  <S.IconPlaceholder>
                    {groupName.charAt(0).toUpperCase() || "G"}
                  </S.IconPlaceholder>
                )}
                <S.IconOverlay>
                  <Camera size={24} />
                </S.IconOverlay>
                <S.HiddenInput
                  ref={groupIconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGroupIconSelect}
                />
              </S.IconPreview>
            </S.IconSection>

            <S.Section>
              <S.SectionTitle>그룹 이름</S.SectionTitle>
              <S.NameInput
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="그룹 이름을 입력하세요"
              />
            </S.Section>

            <S.SaveButton onClick={handleSaveGroup} disabled={isSavingGroup}>
              {isSavingGroup ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "그룹 설정 저장"
              )}
            </S.SaveButton>

            <S.Divider />

            {/* 가입 요청 관리 */}
            <S.JoinRequestSection>
              <S.JoinRequestHeader>
                <S.SectionTitle>가입 요청</S.SectionTitle>
                {joinRequests.length > 0 && (
                  <S.RequestCount>{joinRequests.length}</S.RequestCount>
                )}
              </S.JoinRequestHeader>

              {joinRequests.length > 0 ? (
                <JoinRequestList
                  requests={joinRequests}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                />
              ) : (
                <S.EmptyRequests>대기 중인 가입 요청이 없습니다</S.EmptyRequests>
              )}
            </S.JoinRequestSection>
          </>
        )}
      </S.Container>
    </MobileLayout>
  );
}
