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

  // 프로필과 그룹 수를 병렬로 조회
  const [profileResult, groupCountResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, nickname, avatar_url, provider, created_at, updated_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileResult.error) {
    return NextResponse.json(
      { success: false, error: profileResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      profile: profileResult.data,
      stats: {
        groupCount: groupCountResult.count || 0,
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
