"use client";

import { Check, PenLine } from "lucide-react";
import * as S from "./TodayWritingCard.styles";

interface TodayWritingCardProps {
  hasWritten: boolean;
  groupId: string;
}

export default function TodayWritingCard({ hasWritten, groupId }: TodayWritingCardProps) {
  if (hasWritten) {
    return (
      <S.Card>
        <S.CompletedBadge>
          <S.CheckIcon>
            <Check size={24} strokeWidth={3} />
          </S.CheckIcon>
          <S.Title>오늘의 일기 완료!</S.Title>
          <S.Subtitle>
            오늘 하루도 기록해 주셔서 감사합니다.<br />
            내일도 잊지 말고 찾아와주세요.
          </S.Subtitle>
        </S.CompletedBadge>
      </S.Card>
    );
  }

  return (
    <S.Card>
      <S.Title>아직 오늘의 기록이 없어요</S.Title>
      <S.Subtitle>
        오늘 하루는 어떠셨나요?<br />
        소중한 하루를 기록으로 남겨보세요.
      </S.Subtitle>
      <S.StyledLink href={`/groups/${groupId}/write`}>
        <PenLine size={16} />
        일기 쓰러 가기
      </S.StyledLink>
    </S.Card>
  );
}
