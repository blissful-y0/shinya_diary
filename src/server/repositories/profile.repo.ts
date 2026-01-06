import { SupabaseClient } from "@supabase/supabase-js";

export const profileRepo = {
  async findById(db: SupabaseClient, userId: string) {
    return db
      .from("profiles")
      .select("id, public_id, email, nickname, avatar_url, provider, created_at, updated_at")
      .eq("id", userId)
      .single();
  },

  async findByPublicId(db: SupabaseClient, publicId: string) {
    return db
      .from("profiles")
      .select("id, public_id, email, nickname, avatar_url, provider, created_at, updated_at")
      .eq("public_id", publicId)
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
      .select("id, public_id, email, nickname, avatar_url, provider, created_at, updated_at")
      .single();
  },
};
