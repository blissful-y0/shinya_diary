import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ groupId: string }>;
}

/**
 * GET /api/groups/[groupId] - 그룹 상세 조회
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { groupId } = await params;
  const supabase = await createClient();

  const { data, error: queryError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (queryError) {
    return apiError("그룹 조회 실패", 500);
  }

  if (!data) {
    return apiError("그룹을 찾을 수 없습니다", 404);
  }

  return apiResponse(data);
}

/**
 * PATCH /api/groups/[groupId] - 그룹 수정
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { groupId } = await params;
  const body = await request.json();
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

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.iconUrl !== undefined) updateData.icon_url = body.iconUrl;
  if (body.coverImageUrl !== undefined) updateData.cover_image_url = body.coverImageUrl;

  const { error: updateError } = await supabase
    .from("groups")
    .update(updateData)
    .eq("id", groupId);

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  return apiResponse({ success: true });
}

/**
 * DELETE /api/groups/[groupId] - 그룹 삭제
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

  const { error: deleteError } = await supabase
    .from("groups")
    .delete()
    .eq("id", groupId);

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  return apiResponse({ success: true });
}
