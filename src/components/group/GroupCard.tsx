"use client";

import Link from "next/link";
import styled from "styled-components";
import { Users, Crown, ChevronRight } from "lucide-react";

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
    <CardLink href={`/groups/${id}`}>
      <CardContent>
        <GroupIcon>
          <Users size={24} />
        </GroupIcon>

        <GroupInfo>
          <GroupNameRow>
            <GroupName>{name}</GroupName>
            {isOwner && (
              <OwnerBadge>
                <Crown size={12} />
              </OwnerBadge>
            )}
          </GroupNameRow>
          <MemberCount>{memberCount}/4명</MemberCount>
        </GroupInfo>

        <RightSection>
          {hasPendingRequests && <PendingDot />}
          <ChevronRight size={20} />
        </RightSection>
      </CardContent>
    </CardLink>
  );
}

/* 스타일 컴포넌트 */
const CardLink = styled(Link)`
  display: block;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--accent);
  }

  &:active {
    transform: scale(0.99);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

const GroupIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--muted);
  border-radius: 12px;
  color: var(--muted-foreground);
`;

const GroupInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GroupName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
`;

const OwnerBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: var(--primary);
  color: white;
  border-radius: 50%;
`;

const MemberCount = styled.span`
  font-size: 13px;
  color: var(--muted-foreground);
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
`;

const PendingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: var(--destructive);
  border-radius: 50%;
`;
