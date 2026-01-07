import { apiResponse, apiError, requireAuth, parseBody } from "@/lib/api/utils";
import { diaryService } from "@/server/services";
import { updateDiarySchema, diaryParamsSchema } from "@/server/validations";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = diaryParamsSchema.parse(await params);
    const diary = await diaryService.getDiaryById(supabase, id);
    return apiResponse(diary);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 ID 형식입니다", 400);
    }
    throw err;
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { id } = diaryParamsSchema.parse(await params);
    const input = await parseBody(request, updateDiarySchema);
    const result = await diaryService.updateDiary(supabase, user!.id, id, input);
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
    const { id } = diaryParamsSchema.parse(await params);
    const result = await diaryService.deleteDiary(supabase, user!.id, id);
    return apiResponse(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return apiError("유효하지 않은 ID 형식입니다", 400);
    }
    throw err;
  }
}
