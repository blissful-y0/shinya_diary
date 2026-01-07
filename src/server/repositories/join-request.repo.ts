import { SupabaseClient } from "@supabase/supabase-js";

export const joinRequestRepo = {
  async findPendingByGroupId(db: SupabaseClient, groupId: string) {
    return db
      .from("join_requests")
      .select(`
        id,
        user_id,
        group_id,
        status,
        created_at,
        profiles:user_id(nickname, avatar_url)
      `)
      .eq("group_id", groupId)
      .eq("status", "pending")
      .order("created_at", { ascending: true });
  },

  async findById(db: SupabaseClient, requestId: string) {
    return db
      .from("join_requests")
      .select("id, user_id, group_id, status, created_at")
      .eq("id", requestId)
      .single();
  },

  async findByGroupAndUser(db: SupabaseClient, groupId: string, userId: string) {
    return db
      .from("join_requests")
      .select("id, status")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .maybeSingle();
  },

  async create(db: SupabaseClient, data: { groupId: string; userId: string }) {
    return db
      .from("join_requests")
      .insert({
        group_id: data.groupId,
        user_id: data.userId,
        status: "pending",
      })
      .select("id")
      .single();
  },

  async updateStatus(db: SupabaseClient, requestId: string, status: "approved" | "rejected") {
    return db
      .from("join_requests")
      .update({ status })
      .eq("id", requestId)
      .select();
  },

  async delete(db: SupabaseClient, requestId: string) {
    return db.from("join_requests").delete().eq("id", requestId);
  },
};
