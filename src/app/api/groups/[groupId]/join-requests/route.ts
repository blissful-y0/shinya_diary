import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

/**
 * GET /api/groups/[groupId]/join-requests - 가입 요청 목록 조회
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId } = await params;
  const supabase = await createClient();

  // 방장 확인
  const { data: group } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (!group || group.owner_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  const { data, error: queryError } = await supabase
    .from("join_requests")
    .select(`
      *,
      user:profiles(nickname, avatar_url)
    `)
    .eq("group_id", groupId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (queryError) {
    return apiError("가입 요청 조회 실패", 500);
  }

  return apiResponse(data);
}

/**
 * POST /api/groups/[groupId]/join-requests - 가입 요청 생성
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId } = await params;
  const supabase = await createClient();

  // 멤버 여부 + 기존 요청을 병렬로 확인
  const [memberResult, requestResult] = await Promise.all([
    supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("join_requests")
      .select("id, status")
      .eq("group_id", groupId)
      .eq("user_id", user!.id)
      .eq("status", "pending")
      .single(),
  ]);

  if (memberResult.data) {
    return apiError("이미 그룹 멤버입니다", 400);
  }

  if (requestResult.data) {
    return apiError("이미 가입 요청을 보냈습니다", 400);
  }

  const { error: insertError } = await supabase.from("join_requests").insert({
    group_id: groupId,
    user_id: user!.id,
    status: "pending",
  });

  if (insertError) {
    return apiError(insertError.message, 500);
  }

  return apiResponse({ success: true }, 201);
}
