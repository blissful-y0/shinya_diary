import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const diaryId = request.nextUrl.searchParams.get("diaryId");
  const groupId = request.nextUrl.searchParams.get("groupId");

  if (!diaryId || !groupId) {
    return apiError("diaryId와 groupId는 필수입니다");
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user!.id)
    .single();

  if (!membership) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  const { data: comments, error: queryError } = await supabase
    .from("comments")
    .select("id, diary_id, user_id, content, created_at, updated_at")
    .eq("diary_id", diaryId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (queryError) {
    console.error("Comment query error:", queryError);
    return apiError(`댓글 조회 실패: ${queryError.message}`, 500);
  }

  const userIds = [...new Set(comments?.map(c => c.user_id) || [])];
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, nickname, avatar_url")
    .eq("group_id", groupId)
    .in("user_id", userIds.length > 0 ? userIds : ["none"]);

  const memberMap = new Map(members?.map(m => [m.user_id, m]) || []);

  const result = (comments || []).map((c) => ({
    ...c,
    author: {
      nickname: memberMap.get(c.user_id)?.nickname || "익명",
      avatar_url: memberMap.get(c.user_id)?.avatar_url || null,
    },
    isOwn: c.user_id === user!.id,
  }));

  return apiResponse(result);
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { diaryId, content } = body;

  if (!diaryId || !content) {
    return apiError("diaryId와 content는 필수입니다");
  }

  const { data: diary } = await supabase
    .from("diaries")
    .select("group_id")
    .eq("id", diaryId)
    .is("deleted_at", null)
    .single();

  if (!diary) {
    return apiError("다이어리를 찾을 수 없습니다", 404);
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", diary.group_id)
    .eq("user_id", user!.id)
    .single();

  if (!membership) {
    return apiError("그룹 멤버가 아닙니다", 403);
  }

  const { data, error: insertError } = await supabase
    .from("comments")
    .insert({
      diary_id: diaryId,
      user_id: user!.id,
      content,
    })
    .select()
    .single();

  if (insertError) {
    return apiError(insertError.message, 500);
  }

  return apiResponse(data, 201);
}
