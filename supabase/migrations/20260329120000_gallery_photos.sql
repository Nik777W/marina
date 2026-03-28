-- Portfolio gallery: metadata in public.gallery_photos, files in storage bucket "gallery"

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
CREATE TABLE public.gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  alt_text text NOT NULL DEFAULT '',
  aspect_ratio text NOT NULL DEFAULT 'portrait'
    CHECK (aspect_ratio IN ('portrait', 'landscape', 'square', 'tall')),
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX gallery_photos_visible_sort_idx
  ON public.gallery_photos (is_visible, sort_order);

COMMENT ON TABLE public.gallery_photos IS 'Portfolio images; file bytes live in storage bucket gallery';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can read rows marked visible (public site).
CREATE POLICY gallery_photos_select_visible
  ON public.gallery_photos
  FOR SELECT
  USING (is_visible = true);

-- Logged-in users can read all rows (dashboard: hidden items).
CREATE POLICY gallery_photos_select_all_authenticated
  ON public.gallery_photos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY gallery_photos_insert_authenticated
  ON public.gallery_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY gallery_photos_update_authenticated
  ON public.gallery_photos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY gallery_photos_delete_authenticated
  ON public.gallery_photos
  FOR DELETE
  TO authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- Storage bucket (public URLs for next/image)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Remove old policies if re-applying
DROP POLICY IF EXISTS "gallery_storage_select_public" ON storage.objects;
DROP POLICY IF EXISTS "gallery_storage_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "gallery_storage_update_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "gallery_storage_delete_authenticated" ON storage.objects;

CREATE POLICY "gallery_storage_select_public"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "gallery_storage_insert_authenticated"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery_storage_update_authenticated"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'gallery')
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery_storage_delete_authenticated"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
