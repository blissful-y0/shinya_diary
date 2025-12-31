import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

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

  const { data, error: queryError } = await supabase
    .from("comments")
    .select(`
      *,
      author:group_members!inner(
        nickname,
        avatar_url,
        user_id
      )
    `)
    .eq("diary_id", diaryId)
    .eq("group_members.group_id", groupId)
    .order("created_at", { ascending: true });

  if (queryError) {
    return apiError("댓글 조회 실패", 500);
  }

  const result = (data || []).map((c) => ({
    ...c,
    author: {
      nickname: c.author.nickname || "익명",
      avatar_url: c.author.avatar_url,
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
