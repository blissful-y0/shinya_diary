import { SupabaseClient } from "@supabase/supabase-js";

export const commentRepo = {
  async findByDiaryId(db: SupabaseClient, diaryId: string) {
    return db
      .from("comments")
      .select("id, public_id, diary_id, user_id, content, created_at, updated_at")
      .eq("diary_id", diaryId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
  },

  async findByDiaryIds(db: SupabaseClient, diaryIds: string[]) {
    if (diaryIds.length === 0) return { data: [], error: null };

    return db
      .from("comments")
      .select("id, public_id, diary_id, user_id, content, created_at, updated_at")
      .in("diary_id", diaryIds)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
  },

  async findByPublicId(db: SupabaseClient, publicId: string) {
    return db
      .from("comments")
      .select("id, public_id, diary_id, user_id, content, created_at, updated_at")
      .eq("public_id", publicId)
      .is("deleted_at", null)
      .single();
  },

  async countByDiaryId(db: SupabaseClient, diaryId: string) {
    return db
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("diary_id", diaryId)
      .is("deleted_at", null);
  },

  async create(db: SupabaseClient, data: { diaryId: string; userId: string; content: string }) {
    return db
      .from("comments")
      .insert({
        diary_id: data.diaryId,
        user_id: data.userId,
        content: data.content,
      })
      .select("id, public_id, diary_id, user_id, content, created_at, updated_at")
      .single();
  },

  async update(db: SupabaseClient, publicId: string, userId: string, content: string) {
    return db
      .from("comments")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("public_id", publicId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id, public_id");
  },

  async softDelete(db: SupabaseClient, publicId: string, userId: string) {
    return db
      .from("comments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("public_id", publicId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id, public_id");
  },
};
