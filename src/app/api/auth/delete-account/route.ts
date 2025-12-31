import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * DELETE /api/auth/delete-account - 회원 탈퇴
 * 주의: 이 API는 사용자의 모든 데이터를 삭제합니다
 */
export async function DELETE() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "인증이 필요합니다" },
      { status: 401 }
    );
  }

  // 1. 사용자가 방장인 그룹들 삭제 (CASCADE로 관련 데이터 삭제됨)
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

  // 2. 그룹 멤버십 삭제 (본인이 멤버인 다른 그룹에서 탈퇴)
  const { error: memberError } = await supabase
    .from("group_members")
    .delete()
    .eq("user_id", user.id);

  if (memberError) {
    console.error("멤버십 삭제 실패:", memberError);
  }

  // 3. 프로필 삭제 (CASCADE로 다이어리, 코멘트 등 삭제됨)
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

  // 4. 로그아웃
  await supabase.auth.signOut();

  return NextResponse.json({ success: true });
}
