"use client";

import { use, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import DateSelector from "@/components/diary/DateSelector";
import DiaryCard from "@/components/diary/DiaryCard";
import { Button } from "@/components/ui/button";
import { Settings, PenSquare, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  getDiariesByDate,
  checkTodayDiary,
  type DiaryWithAuthor,
} from "@/lib/supabase/queries/diary";
import { formatDateISO, isToday } from "@/utils/date";

/* =============================================
   그룹 상세 페이지 (피드)
   - 날짜별 다이어리 피드
   - Read-after-Write 잠금 로직 적용
   ============================================= */

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id: groupId } = use(params);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState<DiaryWithAuthor[]>([]);
  const [hasWrittenToday, setHasWrittenToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  /* 현재 사용자 정보 가져오기 */
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  /* 다이어리 목록 로드 */
  const loadDiaries = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    const dateStr = formatDateISO(selectedDate);

    /* 오늘 날짜인 경우 작성 여부 확인 */
    if (isToday(selectedDate)) {
      const written = await checkTodayDiary(groupId, userId, dateStr);
      setHasWrittenToday(written);
    } else {
      /* 과거 날짜는 항상 볼 수 있음 (해당 날짜에 작성한 경우) */
      setHasWrittenToday(true);
    }

    /* 다이어리 목록 조회 */
    const data = await getDiariesByDate(groupId, dateStr);
    setDiaries(data);
    setIsLoading(false);
  }, [groupId, userId, selectedDate]);

  useEffect(() => {
    if (userId) {
      loadDiaries();
    }
  }, [userId, loadDiaries]);

  /* 설정 버튼 */
  const headerRight = (
    <SettingsButton>
      <Settings size={20} />
    </SettingsButton>
  );

  const showLocked = isToday(selectedDate) && !hasWrittenToday;

  return (
    <MobileLayout
      headerTitle="우리의 일기장"
      headerBackHref="/groups"
      headerRight={headerRight}
    >
      {/* 날짜 선택 */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <Container>
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
                  nickname={diary.author.nickname}
                  avatarUrl={diary.author.avatar_url}
                  imageUrl={diary.image_url}
                  content={diary.content}
                  createdAt={diary.created_at}
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
