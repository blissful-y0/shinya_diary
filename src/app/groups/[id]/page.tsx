"use client";

export const runtime = "edge";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Settings, PenSquare, Lock, Loader2 } from "lucide-react";
import { formatDateISO, isToday } from "@/utils/date";
import {
  getGroup,
  getDiaries,
  checkTodayDiary,
  getCommentCount,
  getGroupMembers,
  type Diary,
} from "@/lib/api/client";
import { useRequireAuth } from "@/lib/hooks/useAuth";
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

interface DiaryWithMeta {
  id: string;
  nickname: string;
  avatarUrl: string | null;
  imageUrl: string | null;
  content: string | null;
  createdAt: string;
  isOwn: boolean;
  commentCount: number;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id: groupId } = use(params);
  const router = useRouter();
  const { profile, isLoading: authLoading } = useRequireAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState<DiaryWithMeta[]>([]);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [myGroupProfile, setMyGroupProfile] = useState<{
    nickname: string;
    avatar_url: string | null;
  } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    diaryId: string;
  }>({
    open: false,
    diaryId: "",
  });

  /* 그룹 정보 및 다이어리 목록 로드 */
  const loadData = useCallback(async () => {
    if (!profile) return;

    setIsLoading(true);

    /* 그룹 정보 + 멤버 정보 병렬 조회 */
    const [groupRes, membersRes] = await Promise.all([
      getGroup(groupId),
      getGroupMembers(groupId),
    ]);

    if (!groupRes.success || !groupRes.data) {
      toast.error("그룹을 찾을 수 없습니다");
      router.replace("/groups");
      return;
    }
    setGroupName(groupRes.data.name);
    setCoverImageUrl(groupRes.data.cover_image_url);

    /* 현재 사용자의 그룹 프로필 저장 */
    if (membersRes.success && membersRes.data) {
      const myMember = membersRes.data.find((m) => m.user_id === profile.id);
      if (myMember) {
        setMyGroupProfile({
          nickname: myMember.nickname || profile.nickname || "나",
          avatar_url: myMember.avatar_url || profile.avatar_url,
        });
      }
    }

    /* 날짜별 다이어리 조회 */
    const dateStr = formatDateISO(selectedDate);

    /* 오늘 날짜인 경우 작성 여부 확인 */
    if (isToday(selectedDate)) {
      const checkRes = await checkTodayDiary(groupId, dateStr);
      setHasWrittenToday(checkRes.success && checkRes.data?.hasWritten === true);
    } else {
      setHasWrittenToday(true);
    }

    /* 다이어리 목록 */
    const diariesRes = await getDiaries(groupId, dateStr);
    if (diariesRes.success && diariesRes.data) {
      const diariesWithMeta = await Promise.all(
        diariesRes.data.map(async (d: Diary) => {
          const countRes = await getCommentCount(d.id);
          return {
            id: d.id,
            nickname: d.author?.nickname || "익명",
            avatarUrl: d.author?.avatar_url || null,
            imageUrl: d.image_url,
            content: d.content,
            createdAt: d.created_at,
            isOwn: d.user_id === profile.id,
            commentCount: countRes.success ? countRes.data?.count || 0 : 0,
          };
        })
      );
      setDiaries(diariesWithMeta);
    } else {
      setDiaries([]);
    }

    setIsLoading(false);
  }, [groupId, selectedDate, profile]);

  useEffect(() => {
    if (profile && !authLoading) {
      loadData();
    }
  }, [loadData, profile, authLoading]);

  /* 다이어리 삭제 다이얼로그 열기 */
  const handleDeleteClick = (diaryId: string) => {
    setDeleteDialog({ open: true, diaryId });
  };

  /* 다이어리 삭제 실행 */
  const handleDeleteDiary = async () => {
    // TODO: Add delete diary API
    setDiaries((prev) => prev.filter((d) => d.id !== deleteDialog.diaryId));
    toast.success("일기가 삭제되었습니다.");
  };

  /* 헤더 우측 버튼 - 모든 멤버가 설정 페이지 접근 가능 */
  const headerRight = (
    <Link href={`/groups/${groupId}/settings`}>
      <S.SettingsButton as="span">
        <Settings size={20} />
      </S.SettingsButton>
    </Link>
  );

  const showLocked = isToday(selectedDate) && !hasWrittenToday;

  return (
    <MobileLayout
      headerTitle={groupName || "그룹"}
      headerBackHref="/groups"
      headerRight={headerRight}
    >
      {/* 날짜 선택 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 커버 이미지 */}
      {coverImageUrl && (
        <S.CoverImageContainer>
          <S.CoverImage src={coverImageUrl} alt="" />
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
            ) : diaries.length > 0 ? (
              /* 다이어리 목록 */
              diaries.map((diary) => (
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
                  commentCount={diary.commentCount}
                  currentUserAuthor={myGroupProfile}
                  onEdit={() =>
                    (window.location.href = `/groups/${groupId}/write?edit=${diary.id}`)
                  }
                  onDelete={() => handleDeleteClick(diary.id)}
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
