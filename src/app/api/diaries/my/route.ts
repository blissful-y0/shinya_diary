import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/diaries/my?groupId=&date= - 내 다이어리 조회
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const groupId = request.nextUrl.searchParams.get("groupId");
  const date = request.nextUrl.searchParams.get("date");

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const supabase = await createClient();

  const { data, error: queryError } = await supabase
    .from("diaries")
    .select("id, group_id, user_id, content, image_url, date, created_at, sticker_data")
    .eq("group_id", groupId)
    .eq("user_id", user!.id)
    .eq("date", date)
    .single();

  if (queryError && queryError.code !== "PGRST116") {
    return apiError("다이어리 조회 실패", 500);
  }

  return apiResponse(data);
}
