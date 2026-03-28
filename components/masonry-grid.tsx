"use client";

import Image from "next/image";
import { useState } from "react";

import type { GalleryAspectRatio, GalleryPhotoPublic } from "@/lib/gallery";

const aspectRatioClasses: Record<GalleryAspectRatio, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
};

type MasonryGridProps = {
  photos: GalleryPhotoPublic[];
};

export function MasonryGrid({ photos }: MasonryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  const columns: GalleryPhotoPublic[][] = [[], [], []];
  photos.forEach((photo, index) => {
    columns[index % 3].push(photo);
  });

  if (photos.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <p className="text-center text-sm text-black/50">
          Фотографии появятся здесь после загрузки в личном кабинете.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((photo) => (
              <div
                key={photo.id}
                className={`group relative overflow-hidden bg-zinc-100 ${aspectRatioClasses[photo.aspectRatio]}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className={`object-cover md:grayscale md:transition-all md:duration-500 md:hover:scale-105 md:hover:grayscale-0 ${
                    loadedImages.has(photo.id) ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => handleImageLoad(photo.id)}
                />
                {!loadedImages.has(photo.id) && (
                  <div className="absolute inset-0 animate-pulse bg-zinc-200" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
