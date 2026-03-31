-- Add width/height columns for masonry grid natural proportions

ALTER TABLE public.gallery_photos
ADD COLUMN width integer,
ADD COLUMN height integer;

COMMENT ON COLUMN public.gallery_photos.width IS 'Original image width in pixels';
COMMENT ON COLUMN public.gallery_photos.height IS 'Original image height in pixels';
