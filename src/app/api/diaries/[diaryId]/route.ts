import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ diaryId: string }>;
}

/**
 * GET /api/diaries/[diaryId] - 다이어리 상세 조회
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth();
  if (error) return error;

  const { diaryId } = await params;
  const supabase = await createClient();

  // 다이어리 조회
  const { data: diary, error: queryError } = await supabase
    .from("diaries")
    .select("*")
    .eq("id", diaryId)
    .single();

  if (queryError || !diary) {
    return apiError("다이어리를 찾을 수 없습니다", 404);
  }

  // 작성자 정보 조회
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

/**
 * PATCH /api/diaries/[diaryId] - 다이어리 수정
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const { diaryId } = await params;
  const body = await request.json();
  const supabase = await createClient();

  // 본인 다이어리인지 확인
  const { data: diary } = await supabase
    .from("diaries")
    .select("user_id")
    .eq("id", diaryId)
    .single();

  if (!diary || diary.user_id !== user!.id) {
    return apiError("권한이 없습니다", 403);
  }

  const updateData: Record<string, unknown> = {};
  if (body.content !== undefined) updateData.content = body.content;
  if (body.imageUrl !== undefined) updateData.image_url = body.imageUrl;
  if (body.stickerData !== undefined) updateData.sticker_data = body.stickerData;

  const { error: updateError } = await supabase
    .from("diaries")
    .update(updateData)
    .eq("id", diaryId);

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  return apiResponse({ success: true });
}
