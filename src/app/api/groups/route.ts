import { apiResponse, apiError, requireAuth, parseBody } from "@/lib/api/utils";
import { groupService } from "@/server/services";
import { createGroupSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const groups = await groupService.getMyGroups(supabase, user!.id);
  return apiResponse(groups);
}

export async function POST(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const input = await parseBody(request, createGroupSchema);
    const result = await groupService.createGroup(supabase, user!.id, input);
    return apiResponse(result, 201);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("그룹 이름과 닉네임은 필수입니다", 400);
    }
    throw err;
  }
}
