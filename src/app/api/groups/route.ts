import { createClient } from "@/lib/supabase/server";
import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/groups - 내 그룹 목록 조회
 */
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  const supabase = await createClient();

  // 내가 속한 그룹 ID 조회
  const { data: memberships, error: memberError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", user!.id);

  if (memberError) {
    return apiError("그룹 멤버십 조회 실패", 500);
  }

  if (!memberships || memberships.length === 0) {
    return apiResponse([]);
  }

  const groupIds = memberships.map((m) => m.group_id);

  // 그룹 정보 조회
  const { data: groups, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds);

  if (groupError) {
    return apiError("그룹 조회 실패", 500);
  }

  // 각 그룹의 멤버 수 조회
  const { data: memberCounts } = await supabase
    .from("group_members")
    .select("group_id")
    .in("group_id", groupIds);

  const countMap = new Map<string, number>();
  memberCounts?.forEach((m) => {
    countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1);
  });

  const result = groups?.map((g) => ({
    ...g,
    memberCount: countMap.get(g.id) || 0,
  }));

  return apiResponse(result);
}

/**
 * POST /api/groups - 그룹 생성
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { name, nickname } = body;

  if (!name || !nickname) {
    return apiError("그룹 이름과 닉네임은 필수입니다");
  }

  const supabase = await createClient();

  // 그룹 생성
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name,
      owner_id: user!.id,
      invite_code: "", // 트리거가 자동 생성
    })
    .select()
    .single();

  if (groupError || !group) {
    return apiError(groupError?.message || "그룹 생성 실패", 500);
  }

  // 방장을 멤버로 추가
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user!.id,
    nickname,
  });

  if (memberError) {
    // 롤백
    await supabase.from("groups").delete().eq("id", group.id);
    return apiError(memberError.message, 500);
  }

  return apiResponse({ groupId: group.id }, 201);
}
