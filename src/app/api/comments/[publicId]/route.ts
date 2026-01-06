import { apiResponse, apiError, requireAuth } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface RouteParams {
  params: Promise<{ publicId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { publicId } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) {
    return apiError("content는 필수입니다");
  }

  const { data, error: updateError } = await supabase
    .from("comments")
    .update({ content })
    .eq("public_id", publicId)
    .eq("user_id", user!.id)
    .is("deleted_at", null)
    .select("id");

  if (updateError) {
    return apiError(updateError.message, 500);
  }

  if (!data || data.length === 0) {
    return apiError("권한이 없습니다", 403);
  }

  return apiResponse({ success: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, supabase, error } = await requireAuth(request);
  if (error) return error;

  const { publicId } = await params;

  const { data, error: deleteError } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("public_id", publicId)
    .eq("user_id", user!.id)
    .is("deleted_at", null)
    .select("id");

  if (deleteError) {
    return apiError(deleteError.message, 500);
  }

  if (!data || data.length === 0) {
    return apiError("권한이 없습니다", 403);
  }

  return apiResponse({ success: true });
}
