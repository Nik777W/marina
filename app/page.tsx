import { MasonryGrid } from "@/components/masonry-grid";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-black">
      <main className="flex flex-1 flex-col">
        <MasonryGrid />
      </main>
    </div>
  );
}
