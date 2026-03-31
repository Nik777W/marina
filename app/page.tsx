import { Footer } from "@/components/footer";
import { MasonryGrid } from "@/components/masonry-grid";
import { AboutSection } from "@/components/about-section";
import { PricingSection } from "@/components/pricing-section";
import { getVisibleGalleryPhotos } from "@/lib/gallery/queries";

export default async function Home() {
  const photos = await getVisibleGalleryPhotos();

  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-black overflow-x-hidden">
      <main className="flex flex-1 flex-col overflow-x-hidden">
        <MasonryGrid photos={photos} />
        <AboutSection />
        <PricingSection />
        <Footer />
      </main>
    </div>
  );
}
