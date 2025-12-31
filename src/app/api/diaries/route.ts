import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/diaries?groupId=&date= - 날짜별 다이어리 목록 조회
 *
 * Read-after-Write: 오늘 날짜는 자신이 작성해야 다른 사람 글을 볼 수 있음
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const groupId = request.nextUrl.searchParams.get("groupId");
  const date = request.nextUrl.searchParams.get("date");

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const supabase = await createClient();

  // 오늘 날짜인지 확인
  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  // 오늘이면 먼저 작성 여부 확인
  let hasWrittenToday = false;
  if (isToday) {
    const { data: myDiary } = await supabase
      .from("diaries")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user!.id)
      .eq("date", date)
      .single();

    hasWrittenToday = !!myDiary;
  }

  // 다이어리 조회
  let query = supabase
    .from("diaries")
    .select("*")
    .eq("group_id", groupId)
    .eq("date", date)
    .order("created_at", { ascending: false });

  // 오늘인데 아직 안 썼으면 자기 글만 (없으면 빈 배열)
  if (isToday && !hasWrittenToday) {
    query = query.eq("user_id", user!.id);
  }

  const { data: diaries, error: queryError } = await query;

  if (queryError) {
    console.error("Diary query error:", queryError);
    return apiError(`다이어리 조회 실패: ${queryError.message}`, 500);
  }

  // 작성자 정보 별도 조회
  const userIds = [...new Set(diaries?.map(d => d.user_id) || [])];
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, nickname, avatar_url")
    .eq("group_id", groupId)
    .in("user_id", userIds.length > 0 ? userIds : ["none"]);

  const memberMap = new Map(members?.map(m => [m.user_id, m]) || []);

  const data = diaries?.map(diary => ({
    ...diary,
    author: memberMap.get(diary.user_id) || null,
  }));

  return apiResponse(data, 200, { hasWrittenToday });
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
