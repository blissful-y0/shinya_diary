import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/auth/me - 현재 로그인한 사용자 정보 조회
 */
export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
    },
  });
}
