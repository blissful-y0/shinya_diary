"use client";

import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

/* =============================================
   빠른 글쓰기 페이지
   - 그룹 선택 후 작성 페이지로 이동
   ============================================= */

export default function QuickWritePage() {
  return (
    <MobileLayout headerTitle="글쓰기" showNav={false}>
      <Container>
        <Title>어느 그룹에 일기를 작성할까요?</Title>

        {/* 그룹 리스트 - 추후 데이터 연동 */}
        <GroupList>
          <EmptyState>
            <EmptyIcon>📝</EmptyIcon>
            <EmptyText>
              참여 중인 그룹이 없어요.
              <br />
              그룹에 가입하면 일기를 작성할 수 있어요!
            </EmptyText>
            <GroupsButton variant="outline" asChild>
              <a href="/groups">그룹 둘러보기</a>
            </GroupsButton>
          </EmptyState>
        </GroupList>
      </Container>
    </MobileLayout>
  );
}

/* 그룹 아이템 컴포넌트 - 추후 사용 */
interface GroupItemProps {
  name: string;
  memberCount: number;
  href: string;
}

export function GroupItem({ name, memberCount, href }: GroupItemProps) {
  return (
    <GroupItemContainer href={href}>
      <GroupInfo>
        <GroupName>{name}</GroupName>
        <MemberCount>{memberCount}명</MemberCount>
      </GroupInfo>
      <ChevronRight size={20} />
    </GroupItemContainer>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 페이지 컨테이너 */
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  /* 페이지 제목 */
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
`;

const GroupList = styled.div`
  /* 그룹 리스트 */
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const EmptyIcon = styled.div`
  /* 빈 상태 아이콘 */
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  /* 빈 상태 텍스트 */
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
  margin-bottom: 24px;
`;

const GroupsButton = styled(Button)`
  /* 그룹 보기 버튼 */
  height: 44px;
  padding: 0 24px;
  border-radius: 22px;
`;

/* 그룹 아이템 스타일 */
const GroupItemContainer = styled.a`
  /* 그룹 아이템 컨테이너 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--foreground);
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }
`;

const GroupInfo = styled.div`
  /* 그룹 정보 */
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupName = styled.span`
  /* 그룹 이름 */
  font-size: 16px;
  font-weight: 500;
`;

const MemberCount = styled.span`
  /* 멤버 수 */
  font-size: 13px;
  color: var(--muted-foreground);
`;
