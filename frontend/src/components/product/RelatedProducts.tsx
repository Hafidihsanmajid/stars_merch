'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { ProductListItem } from '@/types/api';
import { formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

interface RelatedProductsProps {
  products: ProductListItem[];
  currentProductId: number;
}

export default function RelatedProducts({
  products,
  currentProductId,
}: RelatedProductsProps) {
  const { addItem } = useCartStore();

  const related = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  const handleQuickAdd = (product: ProductListItem) => {
    addItem({
      variantId: product.id * 100 + 1,
      productId: product.id,
      name: product.name,
      size: product.available_sizes[0] || 'L',
      color: product.available_colors[0]?.name || 'Standard',
      colorHex: product.available_colors[0]?.hex || '#000000',
      price: product.base_price,
      quantity: 1,
      image: product.primary_image,
      maxStock: product.total_stock,
    });
  };

  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            LENGKAPI GAYA ANDA
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-1">
            PRODUK TERKAIT
          </h2>
        </div>

        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:underline group"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image Frame */}
            <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={item.primary_image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <Link
                  href={`/product/${item.slug}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-[11px] font-bold text-zinc-900 dark:text-white shadow hover:bg-white dark:hover:bg-zinc-900"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Detail</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleQuickAdd(item)}
                  title="Quick Add to Cart"
                  aria-label={`Tambah ${item.name} ke keranjang`}
                  className="p-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-3.5 sm:p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 truncate">
                {item.category.name}
              </span>
              <Link
                href={`/product/${item.slug}`}
                className="font-bold text-xs sm:text-sm text-zinc-950 dark:text-white hover:underline line-clamp-1 mb-2"
              >
                {item.name}
              </Link>
              <div className="mt-auto flex items-center justify-between text-xs pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                <span className="font-extrabold text-zinc-950 dark:text-white">
                  {formatRupiah(item.base_price)}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {item.available_sizes.join(' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
