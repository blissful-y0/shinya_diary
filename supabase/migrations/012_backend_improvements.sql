-- =============================================
-- Backend Improvements Migration
-- - Soft delete 통일
-- - 인덱스 최적화
-- - comment_count 캐싱
-- =============================================

-- 1. Soft delete 컬럼 추가 (없는 테이블에만)
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.join_requests ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Partial 인덱스 생성 (soft delete 조건 포함)
DROP INDEX IF EXISTS idx_diaries_group_date;
CREATE INDEX IF NOT EXISTS idx_diaries_group_date_active 
  ON public.diaries(group_id, date) 
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_comments_diary_active
  ON public.comments(diary_id, created_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_group_members_active
  ON public.group_members(group_id, user_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_groups_active
  ON public.groups(id)
  WHERE deleted_at IS NULL;

-- 3. comment_count 캐싱 컬럼 추가
ALTER TABLE public.diaries ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;

-- 기존 데이터 업데이트
UPDATE public.diaries d
SET comment_count = (
  SELECT COUNT(*)
  FROM public.comments c
  WHERE c.diary_id = d.id AND c.deleted_at IS NULL
);

-- 4. comment_count 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_diary_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.deleted_at IS NULL THEN
    UPDATE public.diaries SET comment_count = comment_count + 1 WHERE id = NEW.diary_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE public.diaries SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.diary_id;
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE public.diaries SET comment_count = comment_count + 1 WHERE id = NEW.diary_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.deleted_at IS NULL THEN
    UPDATE public.diaries SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.diary_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_count_trigger ON public.comments;
CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_diary_comment_count();

-- 5. RLS 정책 업데이트 (soft delete 조건 추가)
DROP POLICY IF EXISTS "Group members can view active group" ON public.groups;
CREATE POLICY "Group members can view active group"
  ON public.groups FOR SELECT
  USING (
    deleted_at IS NULL AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = groups.id 
        AND user_id = auth.uid()
        AND deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Anyone can view group by invite code" ON public.groups;
CREATE POLICY "Anyone can view active group by invite code"
  ON public.groups FOR SELECT
  USING (deleted_at IS NULL);
