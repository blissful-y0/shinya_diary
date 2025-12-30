-- =============================================
-- Shinya Diary - Storage 설정
-- =============================================

-- =============================================
-- 버킷 생성
-- =============================================

-- 프로필 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 그룹 이미지 버킷 (아이콘, 커버)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'groups',
  'groups',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 다이어리 이미지 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'diaries',
  'diaries',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- avatars 버킷 정책
-- =============================================

-- 누구나 조회 가능
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 인증된 사용자만 업로드 (자신의 폴더에만)
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 자신의 아바타만 수정
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 자신의 아바타만 삭제
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- groups 버킷 정책
-- =============================================

-- 누구나 조회 가능
CREATE POLICY "Group images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'groups');

-- 그룹 방장만 업로드
CREATE POLICY "Group owner can upload group images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'groups'
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE id::text = (storage.foldername(name))[1]
      AND owner_id = auth.uid()
    )
  );

-- 그룹 방장만 수정
CREATE POLICY "Group owner can update group images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'groups'
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE id::text = (storage.foldername(name))[1]
      AND owner_id = auth.uid()
    )
  );

-- 그룹 방장만 삭제
CREATE POLICY "Group owner can delete group images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'groups'
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE id::text = (storage.foldername(name))[1]
      AND owner_id = auth.uid()
    )
  );

-- =============================================
-- diaries 버킷 정책
-- =============================================

-- 같은 그룹 멤버만 조회 가능
CREATE POLICY "Group members can view diary images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'diaries'
    AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id::text = (storage.foldername(name))[1]
      AND user_id = auth.uid()
    )
  );

-- 그룹 멤버만 업로드 (자신의 폴더에만)
CREATE POLICY "Group members can upload diary images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'diaries'
    AND auth.uid()::text = (storage.foldername(name))[2]
    AND EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id::text = (storage.foldername(name))[1]
      AND user_id = auth.uid()
    )
  );

-- 자신의 다이어리 이미지만 수정
CREATE POLICY "Users can update own diary images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'diaries'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );

-- 자신의 다이어리 이미지만 삭제
CREATE POLICY "Users can delete own diary images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'diaries'
    AND auth.uid()::text = (storage.foldername(name))[2]
  );
