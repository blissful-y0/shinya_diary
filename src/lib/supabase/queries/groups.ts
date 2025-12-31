import { createClient } from "@/lib/supabase/client";
import type { Group, GroupMember, Profile } from "@/types/database";

/* =============================================
   그룹 관련 Supabase 쿼리
   ============================================= */

export interface GroupWithMemberCount extends Group {
  memberCount: number;
}

export interface GroupMemberWithDetails extends GroupMember {
  isOwner: boolean;
}

export interface JoinRequestWithUser {
  id: string;
  group_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user: {
    nickname: string | null;
    avatar_url: string | null;
  };
}

/**
 * 내가 속한 그룹 목록 조회
 */
export async function getMyGroups(userId: string): Promise<GroupWithMemberCount[]> {
  const supabase = createClient();

  const { data: memberships, error: memberError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId);

  if (memberError || !memberships) {
    console.error("그룹 멤버십 조회 실패:", memberError);
    return [];
  }

  const groupIds = memberships.map((m) => m.group_id);
  if (groupIds.length === 0) return [];

  const { data: groups, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds);

  if (groupError || !groups) {
    console.error("그룹 조회 실패:", groupError);
    return [];
  }

  // 각 그룹의 멤버 수 조회
  const { data: memberCounts, error: countError } = await supabase
    .from("group_members")
    .select("group_id")
    .in("group_id", groupIds);

  if (countError) {
    console.error("멤버 수 조회 실패:", countError);
  }

  const countMap = new Map<string, number>();
  memberCounts?.forEach((m) => {
    countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1);
  });

  return groups.map((g) => ({
    ...g,
    memberCount: countMap.get(g.id) || 0,
  }));
}

/**
 * 그룹 상세 조회
 */
export async function getGroup(groupId: string): Promise<Group | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("그룹 조회 실패:", error);
    return null;
  }

  return data;
}

/**
 * 초대 코드로 그룹 찾기
 */
export async function findGroupByInviteCode(code: string): Promise<Group | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("invite_code", code.toUpperCase())
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("그룹 조회 실패:", error);
  }

  return data;
}

/**
 * 그룹 생성
 */
export async function createGroup(
  name: string,
  ownerId: string,
  ownerNickname: string
): Promise<{ success: boolean; groupId?: string; error?: string }> {
  const supabase = createClient();

  // 그룹 생성
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name,
      owner_id: ownerId,
      invite_code: "", // 트리거가 자동 생성
    })
    .select()
    .single();

  if (groupError || !group) {
    console.error("그룹 생성 실패:", groupError);
    return { success: false, error: groupError?.message };
  }

  // 방장을 멤버로 추가
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: ownerId,
    nickname: ownerNickname,
  });

  if (memberError) {
    console.error("멤버 추가 실패:", memberError);
    // 그룹 롤백
    await supabase.from("groups").delete().eq("id", group.id);
    return { success: false, error: memberError.message };
  }

  return { success: true, groupId: group.id };
}

/**
 * 그룹 정보 수정
 */
export async function updateGroup(
  groupId: string,
  params: {
    name?: string;
    iconUrl?: string | null;
    coverImageUrl?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {};
  if (params.name !== undefined) updateData.name = params.name;
  if (params.iconUrl !== undefined) updateData.icon_url = params.iconUrl;
  if (params.coverImageUrl !== undefined) updateData.cover_image_url = params.coverImageUrl;

  const { error } = await supabase
    .from("groups")
    .update(updateData)
    .eq("id", groupId);

  if (error) {
    console.error("그룹 수정 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 그룹 삭제
 */
export async function deleteGroup(groupId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("groups").delete().eq("id", groupId);

  if (error) {
    console.error("그룹 삭제 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 그룹 멤버인지 확인
 */
export async function isGroupMember(groupId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("멤버 확인 실패:", error);
  }

  return !!data;
}

/**
 * 그룹 방장인지 확인
 */
export async function isGroupOwner(groupId: string, userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("방장 확인 실패:", error);
    return false;
  }

  return data?.owner_id === userId;
}

/**
 * 그룹 멤버 목록 조회
 */
export async function getGroupMembers(groupId: string): Promise<GroupMemberWithDetails[]> {
  const supabase = createClient();

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("owner_id")
    .eq("id", groupId)
    .single();

  if (groupError) {
    console.error("그룹 조회 실패:", groupError);
    return [];
  }

  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select("*")
    .eq("group_id", groupId)
    .order("joined_at", { ascending: true });

  if (memberError || !members) {
    console.error("멤버 조회 실패:", memberError);
    return [];
  }

  return members.map((m) => ({
    ...m,
    isOwner: m.user_id === group?.owner_id,
  }));
}

/**
 * 그룹 프로필 수정
 */
export async function updateGroupProfile(
  groupId: string,
  userId: string,
  params: { nickname?: string; avatarUrl?: string | null }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updateData: Record<string, unknown> = {};
  if (params.nickname !== undefined) updateData.nickname = params.nickname;
  if (params.avatarUrl !== undefined) updateData.avatar_url = params.avatarUrl;

  const { error } = await supabase
    .from("group_members")
    .update(updateData)
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) {
    console.error("프로필 수정 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 멤버 강퇴
 */
export async function removeMember(
  groupId: string,
  memberId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", memberId);

  if (error) {
    console.error("멤버 강퇴 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 가입 요청 목록 조회
 */
export async function getJoinRequests(groupId: string): Promise<JoinRequestWithUser[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("join_requests")
    .select(`
      *,
      user:profiles(nickname, avatar_url)
    `)
    .eq("group_id", groupId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("가입 요청 조회 실패:", error);
    return [];
  }

  return data as JoinRequestWithUser[];
}

/**
 * 가입 요청 생성
 */
export async function createJoinRequest(
  groupId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from("join_requests").insert({
    group_id: groupId,
    user_id: userId,
    status: "pending",
  });

  if (error) {
    console.error("가입 요청 생성 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * 가입 요청 승인
 */
export async function approveJoinRequest(
  requestId: string,
  groupId: string,
  userId: string,
  nickname: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // 요청 상태 변경
  const { error: updateError } = await supabase
    .from("join_requests")
    .update({ status: "approved" })
    .eq("id", requestId);

  if (updateError) {
    console.error("요청 승인 실패:", updateError);
    return { success: false, error: updateError.message };
  }

  // 멤버로 추가
  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: userId,
    nickname: nickname,
  });

  if (memberError) {
    console.error("멤버 추가 실패:", memberError);
    return { success: false, error: memberError.message };
  }

  return { success: true };
}

/**
 * 가입 요청 거절
 */
export async function rejectJoinRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("join_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  if (error) {
    console.error("요청 거절 실패:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
