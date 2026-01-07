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
  } = useDiariesWithAuth(groupId, dateStr, profile?.id ?? null);

  useEffect(() => {
    if (groupError) {
      toast.error("그룹을 찾을 수 없습니다");
      router.replace("/groups");
    }
  }, [groupError, router]);

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

  const handleDeleteClick = (diaryId: string) => {
    setDeleteDialog({ open: true, diaryId });
  };

  const handleDeleteDiary = async () => {
    try {
      const result = await deleteDiary(deleteDialog.diaryId);
      if (result.success) {
        toast.success("일기가 삭제되었습니다.");
        setDeleteDialog({ open: false, diaryId: "" });
        router.push(`/groups/${groupId}`);
      } else {
        toast.error(result.error || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("일기 삭제 실패:", error);
      toast.error("삭제에 실패했습니다.");
    }
  };

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
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {group?.cover_image_url && (
        <S.CoverImageContainer>
          <S.CoverImage src={group.cover_image_url} alt="" />
        </S.CoverImageContainer>
      )}

      <S.Container>
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

        {isLoading && (
          <S.LoadingContainer>
            <Loader2 size={32} className="animate-spin" />
          </S.LoadingContainer>
        )}

        {!isLoading && (
          <S.FeedSection>
            {showLocked ? (
              <S.LockedFeed>
                <S.LockedIcon>
                  <Lock size={32} />
                </S.LockedIcon>
                <S.LockedText>일기를 작성하면 잠금이 해제됩니다</S.LockedText>
              </S.LockedFeed>
            ) : diariesWithMeta.length > 0 ? (
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
                    (window.location.href = `/groups/${groupId}/write?edit=${diary.id}`)
                  }
                  onDelete={() => handleDeleteClick(diary.id)}
                />
              ))
            ) : (
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
