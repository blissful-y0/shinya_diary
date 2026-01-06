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
    .select("id, public_id, group_id, user_id, content, image_url, date, created_at, sticker_data")
    .eq("group_id", groupId)
    .eq("date", date)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (queryError) {
    console.error("Diary query error:", queryError);
    return apiError(`다이어리 조회 실패: ${queryError.message}`, 500);
  }

  const hasWrittenToday = allDiaries?.some(d => d.user_id === user!.id) || false;

  if (isToday && !hasWrittenToday) {
    return apiResponse([], 200, { hasWrittenToday: false });
  }

  if (!allDiaries || allDiaries.length === 0) {
    return apiResponse([], 200, { hasWrittenToday });
  }

  // 다이어리 작성자 user_id 수집 (null 제외)
  const diaryUserIds = [...new Set(allDiaries.map(d => d.user_id).filter(Boolean))];
  const diaryIds = allDiaries.map(d => d.id);

  // 코멘트 조회
  const { data: comments } = await supabase
    .from("comments")
    .select("id, public_id, diary_id, user_id, content, created_at, updated_at")
    .in("diary_id", diaryIds)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  // 코멘트 작성자 user_id 수집 (null 제외)
  const commentUserIds = [...new Set(comments?.map(c => c.user_id).filter(Boolean) || [])];

  // 모든 user_id 합치기
  const allUserIds = [...new Set([...diaryUserIds, ...commentUserIds])];

  // 그룹 멤버 정보 조회 (profiles의 public_id 포함)
  const { data: members } = await supabase
    .from("group_members")
    .select(`
      user_id,
      nickname,
      avatar_url,
      profiles!inner(public_id)
    `)
    .eq("group_id", groupId)
    .in("user_id", allUserIds.length > 0 ? allUserIds : ["none"]);

  const memberMap = new Map(members?.map(m => [m.user_id, m]) || []);

  // 코멘트를 다이어리별로 그룹화
  const commentsByDiary = new Map<string, any[]>();
  comments?.forEach(comment => {
    if (!commentsByDiary.has(comment.diary_id)) {
      commentsByDiary.set(comment.diary_id, []);
    }
    const member = comment.user_id ? memberMap.get(comment.user_id) : null;
    commentsByDiary.get(comment.diary_id)!.push({
      ...comment,
      author: member
        ? {
            user_id: (member as any).profiles?.public_id || null,
            nickname: member.nickname || "익명",
            avatar_url: member.avatar_url || null,
          }
        : {
            user_id: null,
            nickname: "탈퇴한 사용자",
            avatar_url: null,
          },
      isOwn: comment.user_id === user!.id,
    });
  });

  // 다이어리에 작성자와 코멘트 정보 추가
  const data = allDiaries.map(diary => {
    const member = diary.user_id ? memberMap.get(diary.user_id) : null;
    return {
      ...diary,
      author: member
        ? {
            user_id: (member as any).profiles?.public_id || null,
            nickname: member.nickname || "익명",
            avatar_url: member.avatar_url || null,
          }
        : {
            user_id: null,
            nickname: "탈퇴한 사용자",
            avatar_url: null,
          },
      comments: commentsByDiary.get(diary.id) || [],
      comment_count: commentsByDiary.get(diary.id)?.length || 0,
    };
  });

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
      .is("deleted_at", null)
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
