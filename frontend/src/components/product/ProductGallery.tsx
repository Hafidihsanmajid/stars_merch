'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/api';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  isFeatured?: boolean;
}

export default function ProductGallery({
  images,
  productName,
  isFeatured,
}: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Safe fallback if images array is empty
  const activeImage = images[activeImageIndex] || {
    id: 0,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    alt_text: productName,
    is_primary: true,
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6 sticky top-24">
      {/* Thumbnail Selector List */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-none">
          {images.map((img, idx) => {
            const isActive = idx === activeImageIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-zinc-950 dark:border-white shadow-md scale-[1.02]'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100 hover:border-zinc-400'
                }`}
                aria-label={`Lihat gambar ${idx + 1}`}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main High-Resolution Image */}
      <div className="relative flex-1 aspect-4/5 w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <Image
          src={activeImage.image_url}
          alt={activeImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isFeatured && (
            <span className="px-3 py-1 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-black uppercase tracking-wider shadow-lg">
              FEATURED
            </span>
          )}
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider shadow">
            100% 24S HEAVY COTTON
          </span>
        </div>

        {/* Counter indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-semibold">
            {activeImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
