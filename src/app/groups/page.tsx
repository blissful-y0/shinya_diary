"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import MobileLayout from "@/components/layout/MobileLayout";
import GroupCard from "@/components/group/GroupCard";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import JoinGroupModal from "@/components/group/JoinGroupModal";
import { Button } from "@/components/ui/button";
import { Plus, Users, BookOpen } from "lucide-react";

/* =============================================
   그룹 목록 페이지
   - 참여 중인 그룹 리스트
   - 그룹 생성/참여 모달
   ============================================= */

interface GroupWithInfo {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  hasPendingRequests: boolean;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  /* 그룹 목록 로드 */
  const loadGroups = async () => {
    setIsLoading(true);

    const { getMyGroups, getJoinRequests, getCurrentUser } = await import(
      "@/lib/mock/services"
    );
    const currentUser = getCurrentUser();
    const myGroups = getMyGroups();

    const groupsWithInfo: GroupWithInfo[] = myGroups.map((g) => {
      const requests = getJoinRequests(g.id);
      return {
        id: g.id,
        name: g.name,
        memberCount: g.memberCount,
        isOwner: g.owner_id === currentUser.id,
        hasPendingRequests: requests.length > 0,
      };
    });

    setGroups(groupsWithInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  /* 그룹 생성 완료 */
  const handleGroupCreated = () => {
    loadGroups();
  };

  /* 가입 요청 완료 */
  const handleJoinRequested = () => {
    /* 요청만 보내므로 그룹 목록에 변화 없음 */
  };

  return (
    <MobileLayout headerTitle="내 그룹">
      <Container>
        {/* 그룹 생성/참여 버튼 */}
        <ActionButtons>
          <ActionButton variant="outline" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            새 그룹 만들기
          </ActionButton>
          <ActionButton variant="outline" onClick={() => setShowJoinModal(true)}>
            <Users size={20} />
            초대 코드로 참여
          </ActionButton>
        </ActionButtons>

        {/* 그룹 리스트 */}
        <GroupList>
          {isLoading ? (
            <LoadingText>로딩 중...</LoadingText>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                memberCount={group.memberCount}
                isOwner={group.isOwner}
                hasPendingRequests={group.hasPendingRequests}
              />
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>
                <BookOpen size={48} />
              </EmptyIcon>
              <EmptyTitle>아직 그룹이 없어요</EmptyTitle>
              <EmptyText>
                새로운 그룹을 만들거나
                <br />
                초대 코드로 친구의 그룹에 참여해보세요!
              </EmptyText>
            </EmptyState>
          )}
        </GroupList>
      </Container>

      {/* 그룹 생성 모달 */}
      <CreateGroupModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={handleGroupCreated}
      />

      {/* 그룹 참여 모달 */}
      <JoinGroupModal
        open={showJoinModal}
        onOpenChange={setShowJoinModal}
        onRequested={handleJoinRequested}
      />
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

const LoadingText = styled.p`
  /* 로딩 텍스트 */
  text-align: center;
  padding: 48px 0;
  color: var(--muted-foreground);
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
