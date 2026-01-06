-- =============================================
-- Public ID 및 Serial ID 추가
-- - public_id: 8자 hex (API 노출용)
-- - serial_id: 순차 번호 (내부 트래킹용)
-- =============================================

-- =============================================
-- 1. 8자 hex 생성 함수
-- =============================================
CREATE OR REPLACE FUNCTION generate_public_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := '0123456789abcdef';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || SUBSTR(chars, FLOOR(RANDOM() * 16 + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 2. profiles 테이블
-- =============================================
ALTER TABLE public.profiles
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

-- 기존 데이터에 public_id 생성
UPDATE public.profiles SET public_id = generate_public_id() WHERE public_id IS NULL;

-- public_id NOT NULL 제약조건 추가
ALTER TABLE public.profiles ALTER COLUMN public_id SET NOT NULL;

-- 인덱스 추가
CREATE INDEX idx_profiles_public_id ON public.profiles(public_id);

-- =============================================
-- 3. groups 테이블
-- =============================================
ALTER TABLE public.groups
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

UPDATE public.groups SET public_id = generate_public_id() WHERE public_id IS NULL;
ALTER TABLE public.groups ALTER COLUMN public_id SET NOT NULL;
CREATE INDEX idx_groups_public_id ON public.groups(public_id);

-- =============================================
-- 4. group_members 테이블
-- =============================================
ALTER TABLE public.group_members
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

UPDATE public.group_members SET public_id = generate_public_id() WHERE public_id IS NULL;
ALTER TABLE public.group_members ALTER COLUMN public_id SET NOT NULL;
CREATE INDEX idx_group_members_public_id ON public.group_members(public_id);

-- =============================================
-- 5. diaries 테이블
-- =============================================
ALTER TABLE public.diaries
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

UPDATE public.diaries SET public_id = generate_public_id() WHERE public_id IS NULL;
ALTER TABLE public.diaries ALTER COLUMN public_id SET NOT NULL;
CREATE INDEX idx_diaries_public_id ON public.diaries(public_id);

-- =============================================
-- 6. comments 테이블
-- =============================================
ALTER TABLE public.comments
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

UPDATE public.comments SET public_id = generate_public_id() WHERE public_id IS NULL;
ALTER TABLE public.comments ALTER COLUMN public_id SET NOT NULL;
CREATE INDEX idx_comments_public_id ON public.comments(public_id);

-- =============================================
-- 7. join_requests 테이블
-- =============================================
ALTER TABLE public.join_requests
ADD COLUMN serial_id SERIAL UNIQUE,
ADD COLUMN public_id VARCHAR(8) UNIQUE;

UPDATE public.join_requests SET public_id = generate_public_id() WHERE public_id IS NULL;
ALTER TABLE public.join_requests ALTER COLUMN public_id SET NOT NULL;
CREATE INDEX idx_join_requests_public_id ON public.join_requests(public_id);

-- =============================================
-- 8. 자동 생성 트리거 함수
-- =============================================
CREATE OR REPLACE FUNCTION set_public_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    NEW.public_id := generate_public_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER profiles_set_public_id
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

CREATE TRIGGER groups_set_public_id
  BEFORE INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

CREATE TRIGGER group_members_set_public_id
  BEFORE INSERT ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

CREATE TRIGGER diaries_set_public_id
  BEFORE INSERT ON public.diaries
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

CREATE TRIGGER comments_set_public_id
  BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

CREATE TRIGGER join_requests_set_public_id
  BEFORE INSERT ON public.join_requests
  FOR EACH ROW EXECUTE FUNCTION set_public_id();

-- =============================================
-- 설명
-- =============================================
-- API에서는 public_id만 사용
-- serial_id는 내부 트래킹용 (관리자만 조회)
-- 예: GET /api/diaries/a3f2b4c1
