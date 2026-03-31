"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";

import type { GalleryPhotoPublic } from "@/lib/gallery";

type MasonryGridProps = {
  photos: GalleryPhotoPublic[];
};

export function MasonryGrid({ photos }: MasonryGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const goToPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1);
  }, [selectedIndex, photos.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0);
  }, [selectedIndex, photos.length]);

  // Fullscreen for mobile
  useEffect(() => {
    if (selectedIndex !== null && lightboxRef.current) {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile && lightboxRef.current.requestFullscreen) {
        lightboxRef.current.requestFullscreen().catch(() => {});
      }
    }
  }, [selectedIndex]);

  // Handle fullscreen change (user pressed ESC or exited fullscreen)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && selectedIndex !== null) {
        // Only close if we were in fullscreen mode before
        setSelectedIndex(null);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [selectedIndex]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex, closeLightbox, goToPrev, goToNext]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next
        goToNext();
      } else {
        // Swipe right - prev
        goToPrev();
      }
    }
    
    setTouchStart(null);
  };

  if (photos.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <p className="text-center text-sm text-black/50">
          Фотографии появятся здесь после загрузки в личном кабинете.
        </p>
      </section>
    );
  }

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden bg-zinc-100 break-inside-avoid cursor-pointer max-w-full"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width || 800}
                height={photo.height || 600}
                className={`w-full h-auto max-w-full md:grayscale md:transition-all md:duration-500 md:hover:scale-105 md:hover:grayscale-0 ${
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
      </section>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          ref={lightboxRef}
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black p-0 md:p-4"
        >
          {/* Navigation arrows - desktop only */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* Counter - desktop only */}
          <div className="hidden md:block absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {selectedIndex !== null ? selectedIndex + 1 : 0} / {photos.length}
          </div>

          {/* Image */}
          <Image
            src={selectedPhoto.src}
            alt={selectedPhoto.alt}
            width={selectedPhoto.width || 1600}
            height={selectedPhoto.height || 1200}
            className="max-h-screen max-w-full object-contain"
            sizes="100vw"
          />
        </div>
      )}
    </>
  );
}
