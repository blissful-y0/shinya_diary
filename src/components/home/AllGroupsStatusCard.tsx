import React from "react";
import Link from "next/link";
import { Check, Clock } from "lucide-react";
import * as S from "./AllGroupsStatusCard.styles";
import type { AllGroupsStatus } from "@/lib/api/client";

interface AllGroupsStatusCardProps {
  status: AllGroupsStatus | undefined;
  isLoading: boolean;
}

export default function AllGroupsStatusCard({ status, isLoading }: AllGroupsStatusCardProps) {
  if (isLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.Title>오늘 작성 현황</S.Title>
        </S.Header>
        <S.EmptyState>로딩 중...</S.EmptyState>
      </S.Container>
    );
  }

  if (!status || status.totalGroups === 0) {
    return (
      <S.Container>
        <S.Header>
          <S.Title>오늘 작성 현황</S.Title>
          <S.Count>0/0 그룹</S.Count>
        </S.Header>
        <S.EmptyState>참여 중인 그룹이 없습니다</S.EmptyState>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.Title>오늘 작성 현황</S.Title>
        <S.Count>{status.writtenGroups}/{status.totalGroups} 그룹</S.Count>
      </S.Header>
      
      <S.GroupList>
        {status.groups.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}`} passHref legacyBehavior>
            <S.GroupItem>
              <S.GroupInfo>
                <S.GroupIcon>
                  {group.iconUrl ? (
                    <img src={group.iconUrl} alt={group.name} />
                  ) : (
                    group.name.charAt(0)
                  )}
                </S.GroupIcon>
                <S.GroupName>{group.name}</S.GroupName>
              </S.GroupInfo>
              
              <S.StatusIndicator $isComplete={group.hasWrittenToday}>
                {group.hasWrittenToday ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <Clock size={14} strokeWidth={2.5} />
                )}
              </S.StatusIndicator>
            </S.GroupItem>
          </Link>
        ))}
      </S.GroupList>
    </S.Container>
  );
}
