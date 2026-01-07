-- =============================================
-- Shinya Diary - Production Schema (Consolidated)
-- Generated: 2025-01-07
-- =============================================

-- =============================================
-- 1. TABLES
-- =============================================

-- profiles (사용자 프로필)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'email',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- deleted_profiles (탈퇴한 사용자 보관)
CREATE TABLE public.deleted_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  provider TEXT,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  original_created_at TIMESTAMPTZ,
  deletion_reason TEXT,
  diary_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  group_count INTEGER DEFAULT 0
);

-- groups (그룹)
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT UNIQUE,
  name TEXT NOT NULL,
  icon_url TEXT,
  cover_image_url TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- group_members (그룹 멤버)
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nickname TEXT,
  avatar_url TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(group_id, user_id)
);

-- join_requests (가입 요청)
CREATE TYPE public.join_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.join_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE(group_id, user_id)
);

-- diaries (다이어리)
CREATE TABLE public.diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT,
  image_url TEXT,
  sticker_data JSONB,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  comment_count INT DEFAULT 0
);

-- comments (코멘트)
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- =============================================
-- 2. FUNCTIONS
-- =============================================

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 초대 코드 생성
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 초대 코드 자동 설정
CREATE OR REPLACE FUNCTION public.set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := public.generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- public_id 생성 (8자리 hex)
CREATE OR REPLACE FUNCTION public.generate_public_id()
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

-- public_id 자동 설정
CREATE OR REPLACE FUNCTION public.set_public_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    NEW.public_id := public.generate_public_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- 신규 사용자 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nickname = COALESCE(profiles.nickname, EXCLUDED.nickname),
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    provider = COALESCE(profiles.provider, EXCLUDED.provider);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 그룹 멤버 수 제한 (4명)
CREATE OR REPLACE FUNCTION public.check_group_member_limit()
RETURNS TRIGGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM public.group_members
  WHERE group_id = NEW.group_id AND deleted_at IS NULL;

  IF member_count >= 4 THEN
    RAISE EXCEPTION 'Group member limit (4) exceeded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- comment_count 자동 업데이트
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

-- =============================================
-- 3. TRIGGERS
-- =============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER groups_set_invite_code
  BEFORE INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.set_invite_code();

CREATE TRIGGER groups_set_public_id
  BEFORE INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.set_public_id();

CREATE TRIGGER group_members_limit
  BEFORE INSERT ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.check_group_member_limit();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_diary_comment_count();

-- =============================================
-- 4. INDEXES
-- =============================================

CREATE INDEX idx_deleted_profiles_email ON public.deleted_profiles(email);
CREATE INDEX idx_deleted_profiles_deleted_at ON public.deleted_profiles(deleted_at);

CREATE INDEX idx_groups_public_id ON public.groups(public_id) WHERE public_id IS NOT NULL;
CREATE INDEX idx_groups_active ON public.groups(id) WHERE deleted_at IS NULL;

CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_active ON public.group_members(group_id, user_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_join_requests_group_id ON public.join_requests(group_id);
CREATE INDEX idx_join_requests_status ON public.join_requests(status);

CREATE INDEX idx_diaries_group_id ON public.diaries(group_id);
CREATE INDEX idx_diaries_date ON public.diaries(date);
CREATE INDEX idx_diaries_group_date_active ON public.diaries(group_id, date) WHERE deleted_at IS NULL;
CREATE INDEX idx_diaries_deleted_at ON public.diaries(deleted_at) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_diaries_unique_active_entry ON public.diaries(group_id, user_id, date) WHERE deleted_at IS NULL;

CREATE INDEX idx_comments_diary_id ON public.comments(diary_id);
CREATE INDEX idx_comments_diary_active ON public.comments(diary_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_deleted_at ON public.comments(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 5. GRANTS
-- =============================================

GRANT EXECUTE ON FUNCTION public.generate_public_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO anon;
GRANT EXECUTE ON FUNCTION public.generate_public_id() TO service_role;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO anon;
GRANT EXECUTE ON FUNCTION public.set_public_id() TO service_role;

-- =============================================
-- 6. STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('groups', 'groups', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('diaries', 'diaries', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 7. STORAGE POLICIES
-- =============================================

-- avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- groups
CREATE POLICY "Group images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'groups');
CREATE POLICY "Group owner can upload group images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'groups' AND EXISTS (SELECT 1 FROM public.groups WHERE id::text = (storage.foldername(name))[1] AND owner_id = auth.uid()));
CREATE POLICY "Group owner can update group images" ON storage.objects FOR UPDATE USING (bucket_id = 'groups' AND EXISTS (SELECT 1 FROM public.groups WHERE id::text = (storage.foldername(name))[1] AND owner_id = auth.uid()));
CREATE POLICY "Group owner can delete group images" ON storage.objects FOR DELETE USING (bucket_id = 'groups' AND EXISTS (SELECT 1 FROM public.groups WHERE id::text = (storage.foldername(name))[1] AND owner_id = auth.uid()));

-- diaries
CREATE POLICY "Group members can view diary images" ON storage.objects FOR SELECT USING (bucket_id = 'diaries' AND EXISTS (SELECT 1 FROM public.group_members WHERE group_id::text = (storage.foldername(name))[1] AND user_id = auth.uid()));
CREATE POLICY "Group members can upload diary images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'diaries' AND auth.uid()::text = (storage.foldername(name))[2] AND EXISTS (SELECT 1 FROM public.group_members WHERE group_id::text = (storage.foldername(name))[1] AND user_id = auth.uid()));
CREATE POLICY "Users can update own diary images" ON storage.objects FOR UPDATE USING (bucket_id = 'diaries' AND auth.uid()::text = (storage.foldername(name))[2]);
CREATE POLICY "Users can delete own diary images" ON storage.objects FOR DELETE USING (bucket_id = 'diaries' AND auth.uid()::text = (storage.foldername(name))[2]);

-- =============================================
-- 8. RLS DISABLED (using service layer auth)
-- =============================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deleted_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.diaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
