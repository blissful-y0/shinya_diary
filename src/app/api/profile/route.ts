import { withAuth, apiResponse, ApiErrors } from "@/lib/api/utils";

export const runtime = "edge";

export const GET = withAuth(async ({ user, supabase }) => {
  const [profileResult, groupCountResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, nickname, avatar_url, provider, created_at, updated_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  if (profileResult.error) {
    throw ApiErrors.internal(profileResult.error.message);
  }

  return apiResponse({
    profile: profileResult.data,
    stats: {
      groupCount: groupCountResult.count || 0,
    },
  });
});

export const PATCH = withAuth(async ({ request, user, supabase }) => {
  const body = await request.json();
  const { nickname, avatarUrl } = body;

  const updateData: Record<string, unknown> = {};
  if (nickname !== undefined) updateData.nickname = nickname;
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    throw ApiErrors.internal(error.message);
  }

  return { updated: true };
});
