import { Footer } from "@/components/footer";
import { MasonryGrid } from "@/components/masonry-grid";
import { getVisibleGalleryPhotos } from "@/lib/gallery/queries";

export default async function Home() {
  const photos = await getVisibleGalleryPhotos();

  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-black">
      <main className="flex flex-1 flex-col">
        <MasonryGrid photos={photos} />
        <Footer />
      </main>
    </div>
  );
}
