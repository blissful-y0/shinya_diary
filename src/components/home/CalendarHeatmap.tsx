"use client";

import { CalendarData } from "@/lib/api/client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import * as S from "./CalendarHeatmap.styles";

interface CalendarHeatmapProps {
  calendar: CalendarData | undefined;
  isLoading: boolean;
  onMonthChange: (year: number, month: number) => void;
}

export default function CalendarHeatmap({
  calendar,
  isLoading,
  onMonthChange,
}: CalendarHeatmapProps) {
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  
  const handlePrevMonth = () => {
    if (!calendar?.monthInfo) return;
    const { year, month } = calendar.monthInfo;
    const newDate = new Date(year, month - 2, 1);
    onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    if (!calendar?.monthInfo) return;
    const { year, month } = calendar.monthInfo;
    const newDate = new Date(year, month, 1);
    onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  if (isLoading && !calendar) {
    return (
      <S.Container>
        <S.LoadingOverlay>
          <Loader2 className="animate-spin" />
        </S.LoadingOverlay>
      </S.Container>
    );
  }

  const { year, month, startDay, totalDays } = calendar?.monthInfo || {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    startDay: 0,
    totalDays: 0,
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const currentDay = today.getDate();

  const cells = [];
  
  for (let i = 0; i < startDay; i++) {
    cells.push(<S.DayCell key={`prev-${i}`} $isCurrentMonth={false} />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayData = calendar?.dates.find(date => date.date === dateStr);
    const hasWritten = dayData?.hasWritten || false;
    const isToday = isCurrentMonth && d === currentDay;

    cells.push(
      <S.DayCell 
        key={d} 
        $isToday={isToday} 
        $hasWritten={hasWritten}
        $isCurrentMonth={true}
      >
        {d}
      </S.DayCell>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <S.NavButton onClick={handlePrevMonth} disabled={isLoading}>
          <ChevronLeft size={16} />
        </S.NavButton>
        <S.MonthTitle>
          {year}. {String(month).padStart(2, '0')}
        </S.MonthTitle>
        <S.NavButton onClick={handleNextMonth} disabled={isLoading}>
          <ChevronRight size={16} />
        </S.NavButton>
      </S.Header>

      <S.Grid>
        {weekDays.map(day => (
          <S.WeekDay key={day}>{day}</S.WeekDay>
        ))}
        {cells}
      </S.Grid>
    </S.Container>
  );
}
