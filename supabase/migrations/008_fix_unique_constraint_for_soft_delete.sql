-- =============================================
-- Soft Delete와 호환되도록 Unique Constraint 수정
-- diaries 테이블의 (group_id, user_id, date) unique constraint를
-- partial index로 변경하여 deleted_at이 NULL인 경우만 적용
-- =============================================

-- 1. 기존 unique constraint 제거
ALTER TABLE public.diaries DROP CONSTRAINT IF EXISTS diaries_group_id_user_id_date_key;

-- 2. deleted_at이 NULL인 경우만 unique하도록 partial unique index 생성
CREATE UNIQUE INDEX idx_diaries_unique_active_entry
ON public.diaries(group_id, user_id, date)
WHERE deleted_at IS NULL;

-- 이제 삭제된 일기는 unique constraint에서 제외되므로,
-- 같은 날짜에 다시 작성할 수 있습니다.
