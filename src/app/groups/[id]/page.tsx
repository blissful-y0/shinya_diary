"use client";

import { use, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import JoinRequestList from "@/components/group/JoinRequestList";
import { Button } from "@/components/ui/button";
import { Settings, PenSquare, Lock, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { formatDateISO, isToday } from "@/utils/date";

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
      getJoinRequests,
      getDiariesByDate,
      checkTodayDiary,
      getCurrentUser,
    } = await import("@/lib/mock/services");

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
  }, [groupId, selectedDate]);

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
    <SettingsButton onClick={() => setShowInviteCode(!showInviteCode)}>
      <Settings size={20} />
    </SettingsButton>
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
        <InviteCodeBanner>
          <InviteCodeLabel>초대 코드</InviteCodeLabel>
          <InviteCodeRow>
            <InviteCodeText>{inviteCode}</InviteCodeText>
            <CopyButton onClick={handleCopyInviteCode}>
              {codeCopied ? <Check size={16} /> : <Copy size={16} />}
            </CopyButton>
          </InviteCodeRow>
        </InviteCodeBanner>
      )}

      {/* 날짜 선택 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <Container>
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
          <WriteStatusCard>
            <WriteStatusText>
              오늘의 일기를 작성하면
              <br />
              친구들의 일기를 볼 수 있어요!
            </WriteStatusText>
            <WriteButton asChild>
              <Link href={`/groups/${groupId}/write`}>
                <PenSquare size={18} />
                오늘의 일기 쓰기
              </Link>
            </WriteButton>
          </WriteStatusCard>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <LoadingContainer>
            <Loader2 size={32} className="animate-spin" />
          </LoadingContainer>
        )}

        {/* 피드 섹션 */}
        {!isLoading && (
          <FeedSection>
            {showLocked ? (
              /* 잠긴 상태 */
              <LockedFeed>
                <LockedIcon>
                  <Lock size={32} />
                </LockedIcon>
                <LockedText>일기를 작성하면 잠금이 해제됩니다</LockedText>
              </LockedFeed>
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
              <EmptyState>
                <EmptyText>
                  {isToday(selectedDate)
                    ? "아직 오늘 작성된 일기가 없어요."
                    : "이 날짜에 작성된 일기가 없어요."}
                </EmptyText>
              </EmptyState>
            )}
          </FeedSection>
        )}
      </Container>
    </MobileLayout>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingsButton = styled.button`
  /* 설정 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

const InviteCodeBanner = styled.div`
  /* 초대 코드 배너 */
  background-color: var(--muted);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
`;

const InviteCodeLabel = styled.span`
  /* 초대 코드 레이블 */
  font-size: 13px;
  color: var(--muted-foreground);
`;

const InviteCodeRow = styled.div`
  /* 초대 코드 행 */
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InviteCodeText = styled.span`
  /* 초대 코드 텍스트 */
  font-size: 16px;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 1px;
  color: var(--foreground);
`;

const CopyButton = styled.button`
  /* 복사 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--muted-foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

const WriteStatusCard = styled.div`
  /* 글쓰기 상태 카드 */
  background: linear-gradient(135deg, #7c9eb2 0%, #a8c5d8 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: white;
`;

const WriteStatusText = styled.p`
  /* 상태 텍스트 */
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  opacity: 0.95;
`;

const WriteButton = styled(Button)`
  /* 글쓰기 버튼 */
  background-color: white;
  color: #5a7a8a;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
  border-radius: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

const LoadingContainer = styled.div`
  /* 로딩 컨테이너 */
  display: flex;
  justify-content: center;
  padding: 48px 0;
  color: var(--muted-foreground);
`;

const FeedSection = styled.section`
  /* 피드 섹션 */
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LockedFeed = styled.div`
  /* 잠긴 피드 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background-color: var(--muted);
  border-radius: 12px;
`;

const LockedIcon = styled.div`
  /* 잠금 아이콘 */
  color: var(--muted-foreground);
  margin-bottom: 12px;
`;

const LockedText = styled.p`
  /* 잠금 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
`;

const EmptyState = styled.div`
  /* 빈 상태 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const EmptyText = styled.p`
  /* 빈 상태 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
`;
