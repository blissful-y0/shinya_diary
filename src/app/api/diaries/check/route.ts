import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const groupId = request.nextUrl.searchParams.get("groupId");
  const date = request.nextUrl.searchParams.get("date");

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const { data, error: queryError } = await supabase
    .from("diaries")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user!.id)
    .eq("date", date)
    .is("deleted_at", null)
    .single();

  if (queryError && queryError.code !== "PGRST116") {
    return apiError("다이어리 확인 실패", 500);
  }

  return apiResponse({ hasWritten: !!data });
}
