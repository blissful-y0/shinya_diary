"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDateKorean, formatDateISO, isToday } from "@/utils/date";
import * as S from "./DateSelector.styles";

/* =============================================
   날짜 선택 컴포넌트
   - 좌우 화살표로 날짜 이동
   - 날짜 클릭 시 달력으로 직접 선택
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
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  /* 날짜 직접 선택 */
  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime()) && newDate <= new Date()) {
      onDateChange(newDate);
    }
  };

  /* 날짜 입력창 열기 */
  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  const canGoNext = !isToday(selectedDate);
  const todayStr = formatDateISO(new Date());

  return (
    <S.Container>
      <S.NavButton onClick={handlePrevDay} aria-label="이전 날짜">
        <ChevronLeft size={20} />
      </S.NavButton>

      <S.DateDisplay onClick={openDatePicker}>
        <S.DateText>{formatDateKorean(selectedDate)}</S.DateText>
        {isToday(selectedDate) && <S.TodayBadge>오늘</S.TodayBadge>}
        <Calendar size={16} />
        <S.HiddenDateInput
          ref={dateInputRef}
          type="date"
          value={formatDateISO(selectedDate)}
          max={todayStr}
          onChange={handleDateSelect}
        />
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
