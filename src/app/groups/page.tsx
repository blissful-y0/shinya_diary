"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MobileLayout from "@/components/layout/MobileLayout";
import GroupCard from "@/components/group/GroupCard";
import CreateGroupModal from "@/components/group/CreateGroupModal";
import JoinGroupModal from "@/components/group/JoinGroupModal";
import { Plus, Users, BookOpen, Loader2 } from "lucide-react";
import { getCurrentUser, getMyGroups, type Group } from "@/lib/api/client";
import * as S from "./styles/page.styles";

/* =============================================
   그룹 목록 페이지
   - 참여 중인 그룹 리스트
   - 그룹 생성/참여 모달
   ============================================= */

interface GroupWithInfo {
  id: string;
  name: string;
  iconUrl: string | null;
  coverImageUrl: string | null;
  memberCount: number;
  isOwner: boolean;
  hasPendingRequests: boolean;
}

export default function GroupsPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  /* 현재 사용자 확인 */
  useEffect(() => {
    const checkAuth = async () => {
      const userRes = await getCurrentUser();
      if (!userRes.success || !userRes.data) {
        router.replace("/login");
        return;
      }
      setCurrentUserId(userRes.data.id);
    };

    checkAuth();
  }, [router]);

  /* 그룹 목록 로드 */
  const loadGroups = async () => {
    if (!currentUserId) return;

    setIsLoading(true);

    const res = await getMyGroups();
    if (res.success && res.data) {
      const groupsWithInfo: GroupWithInfo[] = res.data.map((g: Group) => ({
        id: g.id,
        name: g.name,
        iconUrl: g.icon_url,
        coverImageUrl: g.cover_image_url,
        memberCount: g.memberCount || 1,
        isOwner: g.owner_id === currentUserId,
        hasPendingRequests: false, // TODO: 가입 요청 여부 체크
      }));

      setGroups(groupsWithInfo);
    } else {
      setGroups([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (currentUserId) {
      loadGroups();
    }
  }, [currentUserId]);

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
      <S.Container>
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
          {isLoading ? (
            <S.LoadingContainer>
              <Loader2 size={32} className="animate-spin" />
            </S.LoadingContainer>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                iconUrl={group.iconUrl}
                coverImageUrl={group.coverImageUrl}
                memberCount={group.memberCount}
                isOwner={group.isOwner}
                hasPendingRequests={group.hasPendingRequests}
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
