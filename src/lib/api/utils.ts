import { createEdgeClient } from "@/lib/supabase/edge";
import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

export type ApiHandler<T = unknown> = (params: {
  request: NextRequest;
  user: User;
  supabase: SupabaseClient;
}) => Promise<T>;

export function apiResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
) {
  return NextResponse.json({ success: true, data, ...meta }, { status });
}

export function apiError(error: string, status = 400, code?: string) {
  return NextResponse.json(
    { success: false, error, ...(code && { code }) },
    { status }
  );
}

export async function requireAuth(request: NextRequest) {
  const supabase = createEdgeClient(request);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: apiError("인증이 필요합니다", 401, "UNAUTHORIZED") };
  }
  return { user, supabase, error: null };
}

export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { user, supabase, error } = await requireAuth(request);
      if (error) return error;

      const result = await handler({ request, user: user!, supabase });
      
      if (result instanceof NextResponse) {
        return result;
      }
      
      return apiResponse(result);
    } catch (err) {
      console.error("API Error:", err);
      
      if (err instanceof ApiException) {
        return apiError(err.message, err.status, err.code);
      }
      
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      return apiError(message, 500, "INTERNAL_ERROR");
    }
  };
}

export function withOptionalAuth(handler: (params: {
  request: NextRequest;
  user: User | null;
  supabase: SupabaseClient;
}) => Promise<unknown>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const supabase = createEdgeClient(request);
      const { data: { user } } = await supabase.auth.getUser();

      const result = await handler({ request, user, supabase });
      
      if (result instanceof NextResponse) {
        return result;
      }
      
      return apiResponse(result);
    } catch (err) {
      console.error("API Error:", err);
      
      if (err instanceof ApiException) {
        return apiError(err.message, err.status, err.code);
      }
      
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      return apiError(message, 500, "INTERNAL_ERROR");
    }
  };
}

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "ApiException";
  }
}

export const ApiErrors = {
  badRequest: (message: string) => new ApiException(message, 400, "BAD_REQUEST"),
  unauthorized: () => new ApiException("인증이 필요합니다", 401, "UNAUTHORIZED"),
  forbidden: (message = "접근 권한이 없습니다") => new ApiException(message, 403, "FORBIDDEN"),
  notFound: (resource = "리소스") => new ApiException(`${resource}를 찾을 수 없습니다`, 404, "NOT_FOUND"),
  conflict: (message: string) => new ApiException(message, 409, "CONFLICT"),
  internal: (message = "서버 오류가 발생했습니다") => new ApiException(message, 500, "INTERNAL_ERROR"),
};
