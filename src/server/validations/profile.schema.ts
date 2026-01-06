import { z } from "zod/v4";

export const updateProfileSchema = z.object({
  nickname: z.string().min(1, "닉네임은 필수입니다").max(20, "닉네임은 20자 이내여야 합니다").optional(),
  avatarUrl: z.string().url("유효하지 않은 이미지 URL입니다").nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
