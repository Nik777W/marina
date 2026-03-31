import { createClient } from "@/lib/supabase/server";
import {
  type GalleryPhotoPublic,
  getGalleryPublicUrl,
  type GalleryAspectRatio,
} from "@/lib/gallery";

export async function getVisibleGalleryPhotos(): Promise<GalleryPhotoPublic[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id, storage_path, alt_text, aspect_ratio, sort_order")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    if (!data?.length) {
      return [];
    }

    return data.map((row) => ({
      id: row.id,
      src: getGalleryPublicUrl(row.storage_path),
      alt: row.alt_text || "Gallery image",
      aspectRatio: row.aspect_ratio as GalleryAspectRatio,
    }));
  } catch (err) {
    console.error("getVisibleGalleryPhotos error:", err);
    return [];
  }
}
