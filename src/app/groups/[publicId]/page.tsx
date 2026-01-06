"use client";

export const runtime = "edge";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Settings, PenSquare, Lock, Loader2 } from "lucide-react";
import { formatDateISO, isToday } from "@/lib/utils/date";
import { useGroup, useGroupMembers, useDiariesWithAuth } from "@/lib/swr/hooks";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { deleteDiary } from "@/lib/api/client";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 상세 페이지 (피드)
   - 날짜별 다이어리 피드
   - Read-after-Write 잠금 로직 적용
   - 방장: 설정 페이지 링크
   ============================================= */

interface GroupDetailPageProps {
  params: Promise<{ publicId: string }>;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { publicId: groupId } = use(params);
  const router = useRouter();
  const { profile, isLoading: authLoading } = useRequireAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    diaryId: string;
  }>({
    open: false,
    diaryId: "",
  });

  const dateStr = formatDateISO(selectedDate);

  // SWR hooks
  const {
    group,
    isLoading: groupLoading,
    isError: groupError,
  } = useGroup(groupId);
  const { members } = useGroupMembers(groupId);
  const {
    diaries,
    hasWritten: hasWrittenToday,
    canView,
    isLoading: diariesLoading,
    mutate: mutateDiaries,
  } = useDiariesWithAuth(groupId, dateStr, profile?.id ?? null);

  // 그룹 에러 시 리다이렉트
  useEffect(() => {
    if (groupError) {
      toast.error("그룹을 찾을 수 없습니다");
      router.replace("/groups");
    }
  }, [groupError, router]);

  // 현재 사용자의 그룹 프로필
  const myGroupProfile = useMemo(() => {
    if (!members || !profile) return null;
    const myMember = members.find((m) => m.user_id === profile.id);
    if (!myMember) return null;
    return {
      nickname: myMember.nickname || profile.nickname || "나",
      avatar_url: myMember.avatar_url || profile.avatar_url,
    };
  }, [members, profile]);

  const diariesWithMeta = useMemo(() => {
    if (!diaries || !profile) return [];
    return diaries.map((d) => ({
      id: d.id,
      public_id: d.public_id,
      nickname: d.author?.user_id
        ? d.author.nickname || "익명"
        : "탈퇴한 사용자",
      avatarUrl: d.author?.avatar_url || null,
      imageUrl: d.image_url,
      content: d.content,
      createdAt: d.created_at,
      isOwn: d.user_id === profile.id,
      comments: d.comments || [],
      commentCount: d.comment_count || 0,
    }));
  }, [diaries, profile]);

  const isLoading = authLoading || groupLoading || diariesLoading;

  /* 다이어리 삭제 다이얼로그 열기 */
  const handleDeleteClick = (diaryId: string) => {
    setDeleteDialog({ open: true, diaryId });
  };

  /* 다이어리 삭제 실행 */
  const handleDeleteDiary = async () => {
    try {
      const result = await deleteDiary(deleteDialog.diaryId);
      if (result.success) {
        toast.success("일기가 삭제되었습니다.");
        setDeleteDialog({ open: false, diaryId: "" });
        // 삭제 후 홈으로 리디렉트 (다른 사람 일기를 볼 수 없도록)
        router.push(`/groups/${groupId}`);
      } else {
        toast.error(result.error || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("일기 삭제 실패:", error);
      toast.error("삭제에 실패했습니다.");
    }
  };

  /* 헤더 우측 버튼 - 모든 멤버가 설정 페이지 접근 가능 */
  const headerRight = (
    <Link href={`/groups/${groupId}/settings`}>
      <S.SettingsButton as="span">
        <Settings size={20} />
      </S.SettingsButton>
    </Link>
  );

  const showLocked = isToday(selectedDate) && !canView;

  return (
    <MobileLayout
      headerTitle={group?.name || "그룹"}
      headerBackHref="/groups"
      headerRight={headerRight}
    >
      {/* 날짜 선택 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 커버 이미지 */}
      {group?.cover_image_url && (
        <S.CoverImageContainer>
          <S.CoverImage src={group.cover_image_url} alt="" />
        </S.CoverImageContainer>
      )}

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
            ) : diariesWithMeta.length > 0 ? (
              /* 다이어리 목록 */
              diariesWithMeta.map((diary) => (
                <DiaryCard
                  key={diary.id}
                  id={diary.id}
                  groupId={groupId}
                  nickname={diary.nickname}
                  avatarUrl={diary.avatarUrl}
                  imageUrl={diary.imageUrl}
                  content={diary.content}
                  createdAt={diary.createdAt}
                  isOwn={diary.isOwn}
                  comments={diary.comments}
                  commentCount={diary.commentCount}
                  currentUserAuthor={myGroupProfile}
                  onEdit={() =>
                    (window.location.href = `/groups/${groupId}/write?edit=${diary.public_id}`)
                  }
                  onDelete={() => handleDeleteClick(diary.public_id)}
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

      {/* 다이어리 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="일기 삭제"
        description="정말로 이 일기를 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다."
        confirmText="삭제"
        variant="destructive"
        onConfirm={handleDeleteDiary}
      />
    </MobileLayout>
  );
}
