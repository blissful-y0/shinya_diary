import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ groupId: string; requestId: string }>;
}

/**
 * PATCH /api/groups/[groupId]/join-requests/[requestId] - 가입 요청 승인/거절
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId, requestId } = await params;
  const body = await request.json();
  const { action, nickname } = body; // action: 'approve' | 'reject'

  if (!action || !["approve", "reject"].includes(action)) {
    return apiError("유효하지 않은 액션입니다");
  }

  const supabase = await createClient();

  // 방장 확인 + 요청 정보 + 멤버 수를 병렬로 조회
  const [groupResult, requestResult, memberCountResult] = await Promise.all([
    supabase
      .from("groups")
      .select("owner_id")
      .eq("id", groupId)
      .single(),
    supabase
      .from("join_requests")
      .select("user_id, status")
      .eq("id", requestId)
      .eq("group_id", groupId)
      .single(),
    supabase
      .from("group_members")
      .select("id", { count: "exact", head: true })
      .eq("group_id", groupId),
  ]);

  if (!groupResult.data || groupResult.data.owner_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  if (!requestResult.data) {
    return apiError("가입 요청을 찾을 수 없습니다", 404);
  }

  if (requestResult.data.status !== "pending") {
    return apiError("이미 처리된 요청입니다", 400);
  }

  if (action === "approve") {
    if (!nickname) {
      return apiError("닉네임이 필요합니다");
    }

    if (memberCountResult.count && memberCountResult.count >= 4) {
      return apiError("그룹 최대 인원(4명)을 초과했습니다", 400);
    }

    // 요청 상태 변경 + 멤버 추가를 병렬로 처리
    const [, memberResult] = await Promise.all([
      supabase
        .from("join_requests")
        .update({ status: "approved" })
        .eq("id", requestId),
      supabase.from("group_members").insert({
        group_id: groupId,
        user_id: requestResult.data.user_id,
        nickname,
      }),
    ]);

    if (memberResult.error) {
      return apiError(memberResult.error.message, 500);
    }
  } else {
    // 거절
    await supabase
      .from("join_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);
  }

  return apiResponse({ success: true });
}
