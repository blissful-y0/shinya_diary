-- ============================================
-- 신규 회원 가입 버그 수정
-- 문제: generate_public_id() 함수가 존재하지 않거나 권한/스키마 문제로 호출 실패
-- 해결: 함수 생성, 권한 부여, set_public_id 함수에서 스키마 명시
-- ============================================

-- 1. generate_public_id 함수 생성 (8자리 hex 문자열 생성)
CREATE OR REPLACE FUNCTION public.generate_public_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := '0123456789abcdef';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || SUBSTR(chars, FLOOR(RANDOM() * 16 + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 2. generate_public_id 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO anon;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO service_role;

-- 3. set_public_id 함수 수정 (스키마 명시 + search_path 설정)
CREATE OR REPLACE FUNCTION public.set_public_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    NEW.public_id := public.generate_public_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 4. profiles INSERT 정책 추가 (선택사항 - SECURITY DEFINER로 우회 가능하지만 안전을 위해)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Enable insert for auth trigger'
  ) THEN
    CREATE POLICY "Enable insert for auth trigger" ON public.profiles
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;
