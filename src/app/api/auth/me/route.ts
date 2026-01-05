import { withAuth, apiResponse } from "@/lib/api/utils";

export const runtime = "edge";

export const GET = withAuth(async ({ user }) => {
  return apiResponse({
    id: user.id,
    email: user.email,
  });
});
