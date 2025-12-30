-- =============================================
-- 그룹별 멀티 프로필 지원
-- 각 그룹에서 다른 닉네임/아바타 사용 가능
-- =============================================

-- group_members 테이블에 프로필 필드 추가
ALTER TABLE public.group_members
  ADD COLUMN nickname TEXT,
  ADD COLUMN avatar_url TEXT;

-- 그룹 프로필 업데이트 정책 추가
CREATE POLICY "Users can update their group profile"
  ON public.group_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 그룹 가입 시 기본 프로필 복사 함수
CREATE OR REPLACE FUNCTION copy_default_profile_to_group()
RETURNS TRIGGER AS $$
BEGIN
  -- 기본 프로필에서 닉네임과 아바타 복사
  SELECT nickname, avatar_url INTO NEW.nickname, NEW.avatar_url
  FROM public.profiles
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER copy_profile_on_join
  BEFORE INSERT ON public.group_members
  FOR EACH ROW
  WHEN (NEW.nickname IS NULL)
  EXECUTE FUNCTION copy_default_profile_to_group();
