import { apiResponse, apiError, requireAuth, parseBody } from "@/lib/api/utils";
import { groupService } from "@/server/services";
import { joinRequestParamsSchema, handleJoinRequestSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ publicId: string; requestId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { publicId, requestId } = joinRequestParamsSchema.parse(await params);
    const input = await parseBody(request, handleJoinRequestSchema);
    const result = await groupService.handleJoinRequest(supabase, user!.id, publicId, requestId, input);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("입력값이 올바르지 않습니다", 400);
    }
    throw err;
  }
}
