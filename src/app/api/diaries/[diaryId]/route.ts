import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ diaryId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  const { diaryId } = await params;

  const { data: diary, error: queryError } = await supabase
    .from("diaries")
    .select("id, group_id, user_id, content, image_url, date, created_at, sticker_data")
    .eq("id", diaryId)
    .single();

  if (queryError || !diary) {
    return apiError("다이어리를 찾을 수 없습니다", 404);
  }

  const { data: member } = await supabase
    .from("group_members")
    .select("nickname, avatar_url")
    .eq("group_id", diary.group_id)
    .eq("user_id", diary.user_id)
    .single();

  return apiResponse({
    ...diary,
    author: member || null,
  });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { diaryId } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.content !== undefined) updateData.content = body.content;
  if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
  if (body.stickerData !== undefined) updateData.sticker_data = body.stickerData;

  const { data, error: updateError } = await supabase
    .from("diaries")
    .update(updateData)
    .eq("id", diaryId)
    .eq("user_id", user!.id)
    .select("id");

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  if (!data || data.length === 0) {
    return apiError("권한이 없습니다", 403);
  }

  return apiResponse({ success: true });
}
