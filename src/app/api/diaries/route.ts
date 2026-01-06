import { apiResponse, apiError, requireAuth, parseSearchParams, parseBody } from "@/lib/api/utils";
import { diaryService } from "@/server/services";
import { getDiariesSchema, createDiarySchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { groupId, date } = parseSearchParams(request, getDiariesSchema);
    const result = await diaryService.getDiariesForDate(supabase, user!.id, groupId, date);
    return apiResponse(result.diaries, 200, { hasWrittenToday: result.hasWrittenToday });
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("groupId와 date는 필수입니다", 400);
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const input = await parseBody(request, createDiarySchema);
    const diary = await diaryService.createDiary(supabase, user!.id, input);
    return apiResponse(diary, 201);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("입력값이 올바르지 않습니다", 400);
    }
    throw err;
  }
}
