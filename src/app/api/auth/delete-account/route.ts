import { withAuth, apiResponse, ApiErrors } from "@/lib/api/utils";

export const runtime = "edge";

export const DELETE = withAuth(async ({ user, supabase }) => {
  // 1. 프로필 정보 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    throw ApiErrors.notFound("프로필을 찾을 수 없습니다");
  }

  // 2. 통계 정보 수집
  const [diaryCount, commentCount, groupCount] = await Promise.all([
    supabase
      .from("diaries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase
      .from("groups")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id),
  ]);

  // 3. deleted_profiles에 정보 백업
  const { error: backupError } = await supabase
    .from("deleted_profiles")
    .insert({
      id: profile.id,
      email: profile.email,
      nickname: profile.nickname,
      avatar_url: profile.avatar_url,
      provider: profile.provider,
      original_created_at: profile.created_at,
      diary_count: diaryCount.count || 0,
      comment_count: commentCount.count || 0,
      group_count: groupCount.count || 0,
    });

  if (backupError) {
    console.error("프로필 백업 실패:", backupError);
    throw ApiErrors.internal("탈퇴 처리 중 오류가 발생했습니다");
  }

  // 4. 소유한 그룹 삭제
  const { error: groupError } = await supabase
    .from("groups")
    .delete()
    .eq("owner_id", user.id);

  if (groupError) {
    console.error("그룹 삭제 실패:", groupError);
    throw ApiErrors.internal("그룹 삭제 중 오류가 발생했습니다");
  }

  // 5. 그룹 멤버십 삭제
  const { error: memberError } = await supabase
    .from("group_members")
    .delete()
    .eq("user_id", user.id);

  if (memberError) {
    console.error("멤버십 삭제 실패:", memberError);
  }

  // 6. 프로필 삭제 (CASCADE로 인해 diaries, comments의 user_id가 NULL이 됨)
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);

  if (profileError) {
    console.error("프로필 삭제 실패:", profileError);
    throw ApiErrors.internal("프로필 삭제 중 오류가 발생했습니다");
  }

  // 7. 로그아웃
  await supabase.auth.signOut();

  return apiResponse({ deleted: true });
});
