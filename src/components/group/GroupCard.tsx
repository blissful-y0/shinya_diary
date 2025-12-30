"use client";

import { Users, Crown, ChevronRight } from "lucide-react";
import * as S from "./GroupCard.styles";

/* =============================================
   그룹 카드 컴포넌트
   - 그룹 정보 표시
   - 클릭 시 그룹 상세 페이지로 이동
   ============================================= */

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  isOwner: boolean;
  hasPendingRequests?: boolean;
}

export default function GroupCard({
  id,
  name,
  memberCount,
  isOwner,
  hasPendingRequests,
}: GroupCardProps) {
  return (
    <S.CardLink href={`/groups/${id}`}>
      <S.CardContent>
        <S.GroupIcon>
          <Users size={24} />
        </S.GroupIcon>

        <S.GroupInfo>
          <S.GroupNameRow>
            <S.GroupName>{name}</S.GroupName>
            {isOwner && (
              <S.OwnerBadge>
                <Crown size={12} />
              </S.OwnerBadge>
            )}
          </S.GroupNameRow>
          <S.MemberCount>{memberCount}명</S.MemberCount>
        </S.GroupInfo>

        <S.RightSection>
          {hasPendingRequests && <S.PendingDot />}
          <ChevronRight size={20} />
        </S.RightSection>
      </S.CardContent>
    </S.CardLink>
  );
}
