"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKorean, isToday } from "@/utils/date";
import * as S from "./DateSelector.styles";

/* =============================================
   날짜 선택 컴포넌트
   - 좌우 화살표로 날짜 이동
   - 오늘 날짜 표시
   ============================================= */

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({
  selectedDate,
  onDateChange,
}: DateSelectorProps) {
  /* 이전 날짜로 이동 */
  const handlePrevDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    onDateChange(prevDate);
  };

  /* 다음 날짜로 이동 (오늘까지만) */
  const handleNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    if (nextDate <= new Date()) {
      onDateChange(nextDate);
    }
  };

  const canGoNext = !isToday(selectedDate);

  return (
    <S.Container>
      <S.NavButton onClick={handlePrevDay} aria-label="이전 날짜">
        <ChevronLeft size={20} />
      </S.NavButton>

      <S.DateDisplay>
        <S.DateText>{formatDateKorean(selectedDate)}</S.DateText>
        {isToday(selectedDate) && <S.TodayBadge>오늘</S.TodayBadge>}
      </S.DateDisplay>

      <S.NavButton
        onClick={handleNextDay}
        disabled={!canGoNext}
        aria-label="다음 날짜"
      >
        <ChevronRight size={20} />
      </S.NavButton>
    </S.Container>
  );
}
