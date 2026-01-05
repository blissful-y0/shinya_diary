-- =============================================
-- group_members RLS 정책 수정
-- 무한 재귀 문제 해결
-- =============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Group members can view members" ON public.group_members;

-- SECURITY DEFINER 함수로 그룹 멤버 확인
CREATE OR REPLACE FUNCTION public.is_group_member(check_group_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = check_group_id AND user_id = check_user_id
  );
$$;

-- 새로운 정책: 같은 그룹 멤버 조회
CREATE POLICY "Group members can view members"
  ON public.group_members FOR SELECT
  USING (
    public.is_group_member(group_id, auth.uid())
  );

-- profiles 정책도 같은 문제가 있을 수 있으므로 수정
DROP POLICY IF EXISTS "Users can view group members profiles" ON public.profiles;

CREATE POLICY "Users can view group members profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.user_id = auth.uid()
      AND public.is_group_member(gm.group_id, profiles.id)
    )
  );
