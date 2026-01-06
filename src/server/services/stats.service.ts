import { SupabaseClient } from "@supabase/supabase-js";
import { statsRepo } from "../repositories/stats.repo";
import { memberRepo } from "../repositories/member.repo";
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

function getDaysInWeekSoFar(): number {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? 7 : day;
}

function getDaysInMonthSoFar(): number {
  return new Date().getDate();
}

async function resolveGroupId(db: SupabaseClient, publicId: string): Promise<string> {
  const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
  if (error || !group) {
    throw new ApiException("그룹을 찾을 수 없습니다", 404);
  }
  return group.id;
}

export const statsService = {
  async getUserStats(db: SupabaseClient, userId: string, groupPublicId: string) {
    const groupId = await resolveGroupId(db, groupPublicId);

    const isMember = await memberRepo.isMember(db, groupId, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const today = new Date();
    const weekStart = getWeekStart(today);
    const monthStart = getMonthStart(today);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [diaryDatesResult, weeklyResult, monthlyResult, diaryIdsResult] = await Promise.all([
      statsRepo.getDiaryDatesForStreak(db, groupId, userId),
      statsRepo.getWeeklyWrittenCount(db, groupId, userId, weekStart),
      statsRepo.getMonthlyWrittenCount(db, groupId, userId, monthStart),
      statsRepo.getUserDiaryIds(db, groupId, userId),
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

    return {
      streak,
      weekWritten: weeklyResult.count ?? 0,
      weekTotal: getDaysInWeekSoFar(),
      monthWritten: monthlyResult.count ?? 0,
      monthTotal: getDaysInMonthSoFar(),
      recentComments: commentsResult.count ?? 0,
    };
  },

  async getCalendar(db: SupabaseClient, userId: string, groupPublicId: string, year: number, month: number) {
    const groupId = await resolveGroupId(db, groupPublicId);

    const isMember = await memberRepo.isMember(db, groupId, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    const { data, error } = await statsRepo.getCalendarData(
      db,
      groupId,
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

  async getGroupStatus(db: SupabaseClient, userId: string, groupPublicId: string) {
    const groupId = await resolveGroupId(db, groupPublicId);

    const isMember = await memberRepo.isMember(db, groupId, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const today = new Date().toISOString().split("T")[0];

    const [membersResult, todayDiariesResult] = await Promise.all([
      memberRepo.findByGroupId(db, groupId),
      statsRepo.getTodayGroupStatus(db, groupId, today),
    ]);

    const members = membersResult.data ?? [];
    const writtenUserIds = new Set(todayDiariesResult.data?.map((d) => d.user_id) ?? []);

    const memberStatus = members.map((m) => ({
      oderId: m.user_id,
      nickname: m.nickname || "익명",
      avatarUrl: m.avatar_url,
      hasWrittenToday: writtenUserIds.has(m.user_id),
    }));

    return {
      total: members.length,
      written: writtenUserIds.size,
      members: memberStatus,
    };
  },
};
