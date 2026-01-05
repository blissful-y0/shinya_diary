import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const groupId = request.nextUrl.searchParams.get("groupId");
  const date = request.nextUrl.searchParams.get("date");

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const today = new Date().toISOString().split("T")[0];
  const isToday = date === today;

  const { data: allDiaries, error: queryError } = await supabase
    .from("diaries")
    .select("id, group_id, user_id, content, image_url, date, created_at, sticker_data")
    .eq("group_id", groupId)
    .eq("date", date)
    .order("created_at", { ascending: false });

  if (queryError) {
    console.error("Diary query error:", queryError);
    return apiError(`다이어리 조회 실패: ${queryError.message}`, 500);
  }

  const hasWrittenToday = allDiaries?.some(d => d.user_id === user!.id) || false;

  if (isToday && !hasWrittenToday) {
    return apiResponse([], 200, { hasWrittenToday: false });
  }

  const userIds = [...new Set(allDiaries?.map(d => d.user_id) || [])];

  if (userIds.length === 0) {
    return apiResponse([], 200, { hasWrittenToday });
  }

  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, nickname, avatar_url")
    .eq("group_id", groupId)
    .in("user_id", userIds);

  const memberMap = new Map(members?.map(m => [m.user_id, m]) || []);

  const data = allDiaries?.map(diary => ({
    ...diary,
    author: memberMap.get(diary.user_id) || null,
  }));

  return apiResponse(data, 200, { hasWrittenToday });
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { groupId, content, imageUrl, date } = body;

  if (!groupId || !date) {
    return apiError("groupId와 date는 필수입니다");
  }

  const [memberResult, existingResult] = await Promise.all([
    supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user!.id)
      .single(),
    supabase
      .from("diaries")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user!.id)
      .eq("date", date)
      .single(),
  ]);

  if (!memberResult.data) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  if (existingResult.data) {
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
