import { apiResponse, apiError, requireAuth, parseBody } from "@/lib/api/utils";
import { groupService } from "@/server/services";
import { memberParamsSchema, updateMemberSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ publicId: string; userId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { publicId, userId } = memberParamsSchema.parse(await params);
    const input = await parseBody(request, updateMemberSchema);
    const result = await groupService.updateMember(supabase, user!.id, publicId, userId, input);
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
    const { publicId, userId } = memberParamsSchema.parse(await params);
    const result = await groupService.removeMember(supabase, user!.id, publicId, userId);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 ID 형식입니다", 400);
    }
    throw err;
  }
}
