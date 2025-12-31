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

  // 방장 확인
  const { data: group } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (!group || group.owner_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  // 요청 정보 조회
  const { data: joinRequest, error: requestError } = await supabase
    .from("join_requests")
    .select("*")
    .eq("id", requestId)
    .eq("group_id", groupId)
    .single();

  if (requestError || !joinRequest) {
    return apiError("가입 요청을 찾을 수 없습니다", 404);
  }

  if (joinRequest.status !== "pending") {
    return apiError("이미 처리된 요청입니다", 400);
  }

  if (action === "approve") {
    if (!nickname) {
      return apiError("닉네임이 필요합니다");
    }

    // 멤버 수 확인 (최대 4명)
    const { count } = await supabase
      .from("group_members")
      .select("id", { count: "exact", head: true })
      .eq("group_id", groupId);

    if (count && count >= 4) {
      return apiError("그룹 최대 인원(4명)을 초과했습니다", 400);
    }

    // 요청 상태 변경
    await supabase
      .from("join_requests")
      .update({ status: "approved" })
      .eq("id", requestId);

    // 멤버로 추가
    const { error: memberError } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: joinRequest.user_id,
      nickname,
    });

    if (memberError) {
      return apiError(memberError.message, 500);
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
