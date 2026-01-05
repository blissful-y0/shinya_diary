"use client";

export const runtime = "edge";

import { use, useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";
import JoinRequestList from "@/components/group/JoinRequestList";
import MemberList from "@/components/group/MemberList";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Copy, Check, Loader2, Trash2, Image } from "lucide-react";
import { isValidImageFile } from "@/lib/utils/image";
import {
  updateGroup,
  updateGroupProfile,
  deleteGroup,
  removeMember,
  handleJoinRequest,
  uploadImage,
  type GroupMember,
  type JoinRequest,
} from "@/lib/api/client";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { useGroup, useGroupMembers, useJoinRequests } from "@/lib/swr/hooks";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 설정 페이지
   - 내 프로필 탭 (모든 멤버)
   - 그룹 관리 탭 (방장만)
   ============================================= */

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function GroupSettingsPage({ params }: SettingsPageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const { profile, isLoading: authLoading } = useRequireAuth();
  const groupIconInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const profileAvatarInputRef = useRef<HTMLInputElement>(null);

  /* SWR Hooks - 자동 캐싱 및 중복 요청 방지 */
  const { group, isLoading: groupLoading, isError: groupError, mutate: mutateGroup } = useGroup(groupId);
  const { members: membersList, isLoading: membersLoading, mutate: mutateMembers } = useGroupMembers(groupId);
  const { requests: joinRequestsList, isLoading: requestsLoading, mutate: mutateRequests } = useJoinRequests(
    profile && group?.owner_id === profile.id ? groupId : null
  );

  /* 그룹 설정 (방장용) */
  const [groupName, setGroupName] = useState("");
  const [groupIconFile, setGroupIconFile] = useState<File | null>(null);
  const [groupIconPreview, setGroupIconPreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  /* 내 그룹 프로필 */
  const [myNickname, setMyNickname] = useState("");
  const [myAvatarFile, setMyAvatarFile] = useState<File | null>(null);
  const [myAvatarPreview, setMyAvatarPreview] = useState<string | null>(null);

  /* 상태 */
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  /* 다이얼로그 상태 */
  const [removeMemberDialog, setRemoveMemberDialog] = useState<{
    open: boolean;
    memberId: string;
    nickname: string;
  }>({ open: false, memberId: "", nickname: "" });
  const [deleteGroupDialog, setDeleteGroupDialog] = useState(false);

  /* 계산된 값들 - useMemo로 최적화 */
  const isOwner = useMemo(() => {
    return !!profile && !!group && group.owner_id === profile.id;
  }, [profile, group]);

  const members = useMemo(() => {
    if (!membersList || !group) return [];
    return membersList.map((m: GroupMember) => ({
      id: m.user_id,
      nickname: m.nickname,
      avatar_url: m.avatar_url,
      joined_at: m.joined_at,
      isOwner: m.user_id === group.owner_id,
    }));
  }, [membersList, group]);

  const joinRequests = useMemo(() => {
    if (!joinRequestsList) return [];
    return joinRequestsList.map((r: JoinRequest) => ({
      id: r.id,
      user: {
        nickname: r.user.nickname,
        avatar_url: r.user.avatar_url,
      },
      created_at: r.created_at,
    }));
  }, [joinRequestsList]);

  const isLoading = authLoading || groupLoading || membersLoading;

  /* 그룹 에러 처리 */
  useEffect(() => {
    if (groupError) {
      toast.error("그룹을 찾을 수 없습니다");
      router.replace("/groups");
    }
  }, [groupError, router]);

  /* 그룹 정보 초기화 */
  useEffect(() => {
    if (group) {
      setGroupName(group.name);
      setGroupIconPreview(group.icon_url);
      setCoverImagePreview(group.cover_image_url);
    }
  }, [group]);

  /* 내 프로필 초기화 */
  useEffect(() => {
    if (membersList && profile) {
      const myProfile = membersList.find((m: GroupMember) => m.user_id === profile.id);
      if (myProfile) {
        setMyNickname(myProfile.nickname || "");
        setMyAvatarPreview(myProfile.avatar_url);
      }
    }
  }, [membersList, profile]);

  /* 프로필 아바타 선택 */
  const handleProfileAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("지원하지 않는 이미지 형식입니다.");
      return;
    }

    setMyAvatarFile(file);
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
      toast.error("지원하지 않는 이미지 형식입니다.");
      return;
    }

    setGroupIconFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setGroupIconPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 커버 이미지 선택 */
  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error("지원하지 않는 이미지 형식입니다.");
      return;
    }

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 내 프로필 저장 */
  const handleSaveProfile = async () => {
    if (!myNickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }

    if (!profile) return;

    setIsSavingProfile(true);

    try {
      let avatarUrl = myAvatarPreview;

      if (myAvatarFile) {
        const uploadRes = await uploadImage(myAvatarFile, "avatars");
        if (uploadRes.success && uploadRes.data) {
          avatarUrl = uploadRes.data.url;
        }
      }

      const res = await updateGroupProfile(groupId, profile.id, {
        nickname: myNickname.trim(),
        avatarUrl,
      });

      if (res.success) {
        toast.success("프로필이 저장되었습니다.");
      } else {
        toast.error("저장에 실패했습니다.");
      }
    } catch {
      toast.error("저장에 실패했습니다.");
    }

    setIsSavingProfile(false);
  };

  /* 그룹 설정 저장 */
  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      toast.error("그룹 이름을 입력해주세요.");
      return;
    }

    setIsSavingGroup(true);

    try {
      let iconUrl = groupIconPreview;
      let coverUrl = coverImagePreview;

      if (groupIconFile) {
        const uploadRes = await uploadImage(groupIconFile, "group-icons");
        if (uploadRes.success && uploadRes.data) {
          iconUrl = uploadRes.data.url;
        }
      }

      if (coverImageFile) {
        const uploadRes = await uploadImage(coverImageFile, "group-covers");
        if (uploadRes.success && uploadRes.data) {
          coverUrl = uploadRes.data.url;
        }
      }

      const res = await updateGroup(groupId, {
        name: groupName.trim(),
        iconUrl,
        coverImageUrl: coverUrl,
      });

      if (res.success) {
        // SWR mutate로 자동 재검증
        mutateGroup();
        toast.success("그룹 설정이 저장되었습니다.");
      } else {
        toast.error("저장에 실패했습니다.");
      }
    } catch {
      toast.error("저장에 실패했습니다.");
    }

    setIsSavingGroup(false);
  };

  /* 초대 코드 복사 */
  const handleCopyInviteCode = async () => {
    if (!group?.invite_code) return;
    await navigator.clipboard.writeText(group.invite_code);
    setCodeCopied(true);
    toast.success("초대 코드가 복사되었습니다.");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  /* 가입 요청 승인 */
  const handleApproveRequest = async (requestId: string) => {
    const request = joinRequests.find((r: JoinRequest) => r.id === requestId);
    const nickname = request?.user.nickname || "새 멤버";

    const res = await handleJoinRequest(groupId, requestId, "approve", nickname);
    if (res.success) {
      // SWR mutate로 자동 재검증 (캐시 활용, 중복 요청 방지)
      mutateRequests();
      mutateMembers();
      toast.success("가입 요청을 승인했습니다.");
    }
  };

  /* 가입 요청 거절 */
  const handleRejectRequest = async (requestId: string) => {
    const res = await handleJoinRequest(groupId, requestId, "reject");
    if (res.success) {
      // SWR mutate로 자동 재검증
      mutateRequests();
      toast.success("가입 요청을 거절했습니다.");
    }
  };

  /* 멤버 강퇴 다이얼로그 열기 */
  const handleRemoveMemberClick = (memberId: string, nickname: string) => {
    setRemoveMemberDialog({ open: true, memberId, nickname });
  };

  /* 멤버 강퇴 실행 */
  const handleRemoveMember = async () => {
    const res = await removeMember(groupId, removeMemberDialog.memberId);
    if (res.success) {
      // SWR mutate로 자동 재검증
      mutateMembers();
      toast.success(`${removeMemberDialog.nickname}님을 강퇴했습니다.`);
      setRemoveMemberDialog({ open: false, memberId: "", nickname: "" });
    } else {
      toast.error("강퇴에 실패했습니다.");
    }
  };

  /* 그룹 삭제 실행 */
  const handleDeleteGroup = async () => {
    setIsDeleting(true);

    const res = await deleteGroup(groupId);

    if (res.success) {
      toast.success("그룹이 삭제되었습니다.");
      router.replace("/groups");
    } else {
      toast.error("삭제에 실패했습니다.");
      setIsDeleting(false);
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
      <S.TabsContainer>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              내 프로필
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="management" className="flex-1">
                그룹 관리
              </TabsTrigger>
            )}
          </TabsList>

          {/* ========== 내 프로필 탭 ========== */}
          <TabsContent value="profile">
            <S.TabContent>
              <S.IconSection>
                <S.IconPreview
                  onClick={() => profileAvatarInputRef.current?.click()}
                >
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

              <S.Divider />

              <S.Section>
                <S.SectionTitle>초대 코드</S.SectionTitle>
                <S.InviteCodeCard>
                  <S.InviteCodeText>{group?.invite_code || ""}</S.InviteCodeText>
                  <S.CopyButton
                    variant="outline"
                    size="sm"
                    onClick={handleCopyInviteCode}
                  >
                    {codeCopied ? <Check size={16} /> : <Copy size={16} />}
                    {codeCopied ? "복사됨" : "복사"}
                  </S.CopyButton>
                </S.InviteCodeCard>
              </S.Section>
            </S.TabContent>
          </TabsContent>

          {/* ========== 그룹 관리 탭 (방장만) ========== */}
          {isOwner && (
            <TabsContent value="management">
              <S.TabContent>
                {/* 그룹 정보 */}
                <S.SectionHeader>그룹 정보</S.SectionHeader>

                <S.SectionTitle>그룹 아이콘</S.SectionTitle>
                {/* 그룹 아이콘 */}
                <S.IconSection>
                  <S.IconPreview
                    onClick={() => groupIconInputRef.current?.click()}
                  >
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
                  <S.ImageHint>권장 사이즈: 200 x 200px</S.ImageHint>
                </S.IconSection>

                {/* 커버 이미지 */}
                <S.CoverImageSection>
                  <S.SectionTitle>커버 이미지</S.SectionTitle>
                  <S.CoverImagePreview
                    onClick={() => coverImageInputRef.current?.click()}
                  >
                    {coverImagePreview ? (
                      <S.CoverImage src={coverImagePreview} alt="커버 이미지" />
                    ) : (
                      <S.CoverImagePlaceholder>
                        <Image size={32} />
                        클릭하여 커버 이미지 추가
                      </S.CoverImagePlaceholder>
                    )}
                    <S.IconOverlay>
                      <Camera size={24} />
                    </S.IconOverlay>
                    <S.HiddenInput
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageSelect}
                    />
                  </S.CoverImagePreview>
                  <S.ImageHint>권장 사이즈: 800 x 400px</S.ImageHint>
                </S.CoverImageSection>

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
                    "그룹 정보 저장"
                  )}
                </S.SaveButton>

                <S.Divider />

                {/* 멤버 관리 */}
                <S.SectionHeader>
                  멤버 관리
                  <S.MemberCount>{members.length}/4명</S.MemberCount>
                </S.SectionHeader>

                <MemberList
                  members={members}
                  canManage={true}
                  onRemove={handleRemoveMemberClick}
                />

                <S.Divider />

                {/* 가입 요청 */}
                <S.JoinRequestSection>
                  <S.JoinRequestHeader>
                    <S.SectionHeader>가입 요청</S.SectionHeader>
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
                    <S.EmptyRequests>
                      대기 중인 가입 요청이 없습니다
                    </S.EmptyRequests>
                  )}
                </S.JoinRequestSection>

                <S.Divider />

                {/* 위험 구역 */}
                <S.DangerZone>
                  <S.DangerTitle>위험 구역</S.DangerTitle>
                  <S.DangerDescription>
                    그룹을 삭제하면 모든 다이어리와 멤버 정보가 영구적으로
                    삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </S.DangerDescription>
                  <S.DeleteButton
                    variant="destructive"
                    onClick={() => setDeleteGroupDialog(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Trash2 size={18} />
                        그룹 삭제
                      </>
                    )}
                  </S.DeleteButton>
                </S.DangerZone>
              </S.TabContent>
            </TabsContent>
          )}
        </Tabs>
      </S.TabsContainer>

      {/* 멤버 강퇴 확인 다이얼로그 */}
      <ConfirmDialog
        open={removeMemberDialog.open}
        onOpenChange={(open) =>
          setRemoveMemberDialog((prev) => ({ ...prev, open }))
        }
        title="멤버 강퇴"
        description={`${removeMemberDialog.nickname}님을 그룹에서 강퇴하시겠습니까?`}
        confirmText="강퇴"
        variant="destructive"
        onConfirm={handleRemoveMember}
      />

      {/* 그룹 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={deleteGroupDialog}
        onOpenChange={setDeleteGroupDialog}
        title="그룹 삭제"
        description="그룹을 삭제하면 모든 다이어리와 멤버 정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        confirmText={groupName}
        confirmLabel="삭제하려면 그룹 이름을 정확히 입력하세요"
        onConfirm={handleDeleteGroup}
      />
    </MobileLayout>
  );
}
