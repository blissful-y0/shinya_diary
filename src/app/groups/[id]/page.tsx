"use client";

import { use } from "react";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Settings, PenSquare } from "lucide-react";
import Link from "next/link";

/* =============================================
   그룹 상세 페이지 (피드)
   - 그룹 멤버들의 다이어리 피드
   - Read-after-Write 잠금 로직 적용
   ============================================= */

interface GroupDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { id } = use(params);

  /* 설정 버튼 */
  const headerRight = (
    <SettingsButton>
      <Settings size={20} />
    </SettingsButton>
  );

  return (
    <MobileLayout
      headerTitle="우리의 일기장"
      headerBackHref="/groups"
      headerRight={headerRight}
    >
      <Container>
        {/* 오늘의 글쓰기 상태 */}
        <WriteStatusCard>
          <WriteStatusText>
            오늘의 일기를 작성하면
            <br />
            친구들의 일기를 볼 수 있어요!
          </WriteStatusText>
          <WriteButton asChild>
            <Link href={`/groups/${id}/write`}>
              <PenSquare size={18} />
              오늘의 일기 쓰기
            </Link>
          </WriteButton>
        </WriteStatusCard>

        {/* 피드 - 추후 구현 */}
        <FeedSection>
          <LockedFeed>
            <LockedIcon>🔒</LockedIcon>
            <LockedText>
              일기를 작성하면 잠금이 해제됩니다
            </LockedText>
          </LockedFeed>
        </FeedSection>
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
  background: linear-gradient(135deg, #7C9EB2 0%, #A8C5D8 100%);
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
  color: #5A7A8A;
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
  filter: blur(0);
`;

const LockedIcon = styled.div`
  /* 잠금 아이콘 */
  font-size: 32px;
  margin-bottom: 12px;
`;

const LockedText = styled.p`
  /* 잠금 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
`;
