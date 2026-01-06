import { requireAuth, apiResponse } from "@/lib/api/utils";
import { statsService } from "@/server/services";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const status = await statsService.getAllGroupsStatus(supabase, user!.id);
  return apiResponse(status);
}
