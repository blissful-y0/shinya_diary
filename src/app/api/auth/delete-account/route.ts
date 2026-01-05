import { createEdgeClient } from "@/lib/supabase/edge";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(request: NextRequest) {
  const supabase = createEdgeClient(request);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  const { error: groupError } = await supabase
    .from("groups")
    .delete()
    .eq("owner_id", user.id);

  if (groupError) {
    console.error("그룹 삭제 실패:", groupError);
    return NextResponse.json(
      { success: false, error: "그룹 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }

  const { error: memberError } = await supabase
    .from("group_members")
    .delete()
    .eq("user_id", user.id);

  if (memberError) {
    console.error("멤버십 삭제 실패:", memberError);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    console.error("프로필 삭제 실패:", profileError);
    return NextResponse.json(
      { success: false, error: "프로필 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }

  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
