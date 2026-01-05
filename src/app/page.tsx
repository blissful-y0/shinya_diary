"use client";

import MobileLayout from "@/components/layout/MobileLayout";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import * as S from "./styles/page.styles";

const DAYS_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function formatDate(date: Date): { display: string; dayOfWeek: string } {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_KO[date.getDay()];
  
  return {
    display: `${month}월 ${day}일`,
    dayOfWeek,
  };
}

const MOCK_HOT_TOPICS = [
  { rank: 1, title: "오늘의 감사일기", count: 128 },
  { rank: 2, title: "새해 목표 정하기", count: 97 },
  { rank: 3, title: "겨울 산책", count: 84 },
  { rank: 4, title: "일상의 소소함", count: 72 },
];

const MOCK_FRIEND_DIARIES = [
  {
    id: "1",
    author: "민지",
    avatar: "민",
    time: "2시간 전",
    content: "오늘 아침에 일찍 일어나서 커피 한 잔과 함께 창밖을 바라봤다. 눈이 살짝 쌓인 거리가 너무 예뻤어.",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    author: "수현",
    avatar: "수",
    time: "5시간 전",
    content: "새해 첫 주가 벌써 지나가고 있다. 올해는 정말 나를 위한 시간을 더 많이 가지고 싶어. 작은 것부터 시작해보려고.",
    likes: 24,
    comments: 8,
  },
];

export default function HomePage() {
  const { isLoading } = useRequireAuth();
  const today = new Date();
  const { display, dayOfWeek } = formatDate(today);

  if (isLoading) {
    return (
      <MobileLayout headerTitle="">
        <S.Container>
          <S.PlaceholderCard>
            <S.PlaceholderText>로딩 중...</S.PlaceholderText>
          </S.PlaceholderCard>
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle="">
      <S.Container>
        <S.DateSection>
          <S.DateDisplay>{display}</S.DateDisplay>
          <S.DayOfWeek>{dayOfWeek}</S.DayOfWeek>
        </S.DateSection>

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>Hot</S.SectionTitle>
            <S.SectionLink>더보기</S.SectionLink>
          </S.SectionHeader>
          <S.HotScrollContainer>
            {MOCK_HOT_TOPICS.map((topic) => (
              <S.HotCard key={topic.rank}>
                <S.HotCardRank>{topic.rank}</S.HotCardRank>
                <S.HotCardTitle>{topic.title}</S.HotCardTitle>
                <S.HotCardCount>{topic.count}명 참여</S.HotCardCount>
              </S.HotCard>
            ))}
          </S.HotScrollContainer>
        </S.Section>

        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>친구들의 일기</S.SectionTitle>
            <S.SectionLink>전체보기</S.SectionLink>
          </S.SectionHeader>
          {MOCK_FRIEND_DIARIES.map((diary) => (
            <S.FeedCard key={diary.id}>
              <S.FeedCardHeader>
                <S.Avatar>{diary.avatar}</S.Avatar>
                <S.FeedCardMeta>
                  <S.FeedCardAuthor>{diary.author}</S.FeedCardAuthor>
                  <S.FeedCardTime>{diary.time}</S.FeedCardTime>
                </S.FeedCardMeta>
              </S.FeedCardHeader>
              <S.FeedCardContent>{diary.content}</S.FeedCardContent>
              <S.FeedCardFooter>
                <S.FeedCardStat>좋아요 {diary.likes}</S.FeedCardStat>
                <S.FeedCardStat>댓글 {diary.comments}</S.FeedCardStat>
              </S.FeedCardFooter>
            </S.FeedCard>
          ))}
        </S.Section>
      </S.Container>
    </MobileLayout>
  );
}
