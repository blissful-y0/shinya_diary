-- =============================================
-- group_members INSERT 정책 수정
-- 그룹 생성 시 닭과 달걀 문제 해결
-- =============================================

-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Owner can add members" ON public.group_members;

-- SECURITY DEFINER 함수: 그룹 owner 확인 (RLS 우회)
CREATE OR REPLACE FUNCTION public.is_group_owner(check_group_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM groups
    WHERE id = check_group_id AND owner_id = check_user_id
  );
$$;

-- 새로운 INSERT 정책: 자기 자신을 추가하거나 방장이 멤버 추가
CREATE POLICY "Owner can add members or self join"
  ON public.group_members FOR INSERT
  WITH CHECK (
    -- 자기 자신을 추가 (그룹 생성 시 또는 초대 수락 시)
    user_id = auth.uid()
    OR
    -- 방장이 다른 사람을 추가 (가입 승인 시)
    public.is_group_owner(group_id, auth.uid())
  );

-- 주석:
-- SECURITY DEFINER 함수를 사용하여 groups 테이블 조회 시 RLS를 우회
-- 이를 통해 그룹 생성 시 순환 의존성 문제를 해결
