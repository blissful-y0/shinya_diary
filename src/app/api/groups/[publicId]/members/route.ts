import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { publicId } = await params;

  const [membershipResult, groupResult] = await Promise.all([
    supabase
      .from("group_members")
      .select("id")
      .eq("group_id", publicId)
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("groups")
      .select("owner_id")
      .eq("id", groupId)
      .single(),
  ]);

  if (!membershipResult.data) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  if (groupResult.error) {
    return apiError("그룹 조회 실패", 500);
  }

  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select("id, user_id, group_id, nickname, avatar_url, joined_at")
    .eq("group_id", publicId)
    .order("joined_at", { ascending: true });

  if (memberError) {
    return apiError("멤버 조회 실패", 500);
  }

  const result = members?.map((m) => ({
    ...m,
    isOwner: m.user_id === groupResult.data?.owner_id,
  }));

  return apiResponse(result);
}
