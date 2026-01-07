-- =============================================
-- group_members INSERT 정책 재설정
-- 그룹 생성 시 자기 자신 추가 허용
-- =============================================

-- 모든 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Owner can add members" ON public.group_members;
DROP POLICY IF EXISTS "Owner can add members or self join" ON public.group_members;
DROP POLICY IF EXISTS "group_members_insert_policy" ON public.group_members;
DROP POLICY IF EXISTS "Members can insert themselves" ON public.group_members;

-- is_group_owner 함수 재생성 (확실하게)
DROP FUNCTION IF EXISTS public.is_group_owner(UUID, UUID);

CREATE FUNCTION public.is_group_owner(check_group_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = check_group_id AND owner_id = check_user_id
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_group_owner(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_group_owner(UUID, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.is_group_owner(UUID, UUID) TO service_role;

-- 단일 INSERT 정책 생성
-- 조건: 자기 자신을 추가하거나, 그룹 방장이 추가하는 경우
CREATE POLICY "group_members_insert_policy"
  ON public.group_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR
    public.is_group_owner(group_id, auth.uid())
  );
