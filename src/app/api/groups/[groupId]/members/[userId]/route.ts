import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ groupId: string; userId: string }>;
}

/**
 * PATCH /api/groups/[groupId]/members/[userId] - 그룹 프로필 수정
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId, userId } = await params;

  // 본인만 수정 가능
  if (user!.id !== userId) {
    return apiError("권한이 없습니다", 403);
  }

  const body = await request.json();
  const supabase = await createClient();

  const updateData: Record<string, unknown> = {};
  if (body.nickname !== undefined) updateData.nickname = body.nickname;
  if (body.avatarUrl !== undefined) updateData.avatar_url = body.avatarUrl;

  const { error: updateError } = await supabase
    .from("group_members")
    .update(updateData)
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  return apiResponse({ success: true });
}

/**
 * DELETE /api/groups/[groupId]/members/[userId] - 멤버 강퇴
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId, userId } = await params;
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

  // 방장 본인은 강퇴 불가
  if (userId === user!.id) {
    return apiError("방장은 강퇴할 수 없습니다", 400);
  }

  const { error: deleteError } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  return apiResponse({ success: true });
}
