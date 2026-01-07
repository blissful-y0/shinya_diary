import { SupabaseClient } from "@supabase/supabase-js";

export const commentRepo = {
  async findByDiaryId(db: SupabaseClient, diaryId: string) {
    return db
      .from("comments")
      .select("id, diary_id, user_id, content, created_at, updated_at")
      .eq("diary_id", diaryId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
  },

  async findByDiaryIds(db: SupabaseClient, diaryIds: string[]) {
    if (diaryIds.length === 0) return { data: [], error: null };

    return db
      .from("comments")
      .select("id, diary_id, user_id, content, created_at, updated_at")
      .in("diary_id", diaryIds)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });
  },

  async findById(db: SupabaseClient, commentId: string) {
    return db
      .from("comments")
      .select("id, diary_id, user_id, content, created_at, updated_at")
      .eq("id", commentId)
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
      .select("id, diary_id, user_id, content, created_at, updated_at")
      .single();
  },

  async update(db: SupabaseClient, commentId: string, userId: string, content: string) {
    return db
      .from("comments")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", commentId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id");
  },

  async softDelete(db: SupabaseClient, commentId: string, userId: string) {
    return db
      .from("comments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", commentId)
      .eq("user_id", userId)
      .is("deleted_at", null)
      .select("id");
  },
};
