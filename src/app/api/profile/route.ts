import { withAuth, apiResponse, parseBody, ApiErrors } from "@/lib/api/utils";
import { profileService } from "@/server/services";
import { updateProfileSchema } from "@/server/validations";

export const runtime = "edge";

export const GET = withAuth(async ({ user, supabase }) => {
  const result = await profileService.getMyProfile(supabase, user.id);
  return apiResponse(result);
});

export const PATCH = withAuth(async ({ request, user, supabase }) => {
  const input = await parseBody(request, updateProfileSchema);
  const result = await profileService.updateProfile(supabase, user.id, input);
  return apiResponse(result);
});
