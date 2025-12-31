import { createClient } from "@/lib/supabase/client";
import type { Comment } from "@/types/database";

/* =============================================
   코멘트 관련 Supabase 쿼리
   ============================================= */

export interface CommentWithAuthor extends Comment {
  author: {
    nickname: string;
    avatar_url: string | null;
  };
  isOwn: boolean;
}

/**
 * 다이어리의 코멘트 목록 조회
 */
export async function getCommentsByDiary(
  diaryId: string,
  groupId: string,
  currentUserId: string
): Promise<CommentWithAuthor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:group_members!inner(
        nickname,
        avatar_url,
        user_id
      )
    `)
    .eq("diary_id", diaryId)
    .eq("group_members.group_id", groupId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("코멘트 조회 실패:", error);
    return [];
  }

  return (data || []).map((c) => ({
    ...c,
    author: {
      nickname: c.author.nickname || "익명",
      avatar_url: c.author.avatar_url,
    },
    isOwn: c.user_id === currentUserId,
  })) as CommentWithAuthor[];
}

/**
 * 코멘트 개수 조회
 */
export async function getCommentCount(diaryId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("diary_id", diaryId);

  if (error) {
    console.error("코멘트 수 조회 실패:", error);
    return 0;
  }

  return count || 0;
}

/**
 * 코멘트 작성
 */
export async function createComment(
  diaryId: string,
  userId: string,
  content: string
): Promise<{ success: boolean; comment?: Comment; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      diary_id: diaryId,
      user_id: userId,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error("코멘트 작성 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true, comment: data };
}

/**
 * 코멘트 수정
 */
export async function updateComment(
  commentId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId);

  if (error) {
    console.error("코멘트 수정 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 코멘트 삭제
 */
export async function deleteComment(commentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("comments").delete().eq("id", commentId);

  if (error) {
    console.error("코멘트 삭제 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
