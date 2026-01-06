import { z } from "zod/v4";

const PUBLIC_ID_REGEX = /^[0-9a-f]{8}$/;
const INVITE_CODE_REGEX = /^[A-Z0-9]+$/;

const publicId = z.string().regex(PUBLIC_ID_REGEX, "유효하지 않은 ID 형식입니다");
const uuid = z.string().uuid("유효하지 않은 ID 형식입니다");

export const createGroupSchema = z.object({
  name: z.string().min(1, "그룹 이름은 필수입니다").max(50, "그룹 이름은 50자 이내여야 합니다"),
  nickname: z.string().min(1, "닉네임은 필수입니다").max(20, "닉네임은 20자 이내여야 합니다"),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  iconUrl: z.string().url().nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
});

export const groupParamsSchema = z.object({
  publicId: publicId,
});

export const inviteCodeSchema = z.object({
  code: z.string().length(8, "초대 코드는 8자리입니다").regex(INVITE_CODE_REGEX, "유효하지 않은 초대 코드입니다"),
});

export const updateMemberSchema = z.object({
  nickname: z.string().max(20, "닉네임은 20자 이내여야 합니다").optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const memberParamsSchema = z.object({
  publicId: publicId,
  userId: publicId,
});

export const handleJoinRequestSchema = z.object({
  action: z.enum(["approve", "reject"], { error: "action은 approve 또는 reject여야 합니다" }),
  nickname: z.string().max(20).optional(),
});

export const joinRequestParamsSchema = z.object({
  publicId: publicId,
  requestId: publicId,
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type HandleJoinRequestInput = z.infer<typeof handleJoinRequestSchema>;
