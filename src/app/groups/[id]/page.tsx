"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import JoinRequestList from "@/components/group/JoinRequestList";
import { Settings, PenSquare, Lock, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { formatDateISO, isToday } from "@/utils/date";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 상세 페이지 (피드)
   - 날짜별 다이어리 피드
   - Read-after-Write 잠금 로직 적용
   - 방장: 가입 요청 관리
   ============================================= */

interface GroupDetailPageProps {
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

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState<
    {
      id: string;
      nickname: string;
      avatarUrl: string | null;
      imageUrl: string | null;
      content: string | null;
      createdAt: string;
      isOwn: boolean;
    }[]
  >([]);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  /* 그룹 정보 및 다이어리 목록 로드 */
  const loadData = useCallback(async () => {
    setIsLoading(true);

    const {
      getGroup,
      isGroupOwner,
      isGroupMember,
      getJoinRequests,
      getDiariesByDate,
      checkTodayDiary,
      getCurrentUser,
    } = await import("@/lib/mock/services");

    /* 멤버 여부 확인 - 비멤버는 그룹 목록으로 리다이렉트 */
    if (!isGroupMember(groupId)) {
      router.replace("/groups");
      return;
    }

    /* 그룹 정보 */
    const group = getGroup(groupId);
    if (group) {
      setGroupName(group.name);
      setInviteCode(group.invite_code);
    }

    /* 방장 여부 확인 */
    const ownerStatus = isGroupOwner(groupId);
    setIsOwner(ownerStatus);

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

    /* 날짜별 다이어리 조회 */
    const dateStr = formatDateISO(selectedDate);
    const currentUser = getCurrentUser();

    /* 오늘 날짜인 경우 작성 여부 확인 */
    if (isToday(selectedDate)) {
      const written = checkTodayDiary(groupId, dateStr);
      setHasWrittenToday(written);
    } else {
      setHasWrittenToday(true);
    }

    /* 다이어리 목록 */
    const diaryData = getDiariesByDate(groupId, dateStr);
    setDiaries(
      diaryData.map((d) => ({
        id: d.id,
        nickname: d.author.nickname,
        avatarUrl: d.author.avatar_url,
        imageUrl: d.image_url,
        content: d.content,
        createdAt: d.created_at,
        isOwn: d.user_id === currentUser.id,
      }))
    );

    setIsLoading(false);
  }, [groupId, selectedDate, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  /* 다이어리 삭제 */
  const handleDeleteDiary = async (diaryId: string) => {
    if (!confirm("일기를 삭제하시겠습니까?")) return;

    const { deleteDiary } = await import("@/lib/mock/services");
    const success = deleteDiary(diaryId);
    if (success) {
      setDiaries((prev) => prev.filter((d) => d.id !== diaryId));
    }
  };

  /* 초대 코드 복사 */
  const handleCopyInviteCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  /* 설정 버튼 */
  const headerRight = (
    <S.SettingsButton onClick={() => setShowInviteCode(!showInviteCode)}>
      <Settings size={20} />
    </S.SettingsButton>
  );

  const showLocked = isToday(selectedDate) && !hasWrittenToday;

  return (
    <MobileLayout
      headerTitle={groupName || "그룹"}
      headerBackHref="/groups"
      headerRight={headerRight}
    >
      {/* 초대 코드 표시 (토글) */}
      {showInviteCode && (
        <S.InviteCodeBanner>
          <S.InviteCodeLabel>초대 코드</S.InviteCodeLabel>
          <S.InviteCodeRow>
            <S.InviteCodeText>{inviteCode}</S.InviteCodeText>
            <S.CopyButton onClick={handleCopyInviteCode}>
              {codeCopied ? <Check size={16} /> : <Copy size={16} />}
            </S.CopyButton>
          </S.InviteCodeRow>
        </S.InviteCodeBanner>
      )}

      {/* 날짜 선택 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <S.Container>
        {/* 방장: 가입 요청 목록 */}
        {isOwner && joinRequests.length > 0 && (
          <JoinRequestList
            requests={joinRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}

        {/* 오늘이고 아직 작성 안 한 경우: 글쓰기 유도 */}
        {isToday(selectedDate) && !hasWrittenToday && (
          <S.WriteStatusCard>
            <S.WriteStatusText>
              오늘의 일기를 작성하면
              <br />
              친구들의 일기를 볼 수 있어요!
            </S.WriteStatusText>
            <S.WriteButton asChild>
              <Link href={`/groups/${groupId}/write`}>
                <PenSquare size={18} />
                오늘의 일기 쓰기
              </Link>
            </S.WriteButton>
          </S.WriteStatusCard>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <S.LoadingContainer>
            <Loader2 size={32} className="animate-spin" />
          </S.LoadingContainer>
        )}

        {/* 피드 섹션 */}
        {!isLoading && (
          <S.FeedSection>
            {showLocked ? (
              /* 잠긴 상태 */
              <S.LockedFeed>
                <S.LockedIcon>
                  <Lock size={32} />
                </S.LockedIcon>
                <S.LockedText>일기를 작성하면 잠금이 해제됩니다</S.LockedText>
              </S.LockedFeed>
            ) : diaries.length > 0 ? (
              /* 다이어리 목록 */
              diaries.map((diary) => (
                <DiaryCard
                  key={diary.id}
                  id={diary.id}
                  nickname={diary.nickname}
                  avatarUrl={diary.avatarUrl}
                  imageUrl={diary.imageUrl}
                  content={diary.content}
                  createdAt={diary.createdAt}
                  isOwn={diary.isOwn}
                  onEdit={() =>
                    (window.location.href = `/groups/${groupId}/write?edit=${diary.id}`)
                  }
                  onDelete={() => handleDeleteDiary(diary.id)}
                />
              ))
            ) : (
              /* 빈 상태 */
              <S.EmptyState>
                <S.EmptyText>
                  {isToday(selectedDate)
                    ? "아직 오늘 작성된 일기가 없어요."
                    : "이 날짜에 작성된 일기가 없어요."}
                </S.EmptyText>
              </S.EmptyState>
            )}
          </S.FeedSection>
        )}
      </S.Container>
    </MobileLayout>
  );
}
