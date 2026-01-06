-- =============================================
-- 사용자 탈퇴 Soft Delete 구현
-- 1. FK constraint를 ON DELETE SET NULL로 변경
-- 2. deleted_profiles 테이블 생성
-- =============================================

-- =============================================
-- 1. diaries 테이블 FK constraint 변경
-- =============================================

-- 기존 FK constraint 삭제
ALTER TABLE public.diaries
DROP CONSTRAINT IF EXISTS diaries_user_id_fkey;

-- user_id를 nullable로 변경
ALTER TABLE public.diaries
ALTER COLUMN user_id DROP NOT NULL;

-- ON DELETE SET NULL로 FK constraint 재생성
ALTER TABLE public.diaries
ADD CONSTRAINT diaries_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- =============================================
-- 2. comments 테이블 FK constraint 변경
-- =============================================

-- 기존 FK constraint 삭제
ALTER TABLE public.comments
DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

-- user_id를 nullable로 변경
ALTER TABLE public.comments
ALTER COLUMN user_id DROP NOT NULL;

-- ON DELETE SET NULL로 FK constraint 재생성
ALTER TABLE public.comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE SET NULL;

-- =============================================
-- 3. deleted_profiles 테이블 생성
-- =============================================

CREATE TABLE public.deleted_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  provider TEXT,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- 원본 데이터 보관
  original_created_at TIMESTAMPTZ,
  -- 추가 정보
  deletion_reason TEXT,
  -- 통계용
  diary_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  group_count INTEGER DEFAULT 0
);

-- 인덱스
CREATE INDEX idx_deleted_profiles_email ON public.deleted_profiles(email);
CREATE INDEX idx_deleted_profiles_deleted_at ON public.deleted_profiles(deleted_at);

-- =============================================
-- 설명
-- =============================================

-- 탈퇴 시 동작:
-- 1. profiles 정보를 deleted_profiles에 복사
-- 2. profiles 삭제 → user_id가 NULL이 됨
-- 3. 일기/댓글은 보존되고 "탈퇴한 사용자"로 표시

-- 재가입 시:
-- 1. 새로운 auth.users 생성
-- 2. 새로운 profiles 생성
-- 3. 이전 정보는 deleted_profiles에 보관
