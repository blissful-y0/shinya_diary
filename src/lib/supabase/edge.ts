import { createServerClient } from "@supabase/ssr";
import { type NextRequest } from "next/server";

/**
 * Edge Runtime API Route용 Supabase 클라이언트 생성
 * Request 객체에서 직접 쿠키를 읽어옴
 */
export function createEdgeClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Edge runtime에서는 response에서 쿠키를 설정해야 함
          // middleware에서 세션 refresh를 처리하므로 여기서는 생략
        },
      },
    }
  );
}
