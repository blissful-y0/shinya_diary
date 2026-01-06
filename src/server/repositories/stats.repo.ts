import { SupabaseClient } from "@supabase/supabase-js";

export const statsRepo = {
  async getDiaryDatesForStreak(db: SupabaseClient, groupId: string, userId: string) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return db
      .from("diaries")
      .select("date")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", oneYearAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });
  },

  async getWeeklyWrittenCount(db: SupabaseClient, groupId: string, userId: string, weekStart: string) {
    return db
      .from("diaries")
      .select("date", { count: "exact", head: true })
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", weekStart);
  },

  async getMonthlyWrittenCount(db: SupabaseClient, groupId: string, userId: string, monthStart: string) {
    return db
      .from("diaries")
      .select("date", { count: "exact", head: true })
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", monthStart);
  },

  async getUserDiaryIds(db: SupabaseClient, groupId: string, userId: string) {
    return db
      .from("diaries")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .is("deleted_at", null);
  },

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

  async getCalendarData(db: SupabaseClient, groupId: string, userId: string, monthStart: string, monthEnd: string) {
    return db
      .from("diaries")
      .select("date")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("date", monthStart)
      .lt("date", monthEnd)
      .order("date", { ascending: true });
  },

  async getTodayGroupStatus(db: SupabaseClient, groupId: string, today: string) {
    return db
      .from("diaries")
      .select("user_id")
      .eq("group_id", groupId)
      .eq("date", today)
      .is("deleted_at", null);
  },
};
