import { apiResponse, apiError, requireAuth, parseSearchParams } from "@/lib/api/utils";
import { statsService } from "@/server/services";
import { groupParamsSchema, calendarQuerySchema } from "@/server/validations";
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
    const { year, month } = parseSearchParams(request, calendarQuerySchema);
    const calendar = await statsService.getCalendar(supabase, user!.id, publicId, year, month);
    return apiResponse(calendar);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 요청입니다", 400);
    }
    throw err;
  }
}
