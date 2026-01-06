-- =============================================
-- RLS 설정: deleted_profiles 테이블 보안
-- =============================================
-- deleted_profiles는 민감한 정보를 담고 있으므로
-- 모든 직접적인 접근을 차단하고, 서버 사이드 API를 통해서만 접근 가능하도록 설정

-- RLS 활성화
ALTER TABLE public.deleted_profiles ENABLE ROW LEVEL SECURITY;

-- 모든 직접 접근 차단 (서버 사이드 API만 접근 가능)
-- SELECT, INSERT, UPDATE, DELETE 모두 차단
CREATE POLICY "Block all direct access to deleted_profiles"
ON public.deleted_profiles
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

-- 익명 사용자도 차단
CREATE POLICY "Block anonymous access to deleted_profiles"
ON public.deleted_profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 서버 사이드에서는 service_role 키를 사용하므로 이 정책들을 우회할 수 있음
-- 클라이언트에서는 어떤 방법으로도 deleted_profiles에 접근할 수 없음
