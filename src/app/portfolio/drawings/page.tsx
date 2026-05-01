"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Portfolio images list
const PORTFOLIO_IMAGES: readonly string[] = [
  "life_drawing_01.jpg",
  "life_drawing_02.jpg",
  "life_drawing_03.jpg",
  "life_drawing_04.jpg",
  "life_drawing_05.jpg",
  "life_drawing_06.jpg",
  "life_drawing_07.jpg",
  "life_drawing_08.jpg",
  "life_drawing_09.jpg",
  "life_drawing_10.jpg",
  "life_drawing_11.jpg",
  "life_drawing_12.jpg",
  "life_drawing_13.jpg",
  "still_life_01.jpg",
  "animal_01.jpg",
  "animal_02.jpg",
];

const formatImageName = (imageName: string): string => {
  return imageName.replace(/_/g, " ").replace(/\.jpg$/i, "");
};

const getImagePath = (imageName: string): string => {
  return `/images/portfolio/${imageName}`;
};

export default function Drawings() {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const isModalOpen = currentIndex >= 0;
  const selectedImage = isModalOpen ? PORTFOLIO_IMAGES[currentIndex] : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isModalOpen]);

  const openModal = (imageName: string) => {
    const index = PORTFOLIO_IMAGES.indexOf(imageName);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  };

  const closeModal = () => {
    setCurrentIndex(-1);
  };

  const navigateToIndex = (newIndex: number) => {
    setCurrentIndex(newIndex);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0
      ? currentIndex - 1
      : PORTFOLIO_IMAGES.length - 1;
    navigateToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < PORTFOLIO_IMAGES.length - 1
      ? currentIndex + 1
      : 0;
    navigateToIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <Link href="/" className="font-display text-2xl font-medium text-fg tracking-tight">
          Lei Yang
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link
            href="/portfolio"
            className="text-accent hover:text-fg transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/resume"
            className="text-muted hover:text-fg transition-colors"
          >
            Resume
          </Link>
          <Link
            href="/tools"
            className="text-muted hover:text-fg transition-colors"
          >
            Tools & AI
          </Link>
        </div>
      </nav>

      {/* Drawings Header */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/portfolio"
              className="text-accent hover:text-fg transition-colors inline-flex items-center mb-4"
            >
              ← Back to Portfolio
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-medium text-fg tracking-tight mb-4">
              2D Art <span className="text-accent">Gallery</span>
            </h1>
            <p className="text-xl text-muted">
              A collection of life drawings, still life, and animal studies
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_IMAGES.map((image, index) => (
              <div
                key={image}
                className="group bg-surface border border-rule rounded-xl overflow-hidden hover:border-accent transition-colors duration-300 hover:scale-105 cursor-pointer"
                onClick={() => openModal(image)}
              >
                <div className="relative aspect-[4/3] w-full bg-elevated">
                  <Image
                    src={getImagePath(image)}
                    alt={`${formatImageName(image)} - Drawing ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-fg font-semibold capitalize">
                    {formatImageName(image)}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Portfolio */}
          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="bg-accent hover:bg-accent-hover text-page hover:text-fg px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </main>

      {/* Modal for full-size image */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery modal"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-fg hover:text-accent transition-colors text-4xl font-bold z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Left arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-fg hover:text-accent transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            aria-label="Previous image"
          >
            ←
          </button>

          {/* Right arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-fg hover:text-accent transition-colors z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70"
            aria-label="Next image"
          >
            →
          </button>

          {/* Image counter */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-fg bg-black/50 rounded-full px-4 py-2 z-10"
            aria-live="polite"
            aria-atomic="true"
          >
            {currentIndex + 1} / {PORTFOLIO_IMAGES.length}
          </div>

          {/* Image container */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getImagePath(selectedImage)}
              alt={`Full size ${formatImageName(selectedImage)}`}
              width={1920}
              height={1080}
              className="object-contain max-w-full max-h-[90vh] w-auto h-auto"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
