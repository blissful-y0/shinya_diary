import { SupabaseClient } from "@supabase/supabase-js";
import { commentRepo, memberRepo, diaryRepo } from "../repositories";
import { ApiException } from "@/lib/api/utils";
import type { CreateCommentInput, UpdateCommentInput } from "../validations";

interface AuthorInfo {
  user_id: string | null;
  nickname: string;
  avatar_url: string | null;
}

interface MemberWithProfile {
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  profiles: { id: string } | { id: string }[];
}

function formatAuthor(member: MemberWithProfile | null | undefined): AuthorInfo {
  if (!member) {
    return { user_id: null, nickname: "탈퇴한 사용자", avatar_url: null };
  }
  const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
  return {
    user_id: profile?.id ?? null,
    nickname: member.nickname || "익명",
    avatar_url: member.avatar_url,
  };
}

export const commentService = {
  async getComments(db: SupabaseClient, userId: string, diaryId: string, groupId: string) {
    const isMember = await memberRepo.isMember(db, groupId, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const { data: comments, error } = await commentRepo.findByDiaryId(db, diaryId);
    if (error) {
      throw new ApiException(`댓글 조회 실패: ${error.message}`, 500);
    }

    const userIds = [...new Set(comments?.map((c) => c.user_id) || [])];
    const { data: members } = await memberRepo.getMembersWithProfiles(db, groupId, userIds);

    const memberMap = new Map(members?.map((m) => [m.user_id, m]) || []);

    return (comments || []).map((c) => {
      const member = memberMap.get(c.user_id) as MemberWithProfile | undefined;
      return {
        ...c,
        author: formatAuthor(member),
        isOwn: c.user_id === userId,
      };
    });
  },

  async getCommentCount(db: SupabaseClient, diaryId: string) {
    const { count, error } = await commentRepo.countByDiaryId(db, diaryId);
    if (error) {
      throw new ApiException(`댓글 수 조회 실패: ${error.message}`, 500);
    }

    return { count: count ?? 0 };
  },

  async createComment(db: SupabaseClient, userId: string, input: CreateCommentInput) {
    const { data: diary, error: diaryError } = await db
      .from("diaries")
      .select("group_id")
      .eq("id", input.diaryId)
      .is("deleted_at", null)
      .single();

    if (diaryError || !diary) {
      throw new ApiException("다이어리를 찾을 수 없습니다", 404);
    }

    const isMember = await memberRepo.isMember(db, diary.group_id, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const { data, error } = await commentRepo.create(db, {
      diaryId: input.diaryId,
      userId,
      content: input.content,
    });

    if (error) {
      throw new ApiException(error.message, 500);
    }

    return data;
  },

  async updateComment(db: SupabaseClient, userId: string, commentId: string, input: UpdateCommentInput) {
    const { data, error } = await commentRepo.update(db, commentId, userId, input.content);

    if (error) {
      throw new ApiException(error.message, 500);
    }

    if (!data || data.length === 0) {
      throw new ApiException("권한이 없습니다", 403);
    }

    return { success: true };
  },

  async deleteComment(db: SupabaseClient, userId: string, commentId: string) {
    const { data, error } = await commentRepo.softDelete(db, commentId, userId);

    if (error) {
      throw new ApiException(error.message, 500);
    }

    if (!data || data.length === 0) {
      throw new ApiException("권한이 없습니다", 403);
    }

    return { success: true };
  },
};
