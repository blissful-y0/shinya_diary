-- =============================================
-- Soft Delete 기능 추가
-- diaries와 comments 테이블에 deleted_at 컬럼 추가
-- =============================================

-- 1. diaries 테이블에 deleted_at 컬럼 추가
ALTER TABLE public.diaries
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- deleted_at 인덱스 추가 (성능 최적화)
CREATE INDEX idx_diaries_deleted_at ON public.diaries(deleted_at)
WHERE deleted_at IS NULL;

-- 2. comments 테이블에 deleted_at 컬럼 추가
ALTER TABLE public.comments
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- deleted_at 인덱스 추가 (성능 최적화)
CREATE INDEX idx_comments_deleted_at ON public.comments(deleted_at)
WHERE deleted_at IS NULL;

-- 3. 기존 인덱스는 deleted_at이 NULL인 경우만 적용되도록 재생성하지 않음
-- (API 레벨에서 deleted_at IS NULL 조건으로 필터링)
