-- =============================================
-- Provider 필드 추가
-- =============================================

-- 1. provider 컬럼 추가
ALTER TABLE public.profiles
ADD COLUMN provider TEXT DEFAULT 'email';

-- 2. 기존 트리거 함수 수정 (provider 포함)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 기존 사용자들의 provider 업데이트 (auth.users에서 가져오기)
UPDATE public.profiles p
SET provider = COALESCE(
  (SELECT raw_app_meta_data->>'provider' FROM auth.users WHERE id = p.id),
  'email'
)
WHERE provider IS NULL OR provider = 'email';
