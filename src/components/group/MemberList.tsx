"use client";

import { UserMinus } from "lucide-react";
import * as S from "./MemberList.styles";

/* =============================================
   멤버 목록 컴포넌트
   - 그룹 멤버 목록 표시
   - 방장인 경우 강퇴 기능
   ============================================= */

interface Member {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  joined_at: string;
  isOwner: boolean;
}

interface MemberListProps {
  members: Member[];
  canManage: boolean;
  onRemove?: (memberId: string) => void;
}

export default function MemberList({
  members,
  canManage,
  onRemove,
}: MemberListProps) {
  if (members.length === 0) {
    return <S.EmptyState>멤버가 없습니다</S.EmptyState>;
  }

  const formatJoinedAt = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} 가입`;
  };

  return (
    <S.Container>
      {members.map((member) => (
        <S.MemberCard key={member.id}>
          <S.Avatar>
            {member.avatar_url ? (
              <S.AvatarImage src={member.avatar_url} alt={member.nickname || ""} />
            ) : (
              <S.AvatarPlaceholder>
                {(member.nickname || "?").charAt(0).toUpperCase()}
              </S.AvatarPlaceholder>
            )}
          </S.Avatar>

          <S.MemberInfo>
            <S.NicknameRow>
              <S.Nickname>{member.nickname || "익명"}</S.Nickname>
              {member.isOwner && <S.OwnerBadge>방장</S.OwnerBadge>}
            </S.NicknameRow>
            <S.JoinedAt>{formatJoinedAt(member.joined_at)}</S.JoinedAt>
          </S.MemberInfo>

          {canManage && !member.isOwner && onRemove && (
            <S.RemoveButton
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm(`${member.nickname || "이 멤버"}를 강퇴하시겠습니까?`)) {
                  onRemove(member.id);
                }
              }}
            >
              <UserMinus size={16} />
            </S.RemoveButton>
          )}
        </S.MemberCard>
      ))}
    </S.Container>
  );
}
