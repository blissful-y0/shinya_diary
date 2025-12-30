"use client";

import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKorean, isSameDay, isToday } from "@/utils/date";

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
    <Container>
      <NavButton onClick={handlePrevDay} aria-label="이전 날짜">
        <ChevronLeft size={20} />
      </NavButton>

      <DateDisplay>
        <DateText>{formatDateKorean(selectedDate)}</DateText>
        {isToday(selectedDate) && <TodayBadge>오늘</TodayBadge>}
      </DateDisplay>

      <NavButton
        onClick={handleNextDay}
        disabled={!canGoNext}
        aria-label="다음 날짜"
      >
        <ChevronRight size={20} />
      </NavButton>
    </Container>
  );
}

/* 스타일 컴포넌트 - 계층 구조 */
const Container = styled.div`
  /* 컨테이너 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  /* 네비게이션 버튼 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: ${({ disabled }) =>
    disabled ? "var(--muted-foreground)" : "var(--foreground)"};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: var(--accent);
  }
`;

const DateDisplay = styled.div`
  /* 날짜 표시 영역 */
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DateText = styled.span`
  /* 날짜 텍스트 */
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
`;

const TodayBadge = styled.span`
  /* 오늘 뱃지 */
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background-color: var(--primary);
  border-radius: 10px;
`;
