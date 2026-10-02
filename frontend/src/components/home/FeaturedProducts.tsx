'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { ProductListItem } from '@/types/api';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

// Fallback curated products matching PRD & ARCHITECTURE.md specs
const FALLBACK_FEATURED_PRODUCTS: ProductListItem[] = [
  {
    id: 10,
    name: 'Stars Cosmic Heavy Tee',
    slug: 'stars-cosmic-heavy-tee',
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    base_price: 199000,
    primary_image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Cosmic Black', hex: '#1E1E24' },
      { name: 'Washed Grey', hex: '#707070' },
    ],
    total_stock: 45,
    is_featured: true,
  },
  {
    id: 11,
    name: 'Stars Acid-Wash Vintage Tee',
    slug: 'stars-acid-wash-vintage-tee',
    category: {
      id: 1,
      name: 'Oversized T-Shirts',
      slug: 'oversized-tees',
    },
    base_price: 189000,
    primary_image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    available_sizes: ['M', 'L', 'XL', 'XXL'],
    available_colors: [
      { name: 'Vintage Charcoal', hex: '#2F3542' },
      { name: 'Sand Beige', hex: '#E5D3B3' },
    ],
    total_stock: 32,
    is_featured: true,
  },
  {
    id: 12,
    name: 'Stars Cyber Heavy Hoodie',
    slug: 'stars-cyber-heavy-hoodie',
    category: {
      id: 2,
      name: 'Hoodies & Sweaters',
      slug: 'hoodies-sweaters',
    },
    base_price: 349000,
    primary_image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    available_sizes: ['S', 'M', 'L', 'XL'],
    available_colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Heather Smoke', hex: '#555555' },
    ],
    total_stock: 20,
    is_featured: true,
  },
  {
    id: 13,
    name: 'Stars Modular Tactical Cargo',
    slug: 'stars-modular-tactical-cargo',
    category: {
      id: 3,
      name: 'Pants & Cargo',
      slug: 'pants',
    },
    base_price: 299000,
    primary_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
    available_sizes: ['28', '30', '32', '34'],
    available_colors: [
      { name: 'Olive Drab', hex: '#3B4D3C' },
      { name: 'Onyx Black', hex: '#1B1B1B' },
    ],
    total_stock: 18,
    is_featured: true,
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductListItem[]>(FALLBACK_FEATURED_PRODUCTS);
  const [, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const res = await api.getFeaturedProducts();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch {
        // Fallback to rich preconfigured products if API endpoint is not yet connected
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickAdd = (product: ProductListItem) => {
    // Add default variant for quick add
    addItem({
      variantId: product.id * 10,
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
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              LIMITED DROP SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-2">
              FEATURED DROPS
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl">
              Produk terlaris dengan kualitas material dan jahitan terbaik, siap kirim ke seluruh Indonesia.
            </p>
          </div>

          <Link
            href="/catalog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:underline group"
          >
            Lihat Semua Produk
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={product.primary_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-black uppercase tracking-wider shadow">
                    FEATURED
                  </span>
                  {product.total_stock < 25 && (
                    <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                      LOW STOCK
                    </span>
                  )}
                </div>

                {/* Quick Action Floating Overlay */}
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-xs font-bold text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Detail</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    title="Quick Add to Cart"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                    className="p-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow cursor-pointer"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  {product.category.name}
                </span>

                <Link
                  href={`/product/${product.slug}`}
                  className="font-bold text-base text-zinc-950 dark:text-white hover:underline line-clamp-1 mb-2"
                >
                  {product.name}
                </Link>

                {/* Color Swatches and Sizes */}
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    {product.available_colors.map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        className="h-3.5 w-3.5 rounded-full border border-black/20 dark:border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  {/* Sizes */}
                  <span className="text-[11px] font-mono font-medium text-zinc-400">
                    {product.available_sizes.join(' · ')}
                  </span>
                </div>

                {/* Price and Action */}
                <div className="mt-auto pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block -mb-0.5">Harga</span>
                    <span className="text-base font-extrabold text-zinc-950 dark:text-white">
                      {formatRupiah(product.base_price)}
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="text-xs font-bold uppercase text-zinc-900 dark:text-white hover:underline flex items-center gap-1"
                  >
                    Beli Sekarang
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
