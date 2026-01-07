import { SupabaseClient } from "@supabase/supabase-js";
import { groupRepo, memberRepo, joinRequestRepo } from "../repositories";
import { ApiException } from "@/lib/api/utils";
import type { CreateGroupInput, UpdateGroupInput, UpdateMemberInput, HandleJoinRequestInput } from "../validations";

export const groupService = {
  async getMyGroups(db: SupabaseClient, userId: string) {
    const { data: memberships, error: memberError } = await groupRepo.findByMembership(db, userId);
    if (memberError) {
      throw new ApiException("그룹 멤버십 조회 실패", 500);
    }

    if (!memberships || memberships.length === 0) {
      return [];
    }

    const groupIds = memberships.map((m) => m.group_id);

    const [groupsResult, memberCountsResult] = await Promise.all([
      groupRepo.findByIds(db, groupIds),
      groupRepo.getMemberCount(db, groupIds),
    ]);

    if (groupsResult.error) {
      throw new ApiException("그룹 조회 실패", 500);
    }

    const countMap = new Map<string, number>();
    memberCountsResult.data?.forEach((m) => {
      countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1);
    });

    return groupsResult.data?.map((g) => ({
      ...g,
      memberCount: countMap.get(g.id) || 0,
    }));
  },

  async getGroupByPublicId(db: SupabaseClient, userId: string, publicId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    const isMember = await memberRepo.isMember(db, group.id, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    return group;
  },

  async getGroupByInviteCode(db: SupabaseClient, code: string) {
    const { data: group, error } = await groupRepo.findByInviteCode(db, code);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    return group;
  },

  async createGroup(db: SupabaseClient, userId: string, input: CreateGroupInput) {
    const { data: group, error: groupError } = await groupRepo.create(db, {
      name: input.name,
      ownerId: userId,
    });

    if (groupError || !group) {
      throw new ApiException(groupError?.message || "그룹 생성 실패", 500);
    }

    const { error: memberError } = await memberRepo.create(db, {
      groupId: group.id,
      userId,
      nickname: input.nickname,
    });

    if (memberError) {
      await groupRepo.delete(db, group.id);
      throw new ApiException(memberError.message, 500);
    }

    return { groupId: group.id, publicId: group.public_id };
  },

  async updateGroup(db: SupabaseClient, userId: string, publicId: string, input: UpdateGroupInput) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    if (group.owner_id !== userId) {
      throw new ApiException("권한이 없습니다", 403);
    }

    const { error: updateError } = await groupRepo.update(db, group.id, {
      name: input.name,
      iconUrl: input.iconUrl,
      coverImageUrl: input.coverImageUrl,
    });

    if (updateError) {
      throw new ApiException(updateError.message, 500);
    }

    return { success: true };
  },

  async deleteGroup(db: SupabaseClient, userId: string, publicId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    if (group.owner_id !== userId) {
      throw new ApiException("권한이 없습니다", 403);
    }

    const { error: deleteError } = await groupRepo.delete(db, group.id);
    if (deleteError) {
      throw new ApiException(deleteError.message, 500);
    }

    return { success: true };
  },

  async getMembers(db: SupabaseClient, userId: string, publicId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    const isMember = await memberRepo.isMember(db, group.id, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const { data: members, error: memberError } = await memberRepo.findByGroupId(db, group.id);
    if (memberError) {
      throw new ApiException("멤버 조회 실패", 500);
    }

    return members?.map((m) => ({
      ...m,
      isOwner: m.user_id === group.owner_id,
    }));
  },

  async updateMember(
    db: SupabaseClient,
    currentUserId: string,
    groupPublicId: string,
    targetUserId: string,
    input: UpdateMemberInput
  ) {
    const { data: group, error } = await groupRepo.findByPublicId(db, groupPublicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    if (targetUserId !== currentUserId && group.owner_id !== currentUserId) {
      throw new ApiException("권한이 없습니다", 403);
    }

    const { error: updateError } = await memberRepo.update(db, group.id, targetUserId, {
      nickname: input.nickname,
      avatarUrl: input.avatarUrl,
    });

    if (updateError) {
      throw new ApiException(updateError.message, 500);
    }

    return { success: true };
  },

  async removeMember(db: SupabaseClient, currentUserId: string, groupPublicId: string, targetUserId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, groupPublicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    const isSelf = targetUserId === currentUserId;
    const isOwner = group.owner_id === currentUserId;

    if (!isSelf && !isOwner) {
      throw new ApiException("권한이 없습니다", 403);
    }

    if (targetUserId === group.owner_id) {
      throw new ApiException("방장은 탈퇴할 수 없습니다", 400);
    }

    const { error: deleteError } = await memberRepo.delete(db, group.id, targetUserId);
    if (deleteError) {
      throw new ApiException(deleteError.message, 500);
    }

    return { success: true };
  },

  async getJoinRequests(db: SupabaseClient, userId: string, publicId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    if (group.owner_id !== userId) {
      throw new ApiException("권한이 없습니다", 403);
    }

    const { data, error: requestError } = await joinRequestRepo.findPendingByGroupId(db, group.id);
    if (requestError) {
      throw new ApiException("가입 요청 조회 실패", 500);
    }

    return data?.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      group_id: r.group_id,
      status: r.status,
      created_at: r.created_at,
      user: r.profiles,
    }));
  },

  async createJoinRequest(db: SupabaseClient, userId: string, publicId: string) {
    const { data: group, error } = await groupRepo.findByPublicId(db, publicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    const isMember = await memberRepo.isMember(db, group.id, userId);
    if (isMember) {
      throw new ApiException("이미 그룹 멤버입니다", 400);
    }

    const { data: existing } = await joinRequestRepo.findByGroupAndUser(db, group.id, userId);
    if (existing) {
      throw new ApiException("이미 가입 요청을 보냈습니다", 400);
    }

    const { error: createError } = await joinRequestRepo.create(db, {
      groupId: group.id,
      userId,
    });

    if (createError) {
      throw new ApiException(createError.message, 500);
    }

    return { success: true };
  },

  async handleJoinRequest(
    db: SupabaseClient,
    userId: string,
    groupPublicId: string,
    requestId: string,
    input: HandleJoinRequestInput
  ) {
    const { data: group, error } = await groupRepo.findByPublicId(db, groupPublicId);
    if (error || !group) {
      throw new ApiException("그룹을 찾을 수 없습니다", 404);
    }

    if (group.owner_id !== userId) {
      throw new ApiException("권한이 없습니다", 403);
    }

    const { data: request, error: requestError } = await joinRequestRepo.findById(db, requestId);
    if (requestError || !request) {
      throw new ApiException("가입 요청을 찾을 수 없습니다", 404);
    }

    if (request.group_id !== group.id) {
      throw new ApiException("잘못된 요청입니다", 400);
    }

    if (input.action === "approve") {
      const { error: memberError } = await memberRepo.create(db, {
        groupId: group.id,
        userId: request.user_id,
        nickname: input.nickname || "새 멤버",
      });

      if (memberError) {
        throw new ApiException(memberError.message, 500);
      }
    }

    await joinRequestRepo.updateStatus(db, request.id, input.action === "approve" ? "approved" : "rejected");

    return { success: true };
  },
};
