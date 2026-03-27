"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import photo1 from "@/photos/photo-1.jpg";
import photo2 from "@/photos/photo-2.jpg";
import photo3 from "@/photos/photo-3.jpg";
import photo4 from "@/photos/photo-4.jpg";
import photo5 from "@/photos/photo-5.jpg";
import photo6 from "@/photos/photo-6.jpg";
import photo7 from "@/photos/photo-7.jpg";
import photo8 from "@/photos/photo-8.jpg";
import photo9 from "@/photos/photo-9.jpg";

interface Photo {
  id: number;
  src: StaticImageData;
  alt: string;
  aspectRatio: "portrait" | "landscape" | "square" | "tall";
}

const photos: Photo[] = [
  { id: 1, src: photo1, alt: "Portrait photography", aspectRatio: "portrait" },
  { id: 2, src: photo2, alt: "Street photography", aspectRatio: "square" },
  { id: 3, src: photo3, alt: "Fashion photography", aspectRatio: "tall" },
  { id: 4, src: photo4, alt: "Portrait photography", aspectRatio: "portrait" },
  { id: 5, src: photo5, alt: "Lifestyle photography", aspectRatio: "landscape" },
  { id: 6, src: photo6, alt: "Family photography", aspectRatio: "portrait" },
  { id: 7, src: photo7, alt: "Portrait photography", aspectRatio: "tall" },
  { id: 8, src: photo8, alt: "Lifestyle photography", aspectRatio: "square" },
  { id: 9, src: photo9, alt: "Portrait photography", aspectRatio: "portrait" },
];

const aspectRatioClasses = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  tall: "aspect-[2/3]",
};

export function MasonryGrid() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  const columns: Photo[][] = [[], [], []];
  photos.forEach((photo, index) => {
    columns[index % 3].push(photo);
  });

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
                  className={`object-cover transition-all duration-500 grayscale hover:grayscale-0 ${
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
