import { z } from "zod/v4";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PUBLIC_ID_REGEX = /^[0-9a-f]{8}$/;

const dateString = z.string().regex(DATE_REGEX, "날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)");
const publicId = z.string().regex(PUBLIC_ID_REGEX, "유효하지 않은 ID 형식입니다");

export const getDiariesSchema = z.object({
  groupId: publicId,
  date: dateString,
});

export const createDiarySchema = z.object({
  groupId: publicId,
  content: z.string().max(5000, "내용은 5000자 이내여야 합니다").optional(),
  imageUrl: z.string().url("유효하지 않은 이미지 URL입니다").optional(),
  date: dateString,
});

export const updateDiarySchema = z.object({
  content: z.string().max(5000, "내용은 5000자 이내여야 합니다").optional(),
  imageUrl: z.string().url("유효하지 않은 이미지 URL입니다").nullable().optional(),
});

export const diaryParamsSchema = z.object({
  id: z.string().uuid("유효하지 않은 ID 형식입니다"),
});

export type GetDiariesInput = z.infer<typeof getDiariesSchema>;
export type CreateDiaryInput = z.infer<typeof createDiarySchema>;
export type UpdateDiaryInput = z.infer<typeof updateDiarySchema>;
