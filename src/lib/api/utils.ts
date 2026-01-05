import { createEdgeClient } from "@/lib/supabase/edge";
import { NextRequest, NextResponse } from "next/server";

export function apiResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
) {
  return NextResponse.json({ success: true, data, ...meta }, { status });
}

export function apiError(error: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status }
  );
}

export async function requireAuth(request: NextRequest) {
  const supabase = createEdgeClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: apiError("인증이 필요합니다", 401, "UNAUTHORIZED") };
  }
  return { user, supabase, error: null };
}
