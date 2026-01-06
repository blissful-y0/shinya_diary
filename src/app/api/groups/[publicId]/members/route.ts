import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { groupService } from "@/server/services";
import { groupParamsSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { publicId } = groupParamsSchema.parse(await params);
    const members = await groupService.getMembers(supabase, user!.id, publicId);
    return apiResponse(members);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 ID 형식입니다", 400);
    }
    throw err;
  }
}
