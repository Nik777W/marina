export type GalleryAspectRatio = "portrait" | "landscape" | "square" | "tall";

export type GalleryPhotoRow = {
  id: string;
  storage_path: string;
  alt_text: string;
  aspect_ratio: GalleryAspectRatio;
  is_visible: boolean;
  sort_order: number;
  width: number | null;
  height: number | null;
};

/** Props for the public masonry grid (serializable from server). */
export type GalleryPhotoPublic = {
  id: string;
  src: string;
  alt: string;
  aspectRatio: GalleryAspectRatio;
  width: number | null;
  height: number | null;
};

const BUCKET = "gallery";

export function getGalleryPublicUrl(storagePath: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  if (!base) return "";
  const encoded = storagePath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}
