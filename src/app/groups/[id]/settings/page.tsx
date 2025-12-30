"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import JoinRequestList from "@/components/group/JoinRequestList";
import { Camera, Copy, Check, Loader2 } from "lucide-react";
import { isValidImageFile } from "@/utils/imageConverter";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 설정 페이지 (방장 전용)
   - 그룹 이름 변경
   - 그룹 아이콘 변경
   - 초대 코드 확인
   - 가입 요청 관리
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [groupName, setGroupName] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  /* 그룹 정보 로드 */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      const {
        getGroup,
        isGroupOwner,
        isGroupMember,
        getJoinRequests,
      } = await import("@/lib/mock/services");

      /* 멤버 여부 확인 */
      if (!isGroupMember(groupId)) {
        router.replace("/groups");
        return;
      }

      /* 방장 여부 확인 - 방장만 설정 페이지 접근 가능 */
      if (!isGroupOwner(groupId)) {
        router.replace(`/groups/${groupId}`);
        return;
      }

      /* 그룹 정보 */
      const group = getGroup(groupId);
      if (group) {
        setGroupName(group.name);
        setIconUrl(group.icon_url);
        setIconPreview(group.icon_url);
        setInviteCode(group.invite_code);
      }

      /* 가입 요청 목록 */
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

      setIsLoading(false);
    };

    loadData();
  }, [groupId, router]);

  /* 아이콘 선택 처리 */
  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert("지원하지 않는 이미지 형식입니다.");
      return;
    }

    /* 미리보기 생성 */
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* 저장 */
  const handleSave = async () => {
    if (!groupName.trim()) {
      alert("그룹 이름을 입력해주세요.");
      return;
    }

    setIsSaving(true);

    const { updateGroup } = await import("@/lib/mock/services");
    const success = updateGroup(groupId, {
      name: groupName.trim(),
      iconUrl: iconPreview,
    });

    if (success) {
      router.push(`/groups/${groupId}`);
    } else {
      alert("저장에 실패했습니다.");
    }

    setIsSaving(false);
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
      <MobileLayout headerTitle="그룹 설정" headerBackHref={`/groups/${groupId}`}>
        <S.Container style={{ alignItems: "center", paddingTop: 48 }}>
          <Loader2 size={32} className="animate-spin" />
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="그룹 설정" headerBackHref={`/groups/${groupId}`}>
      <S.Container>
        {/* 그룹 아이콘 */}
        <S.Section>
          <S.SectionTitle>그룹 아이콘</S.SectionTitle>
          <S.IconPreview onClick={() => fileInputRef.current?.click()}>
            {iconPreview ? (
              <S.IconImage src={iconPreview} alt="그룹 아이콘" />
            ) : (
              <S.IconPlaceholder>
                {groupName.charAt(0).toUpperCase() || "G"}
              </S.IconPlaceholder>
            )}
            <S.IconOverlay>
              <Camera size={24} />
            </S.IconOverlay>
            <S.HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleIconSelect}
            />
          </S.IconPreview>
        </S.Section>

        {/* 그룹 이름 */}
        <S.Section>
          <S.SectionTitle>그룹 이름</S.SectionTitle>
          <S.NameInput
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="그룹 이름을 입력하세요"
          />
        </S.Section>

        {/* 저장 버튼 */}
        <S.SaveButton onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "저장"
          )}
        </S.SaveButton>

        <S.Divider />

        {/* 초대 코드 */}
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
      </S.Container>
    </MobileLayout>
  );
}
