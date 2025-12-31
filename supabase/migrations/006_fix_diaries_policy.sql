-- =============================================
-- diaries & comments RLS 정책 단순화
-- Read-after-Write 로직은 API에서 처리
-- =============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Group members can view diaries" ON public.diaries;
DROP POLICY IF EXISTS "Users who can view diary can view comments" ON public.comments;
DROP POLICY IF EXISTS "Group members can create comments" ON public.comments;

-- 단순화된 다이어리 조회 정책: 그룹 멤버면 조회 가능
CREATE POLICY "Group members can view diaries"
  ON public.diaries FOR SELECT
  USING (
    public.is_group_member(group_id, auth.uid())
  );

-- SECURITY DEFINER 함수로 다이어리 그룹 조회
CREATE OR REPLACE FUNCTION public.get_diary_group_id(check_diary_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM diaries WHERE id = check_diary_id;
$$;

-- 단순화된 코멘트 조회 정책
CREATE POLICY "Users who can view diary can view comments"
  ON public.comments FOR SELECT
  USING (
    public.is_group_member(public.get_diary_group_id(diary_id), auth.uid())
  );

-- 단순화된 코멘트 작성 정책
CREATE POLICY "Group members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_group_member(public.get_diary_group_id(diary_id), auth.uid())
  );
