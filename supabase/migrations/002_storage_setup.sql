-- =============================================
-- Storage Bucket Setup for Diary Images
-- =============================================

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'diary-images',
  'diary-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Storage Policies
-- =============================================

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload images to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'diary-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all images
CREATE POLICY "Public read access for diary images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diary-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'diary-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'diary-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
