import { SupabaseClient } from "@supabase/supabase-js";

export const statsRepo = {
  async getReceivedCommentsCount(db: SupabaseClient, diaryIds: string[], userId: string, since: string) {
    if (diaryIds.length === 0) return { count: 0, error: null };
    
    return db
      .from("comments")
      .select("id", { count: "exact", head: true })
      .in("diary_id", diaryIds)
      .neq("user_id", userId)
      .is("deleted_at", null)
      .gte("created_at", since);
  },

  async getAllDiaryDatesForStreak(db: SupabaseClient, userId: string) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return db
      .from("diaries")
      .select("date")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", oneYearAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });
  },

  async getAllWeeklyWrittenDays(db: SupabaseClient, userId: string, weekStart: string) {
    return db
      .from("diaries")
      .select("date")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", weekStart);
  },

  async getAllMonthlyWrittenDays(db: SupabaseClient, userId: string, monthStart: string) {
    return db
      .from("diaries")
      .select("date")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", monthStart);
  },

  async getAllUserDiaryIds(db: SupabaseClient, userId: string) {
    return db
      .from("diaries")
      .select("id")
      .eq("user_id", userId)
      .is("deleted_at", null);
  },

  async getAllCalendarData(db: SupabaseClient, userId: string, monthStart: string, monthEnd: string) {
    return db
      .from("diaries")
      .select("date")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", monthStart)
      .lt("date", monthEnd)
      .order("date", { ascending: true });
  },

  async getAllGroupsTodayStatus(db: SupabaseClient, groupIds: string[], today: string) {
    if (groupIds.length === 0) return { data: [], error: null };

    return db
      .from("diaries")
      .select("group_id, user_id")
      .in("group_id", groupIds)
      .eq("date", today)
      .is("deleted_at", null);
  },
};
