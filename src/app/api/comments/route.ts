import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/comments?diaryId=&groupId= - 댓글 목록 조회
 */
export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const diaryId = request.nextUrl.searchParams.get("diaryId");
  const groupId = request.nextUrl.searchParams.get("groupId");

  if (!diaryId || !groupId) {
    return apiError("diaryId와 groupId는 필수입니다");
  }

  const supabase = await createClient();

  // 댓글 조회
  const { data: comments, error: queryError } = await supabase
    .from("comments")
    .select("*")
    .eq("diary_id", diaryId)
    .order("created_at", { ascending: true });

  if (queryError) {
    console.error("Comment query error:", queryError);
    return apiError(`댓글 조회 실패: ${queryError.message}`, 500);
  }

  // 작성자 정보 별도 조회
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

/**
 * POST /api/comments - 댓글 작성
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { diaryId, content } = body;

  if (!diaryId || !content) {
    return apiError("diaryId와 content는 필수입니다");
  }

  const supabase = await createClient();

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
