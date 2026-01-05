import { createEdgeClient } from "@/lib/supabase/edge";
import { apiResponse, apiError } from "@/lib/api/utils";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const supabase = createEdgeClient(request);
    const { error } = await supabase.auth.signOut();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiResponse({ signedOut: true });
  } catch (err) {
    console.error("Signout error:", err);
    return apiError("로그아웃에 실패했습니다", 500);
  }
}
