"use client";

import { GroupStatus } from "@/lib/api/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Clock, Loader2 } from "lucide-react";
import * as S from "./GroupStatusCard.styles";

interface GroupStatusCardProps {
  status: GroupStatus | undefined;
  isLoading: boolean;
}

export default function GroupStatusCard({ status, isLoading }: GroupStatusCardProps) {
  if (isLoading) {
    return (
      <S.Container>
        <S.Header>
          <S.Title>오늘 작성 현황</S.Title>
        </S.Header>
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-gray-300" />
        </div>
      </S.Container>
    );
  }

  const members = status?.members || [];
  const writtenCount = status?.written || 0;
  const totalCount = status?.total || 0;

  return (
    <S.Container>
      <S.Header>
        <S.Title>오늘 작성 현황</S.Title>
        <S.Count>{writtenCount} / {totalCount}</S.Count>
      </S.Header>

      <S.MemberList>
        {members.map((member, index) => (
          <S.MemberItem key={member.oderId || index}>
            <S.MemberInfo>
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatarUrl || ""} alt={member.nickname} />
                <AvatarFallback>{member.nickname.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <S.MemberName>{member.nickname}</S.MemberName>
            </S.MemberInfo>
            
            <S.StatusIndicator $isComplete={member.hasWrittenToday}>
              {member.hasWrittenToday ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <Clock size={14} />
              )}
            </S.StatusIndicator>
          </S.MemberItem>
        ))}
        {members.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-400">
            멤버 정보를 불러올 수 없습니다.
          </div>
        )}
      </S.MemberList>
    </S.Container>
  );
}
