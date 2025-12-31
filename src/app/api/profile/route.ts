import { createEdgeClient } from "@/lib/supabase/edge";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/profile - 현재 사용자 프로필 조회
 */
export async function GET(request: NextRequest) {
  const supabase = createEdgeClient(request);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // 통계 조회
  const [diaryResult, groupResult] = await Promise.all([
    supabase
      .from("diaries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  // 연속 작성일 계산
  const { data: diaries } = await supabase
    .from("diaries")
    .select("date")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(100);

  let streakDays = 0;
  if (diaries && diaries.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [...new Set(diaries.map((d) => d.date))].sort().reverse();

    for (let i = 0; i < dates.length; i++) {
      const diaryDate = new Date(dates[i]);
      diaryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (diaryDate.getTime() === expectedDate.getTime()) {
        streakDays++;
      } else if (i === 0) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (diaryDate.getTime() === yesterday.getTime()) {
          streakDays++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      profile,
      stats: {
        diaryCount: diaryResult.count || 0,
        groupCount: groupResult.count || 0,
        streakDays,
      },
    },
  });
}

/**
 * PATCH /api/profile - 프로필 업데이트
 */
export async function PATCH(request: NextRequest) {
  const supabase = createEdgeClient(request);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { nickname, avatarUrl } = body;

  const updateData: Record<string, unknown> = {};
  if (nickname !== undefined) updateData.nickname = nickname;
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
