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

  // user_id 조건으로 권한 확인 + 업데이트를 한 번에 처리
  const { data, error: updateError } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", user!.id)
    .select("id");

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  if (!data || data.length === 0) {
    return apiError("권한이 없습니다", 403);
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

  // user_id 조건으로 권한 확인 + 삭제를 한 번에 처리
  const { data, error: deleteError } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user!.id)
    .select("id");

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  if (!data || data.length === 0) {
    return apiError("권한이 없습니다", 403);
  }

  return apiResponse({ success: true });
}
