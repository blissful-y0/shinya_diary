"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { ko } from "date-fns/locale";
import { formatDateKorean, isToday } from "@/utils/date";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  const [isOpen, setIsOpen] = useState(false);

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
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setIsOpen(false);
    }
  };

  const canGoNext = !isToday(selectedDate);
  const today = new Date();

  return (
    <S.Container>
      <S.NavButton onClick={handlePrevDay} aria-label="이전 날짜">
        <ChevronLeft size={20} />
      </S.NavButton>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <S.DateDisplay>
            <S.DateText>{formatDateKorean(selectedDate)}</S.DateText>
            {isToday(selectedDate) && <S.TodayBadge>오늘</S.TodayBadge>}
            <CalendarIcon size={16} />
          </S.DateDisplay>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date > today}
            initialFocus
            locale={ko}
          />
        </PopoverContent>
      </Popover>

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
