import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

/**
 * GET /api/diaries?groupId=&date= - 날짜별 다이어리 목록 조회
 */
export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  const groupId = request.nextUrl.searchParams.get("groupId");
  const date = request.nextUrl.searchParams.get("date");

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const supabase = await createClient();

  const { data, error: queryError } = await supabase
    .from("diaries")
    .select(`
      *,
      author:group_members!inner(
        nickname,
        avatar_url
      )
    `)
    .eq("group_id", groupId)
    .eq("date", date)
    .eq("group_members.group_id", groupId)
    .order("created_at", { ascending: false });

  if (queryError) {
    return apiError("다이어리 조회 실패", 500);
  }

  return apiResponse(data);
}

/**
 * POST /api/diaries - 다이어리 작성
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { groupId, content, imageUrl, date } = body;

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const supabase = await createClient();

  // 멤버 확인
  const { data: member } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user!.id)
    .single();

  if (!member) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  // 이미 작성했는지 확인
  const { data: existing } = await supabase
    .from("diaries")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user!.id)
    .eq("date", date)
    .single();

  if (existing) {
    return apiError("이미 오늘의 다이어리를 작성했습니다", 400);
  }

  const { data: diary, error: insertError } = await supabase
    .from("diaries")
    .insert({
      group_id: groupId,
      user_id: user!.id,
      content: content || null,
      image_url: imageUrl || null,
      date,
    })
    .select()
    .single();

  if (insertError) {
    return apiError(insertError.message, 500);
  }

  return apiResponse(diary, 201);
}
