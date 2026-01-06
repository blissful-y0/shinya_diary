-- =============================================
-- group_members INSERT 정책 완전 재설정
-- 그룹 생성 시 자기 자신 추가 허용
-- =============================================

-- 기존 INSERT 정책 모두 삭제
DROP POLICY IF EXISTS "Owner can add members" ON public.group_members;
DROP POLICY IF EXISTS "Owner can add members or self join" ON public.group_members;
DROP POLICY IF EXISTS "group_members_insert_policy" ON public.group_members;

-- SECURITY DEFINER 함수 재생성 (RLS 우회)
CREATE OR REPLACE FUNCTION public.is_group_owner(check_group_id UUID, check_user_id UUID)
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

-- 단일 INSERT 정책: 자기 자신 추가 또는 방장이 멤버 추가
CREATE POLICY "group_members_insert_policy"
  ON public.group_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR
    public.is_group_owner(group_id, auth.uid())
  );
