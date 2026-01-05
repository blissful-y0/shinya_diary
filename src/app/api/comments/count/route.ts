import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  const diaryId = request.nextUrl.searchParams.get("diaryId");

  if (!diaryId) {
    return apiError("diaryId는 필수입니다");
  }

  const { count, error: queryError } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("diary_id", diaryId)
    .is("deleted_at", null);

  if (queryError) {
    return apiError("댓글 수 조회 실패", 500);
  }

  return apiResponse({ count: count || 0 });
}
