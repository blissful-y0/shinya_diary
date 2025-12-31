import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ commentId: string }>;
}

/**
 * PATCH /api/comments/[commentId] - 댓글 수정
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { commentId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) {
    return apiError("content는 필수입니다");
  }

  const supabase = await createClient();

  // 본인 댓글인지 확인
  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (!comment || comment.user_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  const { error: updateError } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId);

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  return apiResponse({ success: true });
}

/**
 * DELETE /api/comments/[commentId] - 댓글 삭제
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { commentId } = await params;
  const supabase = await createClient();

  // 본인 댓글인지 확인
  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (!comment || comment.user_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  const { error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  return apiResponse({ success: true });
}
