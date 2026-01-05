import { withAuth, apiResponse, ApiErrors } from "@/lib/api/utils";

export const runtime = "edge";

export const DELETE = withAuth(async ({ user, supabase }) => {
  const { error: groupError } = await supabase
    .from("groups")
    .delete()
    .eq("owner_id", user.id);

  if (groupError) {
    console.error("그룹 삭제 실패:", groupError);
    throw ApiErrors.internal("그룹 삭제 중 오류가 발생했습니다");
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
    throw ApiErrors.internal("프로필 삭제 중 오류가 발생했습니다");
  }

  await supabase.auth.signOut();

  return apiResponse({ deleted: true });
});
