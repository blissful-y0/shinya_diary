"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import { Settings, PenSquare, Lock, Loader2, Copy, Check } from "lucide-react";
import { formatDateISO, isToday } from "@/utils/date";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 상세 페이지 (피드)
   - 날짜별 다이어리 피드
   - Read-after-Write 잠금 로직 적용
   - 방장: 설정 페이지 링크
   ============================================= */

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
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

  /* 헤더 우측 버튼 */
  const headerRight = isOwner ? (
    /* 방장: 설정 페이지로 이동 */
    <Link href={`/groups/${groupId}/settings`}>
      <S.SettingsButton as="span">
        <Settings size={20} />
      </S.SettingsButton>
    </Link>
  ) : (
    /* 일반 멤버: 초대 코드 토글 */
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
      {/* 초대 코드 표시 (일반 멤버용 토글) */}
      {!isOwner && showInviteCode && (
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
