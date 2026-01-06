import { SupabaseClient } from "@supabase/supabase-js";
import { profileRepo, groupRepo } from "../repositories";
import { ApiException } from "@/lib/api/utils";
import type { UpdateProfileInput } from "../validations";

export const profileService = {
  async getMyProfile(db: SupabaseClient, userId: string) {
    const { data: profile, error } = await profileRepo.findById(db, userId);
    if (error || !profile) {
      throw new ApiException("프로필을 찾을 수 없습니다", 404);
    }

    const { data: memberships } = await groupRepo.findByMembership(db, userId);
    const groupCount = memberships?.length ?? 0;

    return {
      profile,
      stats: { groupCount },
    };
  },

  async updateProfile(db: SupabaseClient, userId: string, input: UpdateProfileInput) {
    const { data, error } = await profileRepo.update(db, userId, {
      nickname: input.nickname,
      avatarUrl: input.avatarUrl,
    });

    if (error) {
      throw new ApiException(error.message, 500);
    }

    return { success: true, profile: data };
  },
};
