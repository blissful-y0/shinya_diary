import { apiResponse, apiError, requireAuth, parseSearchParams } from "@/lib/api/utils";
import { diaryService } from "@/server/services";
import { getDiariesSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { groupId, date } = parseSearchParams(request, getDiariesSchema);
    const diary = await diaryService.getMyDiary(supabase, user!.id, groupId, date);
    return apiResponse(diary);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("groupId와 date는 필수입니다", 400);
    }
    throw err;
  }
}
