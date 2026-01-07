import { apiResponse, apiError, requireAuth, parseBody } from "@/lib/api/utils";
import { commentService } from "@/server/services";
import { updateCommentSchema, commentParamsSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = commentParamsSchema.parse(await params);
    const input = await parseBody(request, updateCommentSchema);
    const result = await commentService.updateComment(supabase, user!.id, id, input);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("입력값이 올바르지 않습니다", 400);
    }
    throw err;
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = commentParamsSchema.parse(await params);
    const result = await commentService.deleteComment(supabase, user!.id, id);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 ID 형식입니다", 400);
    }
    throw err;
  }
}
