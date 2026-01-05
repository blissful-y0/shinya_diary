import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return apiError("초대 코드가 필요합니다");
  }

  const { data, error: queryError } = await supabase
    .from("groups")
    .select("id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
    .eq("invite_code", code.toUpperCase())
    .single();

  if (queryError && queryError.code !== "PGRST116") {
    return apiError("그룹 조회 실패", 500);
  }

  if (!data) {
    return apiError("그룹을 찾을 수 없습니다", 404);
  }

  return apiResponse(data);
}
