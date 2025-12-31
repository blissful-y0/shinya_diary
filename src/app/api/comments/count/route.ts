import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/comments/count?diaryId= - 댓글 수 조회
 */
export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const diaryId = request.nextUrl.searchParams.get("diaryId");

  if (!diaryId) {
    return apiError("diaryId는 필수입니다");
  }

  const supabase = await createClient();

  const { count, error: queryError } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("diary_id", diaryId);

  if (queryError) {
    return apiError("댓글 수 조회 실패", 500);
  }

  return apiResponse({ count: count || 0 });
}
