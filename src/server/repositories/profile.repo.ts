import { SupabaseClient } from "@supabase/supabase-js";

export const profileRepo = {
  async findById(db: SupabaseClient, userId: string) {
    return db
      .from("profiles")
      .select("id, email, nickname, avatar_url, provider, created_at, updated_at")
      .eq("id", userId)
      .single();
  },

  async update(db: SupabaseClient, userId: string, data: { nickname?: string; avatarUrl?: string | null }) {
    const updateData: Record<string, unknown> = {};
    if (data.nickname !== undefined) updateData.nickname = data.nickname;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    return db
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select("id, email, nickname, avatar_url, provider, created_at, updated_at")
      .single();
  },
};
