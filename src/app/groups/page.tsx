"use client";

import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import GroupCard from "@/components/group/GroupCard";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import JoinGroupModal from "@/components/group/JoinGroupModal";
import { Plus, Users, BookOpen, Loader2 } from "lucide-react";
import { useGroups } from "@/lib/swr/hooks";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 목록 페이지
   - 참여 중인 그룹 리스트
   - 그룹 생성/참여 모달
   ============================================= */

export default function GroupsPage() {
  const { profile, isLoading: authLoading } = useRequireAuth();
  const { groups, isLoading, mutate } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  /* 그룹 생성 완료 */
  const handleGroupCreated = () => {
    mutate(); // SWR 캐시 갱신
  };

  /* 가입 요청 완료 */
  const handleJoinRequested = () => {
    /* 요청만 보내므로 그룹 목록에 변화 없음 */
  };

  return (
    <MobileLayout showHeader={false}>
      <S.Container>
        <S.PageTitle>내 그룹</S.PageTitle>

        {/* 그룹 생성/참여 버튼 */}
        <S.ActionButtons>
          <S.ActionButton variant="outline" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            새 그룹 만들기
          </S.ActionButton>
          <S.ActionButton variant="outline" onClick={() => setShowJoinModal(true)}>
            <Users size={20} />
            초대 코드로 참여
          </S.ActionButton>
        </S.ActionButtons>

        {/* 그룹 리스트 */}
        <S.GroupList>
          {isLoading || authLoading ? (
            <S.LoadingContainer>
              <Loader2 size={32} className="animate-spin" />
            </S.LoadingContainer>
          ) : groups && groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.public_id}
                id={group.public_id}
                name={group.name}
                iconUrl={group.icon_url}
                coverImageUrl={group.cover_image_url}
                memberCount={group.memberCount || 1}
                isOwner={group.owner_id === profile?.id}
                hasPendingRequests={false}
              />
            ))
          ) : (
            <S.EmptyState>
              <S.EmptyIcon>
                <BookOpen size={48} />
              </S.EmptyIcon>
              <S.EmptyTitle>아직 그룹이 없어요</S.EmptyTitle>
              <S.EmptyText>
                새로운 그룹을 만들거나
                <br />
                초대 코드로 친구의 그룹에 참여해보세요!
              </S.EmptyText>
            </S.EmptyState>
          )}
        </S.GroupList>
      </S.Container>

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
