import { z } from "zod/v4";

const PUBLIC_ID_REGEX = /^[0-9a-f]{8}$/;

const publicId = z.string().regex(PUBLIC_ID_REGEX, "유효하지 않은 ID 형식입니다");
const uuid = z.string().uuid("유효하지 않은 ID 형식입니다");

export const getCommentsSchema = z.object({
  diaryId: uuid,
  groupId: uuid,
});

export const createCommentSchema = z.object({
  diaryId: uuid,
  content: z.string().min(1, "댓글 내용은 필수입니다").max(1000, "댓글은 1000자 이내여야 합니다"),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "댓글 내용은 필수입니다").max(1000, "댓글은 1000자 이내여야 합니다"),
});

export const commentParamsSchema = z.object({
  id: z.string().uuid("유효하지 않은 ID 형식입니다"),
});

export const commentCountSchema = z.object({
  diaryId: uuid,
});

export type GetCommentsInput = z.infer<typeof getCommentsSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
