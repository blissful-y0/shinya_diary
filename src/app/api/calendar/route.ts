import { requireAuth, apiResponse, apiError, parseSearchParams } from "@/lib/api/utils";
import { statsService } from "@/server/services";
import { calendarQuerySchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { year, month } = parseSearchParams(request, calendarQuerySchema);
    const calendar = await statsService.getAggregatedCalendar(supabase, user!.id, year, month);
    return apiResponse(calendar);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 요청입니다", 400);
    }
    throw err;
  }
}
