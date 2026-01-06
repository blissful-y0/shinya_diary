import { SupabaseClient } from "@supabase/supabase-js";

export const diaryRepo = {
  async findByGroupAndDate(db: SupabaseClient, groupId: string, date: string) {
    return db
      .from("diaries")
      .select("id, public_id, group_id, user_id, content, image_url, date, created_at, sticker_data")
      .eq("group_id", groupId)
      .eq("date", date)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
  },

  async findByPublicId(db: SupabaseClient, publicId: string) {
    return db
      .from("diaries")
      .select("id, public_id, group_id, user_id, content, image_url, date, created_at, sticker_data")
      .eq("public_id", publicId)
      .is("deleted_at", null)
      .single();
  },

  async findUserDiaryForDate(db: SupabaseClient, groupId: string, userId: string, date: string) {
    return db
      .from("diaries")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("date", date)
      .is("deleted_at", null)
      .maybeSingle();
  },

  async create(
    db: SupabaseClient,
    data: { groupId: string; userId: string; content?: string; imageUrl?: string; date: string }
  ) {
    return db
      .from("diaries")
      .insert({
        group_id: data.groupId,
        user_id: data.userId,
        content: data.content || null,
        image_url: data.imageUrl || null,
        date: data.date,
      })
      .select("id, public_id")
      .single();
  },

  async update(
    db: SupabaseClient,
    publicId: string,
    userId: string,
    data: { content?: string; imageUrl?: string | null; stickerData?: unknown }
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
    if (data.stickerData !== undefined) updateData.sticker_data = data.stickerData;

    return db
      .from("diaries")
      .update(updateData)
      .eq("public_id", publicId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id, public_id");
  },

  async softDelete(db: SupabaseClient, publicId: string, userId: string) {
    return db
      .from("diaries")
      .update({ deleted_at: new Date().toISOString() })
      .eq("public_id", publicId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id, public_id");
  },
};
