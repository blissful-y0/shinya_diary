import { SupabaseClient } from "@supabase/supabase-js";

export const memberRepo = {
  async isMember(db: SupabaseClient, groupId: string, userId: string) {
    const { data } = await db
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .maybeSingle();
    return !!data;
  },

  async findByGroupAndUser(db: SupabaseClient, groupId: string, userId: string) {
    return db
      .from("group_members")
      .select("id, user_id, group_id, nickname, avatar_url, joined_at")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .maybeSingle();
  },

  async findByGroupId(db: SupabaseClient, groupId: string) {
    return db
      .from("group_members")
      .select("id, user_id, group_id, nickname, avatar_url, joined_at")
      .eq("group_id", groupId)
      .order("joined_at", { ascending: true });
  },

  async getMembersWithProfiles(db: SupabaseClient, groupId: string, userIds: string[]) {
    if (userIds.length === 0) return { data: [], error: null };

    return db
      .from("group_members")
      .select(`
        user_id,
        nickname,
        avatar_url,
        profiles!inner(public_id)
      `)
      .eq("group_id", groupId)
      .in("user_id", userIds);
  },

  async create(db: SupabaseClient, data: { groupId: string; userId: string; nickname: string }) {
    return db
      .from("group_members")
      .insert({
        group_id: data.groupId,
        user_id: data.userId,
        nickname: data.nickname,
      })
      .select()
      .single();
  },

  async update(
    db: SupabaseClient,
    groupId: string,
    userId: string,
    data: { nickname?: string; avatarUrl?: string | null }
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    return db
      .from("group_members")
      .update(updateData)
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .select();
  },

  async delete(db: SupabaseClient, groupId: string, userId: string) {
    return db
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);
  },
};
