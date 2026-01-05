import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * GET /api/auth/google - Google OAuth URL 생성
 */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { origin } = new URL(request.url);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    return NextResponse.json(
      { success: false, error: error?.message || "OAuth URL 생성 실패" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { url: data.url },
  });
}
