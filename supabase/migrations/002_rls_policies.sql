-- =============================================
-- Shinya Diary - RLS 정책
-- =============================================

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- profiles 정책
-- =============================================

-- 자신의 프로필 조회
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 같은 그룹 멤버의 프로필 조회
CREATE POLICY "Users can view group members profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm1
      JOIN public.group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = profiles.id
    )
  );

-- 자신의 프로필 수정
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- groups 정책
-- =============================================

-- 그룹 멤버만 조회 가능
CREATE POLICY "Group members can view group"
  ON public.groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id AND user_id = auth.uid()
    )
  );

-- 초대 코드로 그룹 조회 (가입 요청 시)
CREATE POLICY "Anyone can view group by invite code"
  ON public.groups FOR SELECT
  USING (true);

-- 인증된 사용자만 그룹 생성
CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 방장만 그룹 수정
CREATE POLICY "Owner can update group"
  ON public.groups FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 방장만 그룹 삭제
CREATE POLICY "Owner can delete group"
  ON public.groups FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================
-- group_members 정책
-- =============================================

-- 같은 그룹 멤버 조회
CREATE POLICY "Group members can view members"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
    )
  );

-- 그룹 방장만 멤버 추가 (가입 승인 시)
CREATE POLICY "Owner can add members"
  ON public.group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND owner_id = auth.uid()
    )
    OR user_id = auth.uid() -- 자기 자신을 추가 (그룹 생성 시)
  );

-- 자신의 그룹 프로필 수정
CREATE POLICY "Members can update own membership"
  ON public.group_members FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 방장이 멤버 삭제 또는 본인 탈퇴
CREATE POLICY "Owner can remove members or self leave"
  ON public.group_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

-- =============================================
-- join_requests 정책
-- =============================================

-- 방장이 가입 요청 조회
CREATE POLICY "Owner can view join requests"
  ON public.join_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

-- 자신의 가입 요청 조회
CREATE POLICY "Users can view own requests"
  ON public.join_requests FOR SELECT
  USING (user_id = auth.uid());

-- 인증된 사용자가 가입 요청 생성
CREATE POLICY "Authenticated users can create requests"
  ON public.join_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = join_requests.group_id AND user_id = auth.uid()
    )
  );

-- 방장이 가입 요청 상태 변경
CREATE POLICY "Owner can update request status"
  ON public.join_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

-- 방장 또는 요청자가 삭제
CREATE POLICY "Owner or requester can delete request"
  ON public.join_requests FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND owner_id = auth.uid()
    )
  );

-- =============================================
-- diaries 정책
-- =============================================

-- 같은 그룹 멤버가 조회 (단, 오늘 날짜는 자신이 작성했거나 작성해야 조회 가능)
CREATE POLICY "Group members can view diaries"
  ON public.diaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = diaries.group_id AND user_id = auth.uid()
    )
    AND (
      -- 과거 날짜는 무조건 볼 수 있음
      date < CURRENT_DATE
      -- 오늘 날짜는 자신의 일기이거나 자신이 이미 작성한 경우만
      OR user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.diaries d
        WHERE d.group_id = diaries.group_id 
        AND d.user_id = auth.uid() 
        AND d.date = CURRENT_DATE
      )
    )
  );

-- 그룹 멤버가 다이어리 작성
CREATE POLICY "Group members can create diaries"
  ON public.diaries FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = diaries.group_id AND user_id = auth.uid()
    )
  );

-- 자신의 다이어리 수정
CREATE POLICY "Users can update own diaries"
  ON public.diaries FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 자신의 다이어리 삭제
CREATE POLICY "Users can delete own diaries"
  ON public.diaries FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- comments 정책
-- =============================================

-- 다이어리를 볼 수 있는 사람만 코멘트 조회
CREATE POLICY "Users who can view diary can view comments"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.diaries d
      JOIN public.group_members gm ON gm.group_id = d.group_id
      WHERE d.id = comments.diary_id AND gm.user_id = auth.uid()
    )
  );

-- 그룹 멤버가 코멘트 작성
CREATE POLICY "Group members can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.diaries d
      JOIN public.group_members gm ON gm.group_id = d.group_id
      WHERE d.id = diary_id AND gm.user_id = auth.uid()
    )
  );

-- 자신의 코멘트 수정
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 자신의 코멘트 삭제
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (user_id = auth.uid());
