import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

/**
 * GET /api/groups/[groupId]/members - 그룹 멤버 목록 조회
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { groupId } = await params;
  const supabase = await createClient();

  // 그룹 방장 정보
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (groupError) {
    return apiError("그룹 조회 실패", 500);
  }

  // 멤버 목록
  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });

  if (memberError) {
    return apiError("멤버 조회 실패", 500);
  }

  const result = members?.map((m) => ({
    ...m,
    isOwner: m.user_id === group?.owner_id,
  }));

  return apiResponse(result);
}
