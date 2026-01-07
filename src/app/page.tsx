"use client";

import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { useMyStats, useMyCalendar, useAllGroupsStatus } from "@/lib/swr/hooks";
import StatsCard from "@/components/home/StatsCard";
import CalendarHeatmap from "@/components/home/CalendarHeatmap";
import AllGroupsStatusCard from "@/components/home/AllGroupsStatusCard";
import * as S from "./styles/page.styles";

const DAYS_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function formatDate(date: Date): { display: string; dayOfWeek: string } {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = DAYS_KO[date.getDay()];
  
  return {
    display: `${month}월 ${day}일`,
    dayOfWeek,
  };
}

export default function HomePage() {
  const { isLoading: authLoading } = useRequireAuth();
  
  const today = new Date();
  const { display, dayOfWeek } = formatDate(today);
  
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth() + 1);

  const { stats, isLoading: statsLoading } = useMyStats();
  const { calendar, isLoading: calendarLoading } = useMyCalendar(calendarYear, calendarMonth);
  const { status, isLoading: statusLoading } = useAllGroupsStatus();

  const handleMonthChange = (year: number, month: number) => {
    setCalendarYear(year);
    setCalendarMonth(month);
  };

  if (authLoading) {
    return (
      <MobileLayout showHeader={false}>
        <S.Container>
          <S.DateSection>
            <S.DateDisplay>{display}</S.DateDisplay>
            <S.DayOfWeek>{dayOfWeek}</S.DayOfWeek>
          </S.DateSection>
          <S.PlaceholderCard>
            <S.PlaceholderText>로딩 중...</S.PlaceholderText>
          </S.PlaceholderCard>
        </S.Container>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showHeader={false}>
      <S.Container>
        <S.DateSection>
          <S.DateDisplay>{display}</S.DateDisplay>
          <S.DayOfWeek>{dayOfWeek}</S.DayOfWeek>
        </S.DateSection>

        <S.DashboardSection>
          <StatsCard stats={stats} isLoading={statsLoading} />
          <CalendarHeatmap 
            calendar={calendar} 
            isLoading={calendarLoading} 
            onMonthChange={handleMonthChange}
          />
          <AllGroupsStatusCard status={status} isLoading={statusLoading} />
        </S.DashboardSection>
      </S.Container>
    </MobileLayout>
  );
}
