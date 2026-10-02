import { Suspense } from 'react';
import type { Metadata } from 'next';
import CatalogView from '@/components/catalog/CatalogView';

export const metadata: Metadata = {
  title: 'Katalog Pakaian | Stars Merch',
  description: 'Jelajahi seluruh koleksi streetwear premium: Oversized Tees, Hoodies, Cargo Pants, dan Aksesori berkualitas tinggi.',
};

function CatalogLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-8">
      <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-2xl w-2/3" />
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-28 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-4/5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="flex-1 w-full bg-white dark:bg-zinc-950">
      <Suspense fallback={<CatalogLoadingFallback />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
