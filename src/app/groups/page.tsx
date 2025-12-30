"use client";

import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen } from "lucide-react";

/* =============================================
   그룹 목록 페이지
   - 참여 중인 그룹 리스트
   - 그룹 생성/참여 버튼
   ============================================= */

export default function GroupsPage() {
  return (
    <MobileLayout headerTitle="내 그룹">
      <Container>
        {/* 그룹 생성/참여 버튼 */}
        <ActionButtons>
          <ActionButton variant="outline">
            <Plus size={20} />
            새 그룹 만들기
          </ActionButton>
          <ActionButton variant="outline">
            <Users size={20} />
            초대 코드로 참여
          </ActionButton>
        </ActionButtons>

        {/* 그룹 리스트 - 추후 데이터 연동 */}
        <GroupList>
          <EmptyState>
            <EmptyIcon><BookOpen size={48} /></EmptyIcon>
            <EmptyTitle>아직 그룹이 없어요</EmptyTitle>
            <EmptyText>
              새로운 그룹을 만들거나
              <br />
              초대 코드로 친구의 그룹에 참여해보세요!
            </EmptyText>
          </EmptyState>
        </GroupList>
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
  gap: 24px;
`;

const ActionButtons = styled.div`
  /* 액션 버튼 그룹 */
  display: flex;
  gap: 12px;
`;

const ActionButton = styled(Button)`
  /* 액션 버튼 */
  flex: 1;
  height: 48px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
`;

const GroupList = styled.div`
  /* 그룹 리스트 컨테이너 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  /* 빈 상태 표시 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  /* 빈 상태 아이콘 */
  color: var(--muted-foreground);
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  /* 빈 상태 제목 */
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 8px;
`;

const EmptyText = styled.p`
  /* 빈 상태 설명 */
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
`;
