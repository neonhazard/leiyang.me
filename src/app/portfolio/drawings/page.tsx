"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Masthead from "@/components/Masthead";

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

const formatImageName = (imageName: string): string =>
  imageName.replace(/_/g, " ").replace(/\.jpg$/i, "");

const getImagePath = (imageName: string): string =>
  `/images/portfolio/${imageName}`;

export default function Drawings() {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const isModalOpen = currentIndex >= 0;
  const selectedImage = isModalOpen ? PORTFOLIO_IMAGES[currentIndex] : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = isModalOpen ? "hidden" : "unset";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [isModalOpen]);

  const openModal = (imageName: string) => {
    const index = PORTFOLIO_IMAGES.indexOf(imageName);
    if (index >= 0) setCurrentIndex(index);
  };

  const closeModal = () => setCurrentIndex(-1);

  const goToPrevious = () =>
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : PORTFOLIO_IMAGES.length - 1);

  const goToNext = () =>
    setCurrentIndex(currentIndex < PORTFOLIO_IMAGES.length - 1 ? currentIndex + 1 : 0);

  return (
    <div className="min-h-screen bg-page">
      <Masthead />

      <main className="shell py-16">
        <div className="mb-8">
          <Link
            href="/#work"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
              transition: "letter-spacing .2s",
            }}
          >
            ← Back to My Work
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-bricolage), sans-serif",
              fontWeight: 600,
              fontVariationSettings: '"opsz" 72',
              fontSize: "clamp(40px, 6vw, 88px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              margin: "0 0 16px",
              color: "var(--fg)",
            }}
          >
            2D <span style={{ fontFamily: "var(--font-bodoni), serif", fontStyle: "italic", color: "var(--accent)" }}>Art</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 18, fontWeight: 300 }}>
            Life drawings, still life, and animal studies
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          style={{
            borderTop: "1px solid var(--rule)",
            borderLeft: "1px solid var(--rule)",
          }}
        >
          {PORTFOLIO_IMAGES.map((image, index) => (
            <div
              key={image}
              className="group cursor-pointer transition-colors duration-300"
              style={{
                borderRight: "1px solid var(--rule)",
                borderBottom: "1px solid var(--rule)",
              }}
              onClick={() => openModal(image)}
            >
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/3", background: "var(--elevated)" }}
              >
                <Image
                  src={getImagePath(image)}
                  alt={`${formatImageName(image)} - Drawing ${index + 1}`}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div style={{ padding: "12px 16px 16px" }}>
                <p
                  className="capitalize"
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--muted-2)",
                  }}
                >
                  {formatImageName(image)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <Link href="/#work" className="btn">
            ← Back to My Work
          </Link>
        </div>
      </main>

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0 0 0 / .92)", backdropFilter: "blur(8px)" }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery modal"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 flex items-center justify-center"
            style={{
              width: 44, height: 44,
              border: "1px solid var(--rule)",
              color: "var(--fg)",
              background: "oklch(0 0 0 / .5)",
              fontSize: 24,
              transition: "border-color .2s, color .2s",
            }}
            aria-label="Close modal"
          >
            ×
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
            style={{
              width: 44, height: 44,
              border: "1px solid var(--rule)",
              color: "var(--fg)",
              background: "oklch(0 0 0 / .5)",
              fontSize: 20,
              transition: "border-color .2s, color .2s",
            }}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
            style={{
              width: 44, height: 44,
              border: "1px solid var(--rule)",
              color: "var(--fg)",
              background: "oklch(0 0 0 / .5)",
              fontSize: 20,
              transition: "border-color .2s, color .2s",
            }}
            aria-label="Next image"
          >
            →
          </button>

          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2"
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--muted)",
              background: "oklch(0 0 0 / .5)",
              border: "1px solid var(--rule)",
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            {currentIndex + 1} / {PORTFOLIO_IMAGES.length}
          </div>

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
