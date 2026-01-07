import { SupabaseClient } from "@supabase/supabase-js";
import { diaryRepo, memberRepo, commentRepo, groupRepo } from "../repositories";
import { ApiException } from "@/lib/api/utils";
import type { CreateDiaryInput, UpdateDiaryInput } from "../validations";

interface AuthorInfo {
  user_id: string | null;
  nickname: string;
  avatar_url: string | null;
}

interface MemberWithProfile {
  user_id: string;
  nickname: string | null;
  avatar_url: string | null;
  profiles: { public_id: string } | { public_id: string }[];
}

function formatAuthor(member: MemberWithProfile | null | undefined): AuthorInfo {
  if (!member) {
    return { user_id: null, nickname: "탈퇴한 사용자", avatar_url: null };
  }
  const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
  return {
    user_id: profile?.public_id ?? null,
    nickname: member.nickname || "익명",
    avatar_url: member.avatar_url,
  };
}

async function resolveGroupId(db: SupabaseClient, groupPublicId: string): Promise<string> {
  const { data: group, error } = await groupRepo.findByPublicId(db, groupPublicId);
  if (error || !group) {
    throw new ApiException("그룹을 찾을 수 없습니다", 404);
  }
  return group.id;
}

export const diaryService = {
  async getDiariesForDate(db: SupabaseClient, userId: string, groupPublicId: string, date: string) {
    const groupId = await resolveGroupId(db, groupPublicId);
    const today = new Date().toISOString().split("T")[0];
    const isToday = date === today;

    const { data: allDiaries, error: queryError } = await diaryRepo.findByGroupAndDate(db, groupId, date);
    if (queryError) {
      throw new ApiException(`다이어리 조회 실패: ${queryError.message}`, 500);
    }

    const hasWrittenToday = allDiaries?.some((d) => d.user_id === userId) || false;

    if (isToday && !hasWrittenToday) {
      return { diaries: [], hasWrittenToday: false };
    }

    if (!allDiaries || allDiaries.length === 0) {
      return { diaries: [], hasWrittenToday };
    }

    const diaryUserIds = [...new Set(allDiaries.map((d) => d.user_id).filter(Boolean))] as string[];
    const diaryIds = allDiaries.map((d) => d.id);

    const [commentsResult, membersResult] = await Promise.all([
      commentRepo.findByDiaryIds(db, diaryIds),
      memberRepo.getMembersWithProfiles(db, groupId, diaryUserIds),
    ]);

    const comments = commentsResult.data ?? [];
    const members = membersResult.data ?? [];

    const commentUserIds = [...new Set(comments.map((c) => c.user_id).filter(Boolean))] as string[];
    const allUserIds = [...new Set([...diaryUserIds, ...commentUserIds])];

    let allMembers = members;
    if (commentUserIds.some((id) => !diaryUserIds.includes(id))) {
      const additionalMembersResult = await memberRepo.getMembersWithProfiles(db, groupId, allUserIds);
      allMembers = additionalMembersResult.data ?? [];
    }

    const memberMap = new Map(allMembers.map((m) => [m.user_id, m]));

    const commentsByDiary = new Map<string, unknown[]>();
    comments.forEach((comment) => {
      if (!commentsByDiary.has(comment.diary_id)) {
        commentsByDiary.set(comment.diary_id, []);
      }
      const member = memberMap.get(comment.user_id) as MemberWithProfile | undefined;
      commentsByDiary.get(comment.diary_id)!.push({
        ...comment,
        author: formatAuthor(member),
        isOwn: comment.user_id === userId,
      });
    });

    const diaries = allDiaries.map((diary) => {
      const member = memberMap.get(diary.user_id) as MemberWithProfile | undefined;
      return {
        ...diary,
        author: formatAuthor(member),
        comments: commentsByDiary.get(diary.id) ?? [],
        comment_count: commentsByDiary.get(diary.id)?.length ?? 0,
      };
    });

    return { diaries, hasWrittenToday };
  },

  async getDiaryByPublicId(db: SupabaseClient, publicId: string) {
    const { data: diary, error } = await diaryRepo.findByPublicId(db, publicId);
    if (error || !diary) {
      throw new ApiException("다이어리를 찾을 수 없습니다", 404);
    }

    const { data: member } = await memberRepo.findByGroupAndUser(db, diary.group_id, diary.user_id);

    return {
      ...diary,
      author: member ? { nickname: member.nickname, avatar_url: member.avatar_url } : null,
    };
  },

  async getMyDiary(db: SupabaseClient, userId: string, groupPublicId: string, date: string) {
    const groupId = await resolveGroupId(db, groupPublicId);
    const { data } = await diaryRepo.findUserDiaryForDate(db, groupId, userId, date);
    return data;
  },

  async checkHasWritten(db: SupabaseClient, userId: string, groupPublicId: string, date: string) {
    const groupId = await resolveGroupId(db, groupPublicId);
    const { data } = await diaryRepo.findUserDiaryForDate(db, groupId, userId, date);
    return { hasWritten: !!data };
  },

  async createDiary(db: SupabaseClient, userId: string, input: CreateDiaryInput) {
    const groupId = await resolveGroupId(db, input.groupId);
    
    const isMember = await memberRepo.isMember(db, groupId, userId);
    if (!isMember) {
      throw new ApiException("그룹 멤버가 아닙니다", 403);
    }

    const { data: existing } = await diaryRepo.findUserDiaryForDate(db, groupId, userId, input.date);
    if (existing) {
      throw new ApiException("이미 오늘의 다이어리를 작성했습니다", 400);
    }

    const { data, error } = await diaryRepo.create(db, {
      groupId,
      userId,
      content: input.content,
      imageUrl: input.imageUrl,
      date: input.date,
    });

    if (error) {
      throw new ApiException(error.message, 500);
    }

    return data;
  },

  async updateDiary(db: SupabaseClient, userId: string, publicId: string, input: UpdateDiaryInput) {
    const { data, error } = await diaryRepo.update(db, publicId, userId, {
      content: input.content,
      imageUrl: input.imageUrl,
    });

    if (error) {
      throw new ApiException(error.message, 500);
    }

    if (!data || data.length === 0) {
      throw new ApiException("권한이 없습니다", 403);
    }

    return { success: true };
  },

  async deleteDiary(db: SupabaseClient, userId: string, publicId: string) {
    const { data, error } = await diaryRepo.softDelete(db, publicId, userId);

    if (error) {
      throw new ApiException(error.message, 500);
    }

    if (!data || data.length === 0) {
      throw new ApiException("권한이 없습니다", 403);
    }

    return { success: true };
  },
};
