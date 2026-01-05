import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

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

  const [groupsResult, memberCountsResult] = await Promise.all([
    supabase
      .from("groups")
      .select("id, name, owner_id, icon_url, cover_image_url, invite_code, created_at")
      .in("id", groupIds),
    supabase
      .from("group_members")
      .select("group_id")
      .in("group_id", groupIds),
  ]);

  if (groupsResult.error) {
    return apiError("그룹 조회 실패", 500);
  }

  const countMap = new Map<string, number>();
  memberCountsResult.data?.forEach((m) => {
    countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1);
  });

  const result = groupsResult.data?.map((g) => ({
    ...g,
    memberCount: countMap.get(g.id) || 0,
  }));

  return apiResponse(result);
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const body = await request.json();
  const { name, nickname } = body;

  if (!name || !nickname) {
    return apiError("그룹 이름과 닉네임은 필수입니다");
  }

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name,
      owner_id: user!.id,
      invite_code: "",
    })
    .select()
    .single();

  if (groupError || !group) {
    return apiError(groupError?.message || "그룹 생성 실패", 500);
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user!.id,
    nickname,
  });

  if (memberError) {
    await supabase.from("groups").delete().eq("id", group.id);
    return apiError(memberError.message, 500);
  }

  return apiResponse({ groupId: group.id }, 201);
}
