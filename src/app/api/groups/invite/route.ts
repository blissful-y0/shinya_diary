import { apiResponse, apiError, requireAuth, parseSearchParams } from "@/lib/api/utils";
import { groupService } from "@/server/services";
import { inviteCodeSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { code } = parseSearchParams(request, inviteCodeSchema);
    const group = await groupService.getGroupByInviteCode(supabase, code.toUpperCase());
    return apiResponse(group);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("초대 코드가 필요합니다", 400);
    }
    throw err;
  }
}
