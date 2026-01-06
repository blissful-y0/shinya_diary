import { apiResponse, apiError, requireAuth, parseSearchParams, parseBody } from "@/lib/api/utils";
import { commentService } from "@/server/services";
import { getCommentsSchema, createCommentSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { diaryId, groupId } = parseSearchParams(request, getCommentsSchema);
    const comments = await commentService.getComments(supabase, user!.id, diaryId, groupId);
    return apiResponse(comments);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("diaryId와 groupId는 필수입니다", 400);
    }
    throw err;
  }
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const input = await parseBody(request, createCommentSchema);
    const comment = await commentService.createComment(supabase, user!.id, input);
    return apiResponse(comment, 201);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("diaryId와 content는 필수입니다", 400);
    }
    throw err;
  }
}
