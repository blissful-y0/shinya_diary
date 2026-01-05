import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Exchange code error:", error.message, error);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    console.error("No session returned");
    return NextResponse.redirect(`${origin}/login?error=no_session`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const metadata = user.user_metadata;
    const avatarUrl = metadata?.avatar_url || metadata?.picture || null;
    const nickname = metadata?.full_name || metadata?.name || null;

    await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        nickname: nickname,
      })
      .eq("id", user.id)
      .is("avatar_url", null);
  }

  return response;
}
