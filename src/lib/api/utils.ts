import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 인증된 사용자 정보 반환
 */
export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * 성공 응답
 */
export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * 에러 응답
 */
export function apiError(error: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status }
  );
}

/**
 * 인증 필수 체크
 */
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return { user: null, error: apiError("인증이 필요합니다", 401, "UNAUTHORIZED") };
  }
  return { user, error: null };
}
