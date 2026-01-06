import { apiResponse, apiError, requireAuth, parseSearchParams } from "@/lib/api/utils";
import { commentService } from "@/server/services";
import { commentCountSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { diaryId } = parseSearchParams(request, commentCountSchema);
    const result = await commentService.getCommentCount(supabase, diaryId);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("diaryId는 필수입니다", 400);
    }
    throw err;
  }
}
