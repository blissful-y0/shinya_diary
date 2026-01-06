import { SupabaseClient } from "@supabase/supabase-js";
import { statsRepo } from "../repositories/stats.repo";
import { groupRepo } from "../repositories/group.repo";
import { ApiException } from "@/lib/api/utils";

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function getMonthStart(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d.toISOString().split("T")[0];
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const dateSet = new Set(dates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = new Date(today);

  const todayStr = currentDate.toISOString().split("T")[0];
  if (!dateSet.has(todayStr)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (true) {
    const dateStr = currentDate.toISOString().split("T")[0];
    if (dateSet.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const statsService = {
  async getAggregatedStats(db: SupabaseClient, userId: string) {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const monthStart = getMonthStart(today);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [diaryDatesResult, weeklyResult, monthlyResult, diaryIdsResult] = await Promise.all([
      statsRepo.getAllDiaryDatesForStreak(db, userId),
      statsRepo.getAllWeeklyWrittenDays(db, userId, weekStart),
      statsRepo.getAllMonthlyWrittenDays(db, userId, monthStart),
      statsRepo.getAllUserDiaryIds(db, userId),
    ]);

    const diaryIds = diaryIdsResult.data?.map((d) => d.id) ?? [];
    const commentsResult = await statsRepo.getReceivedCommentsCount(
      db,
      diaryIds,
      userId,
      thirtyDaysAgo.toISOString()
    );

    const dates = diaryDatesResult.data?.map((d) => d.date) ?? [];
    const streak = calculateStreak(dates);

    const weeklyDates = new Set(weeklyResult.data?.map((d) => d.date) ?? []);
    const monthlyDates = new Set(monthlyResult.data?.map((d) => d.date) ?? []);

    return {
      streak,
      weekWritten: weeklyDates.size,
      monthWritten: monthlyDates.size,
      recentComments: commentsResult.count ?? 0,
    };
  },

  async getAggregatedCalendar(db: SupabaseClient, userId: string, year: number, month: number) {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    const { data, error } = await statsRepo.getAllCalendarData(
      db,
      userId,
      monthStart.toISOString().split("T")[0],
      monthEnd.toISOString().split("T")[0]
    );

    if (error) {
      throw new ApiException("캘린더 데이터 조회 실패", 500);
    }

    const writtenDates = new Set(data?.map((d) => d.date) ?? []);
    const totalDays = new Date(year, month, 0).getDate();
    const startDay = monthStart.getDay();

    const dates = [];
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dates.push({
        date: dateStr,
        hasWritten: writtenDates.has(dateStr),
      });
    }

    return {
      dates,
      monthInfo: {
        year,
        month,
        startDay,
        totalDays,
      },
    };
  },

  async getAllGroupsStatus(db: SupabaseClient, userId: string) {
    const { data: memberships, error: memberError } = await groupRepo.findByMembership(db, userId);
    if (memberError) {
      throw new ApiException("그룹 정보 조회 실패", 500);
    }

    if (!memberships || memberships.length === 0) {
      return { groups: [], totalGroups: 0, writtenGroups: 0 };
    }

    const groupIds = memberships.map((m) => m.group_id);
    const today = new Date().toISOString().split("T")[0];

    const [groupsResult, todayDiariesResult] = await Promise.all([
      groupRepo.findByIds(db, groupIds),
      statsRepo.getAllGroupsTodayStatus(db, groupIds, today),
    ]);

    const groups = groupsResult.data ?? [];
    const writtenGroupIds = new Set(
      todayDiariesResult.data?.filter((d) => d.user_id === userId).map((d) => d.group_id) ?? []
    );

    const groupStatus = groups.map((g) => ({
      id: g.public_id,
      name: g.name,
      iconUrl: g.icon_url,
      hasWrittenToday: writtenGroupIds.has(g.id),
    }));

    return {
      groups: groupStatus,
      totalGroups: groups.length,
      writtenGroups: writtenGroupIds.size,
    };
  },
};
