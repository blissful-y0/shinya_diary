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

  // public_id로 그룹 ID 조회
  const { data: group } = await supabase
    .from("groups")
    .select("id")
    .eq("public_id", publicId)
    .single();

  if (!group) {
    return apiError("그룹을 찾을 수 없습니다", 404);
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user!.id)
    .single();

  if (!membership) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  const { data, error: queryError } = await supabase
    .from("groups")
    .select("id, public_id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
    .eq("id", group.id)
    .single();

  if (queryError || !data) {
    return apiError("그룹 조회 실패", 500);
  }

  return apiResponse(data);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { publicId } = await params;
  const body = await request.json();

  const { data: group } = await supabase
    .from("groups")
    .select("id, owner_id")
    .eq("public_id", publicId)
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
    .eq("id", group.id);

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  return apiResponse({ success: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { publicId } = await params;

  const { data: group } = await supabase
    .from("groups")
    .select("id, owner_id")
    .eq("public_id", publicId)
    .single();

  if (!group || group.owner_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  const { error: deleteError } = await supabase
    .from("groups")
    .delete()
    .eq("id", group.id);

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  return apiResponse({ success: true });
}
