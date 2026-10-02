'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  ShoppingBag, 
  Eye, 
  PackageSearch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProductListItem, Category } from '@/types/api';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';

export default function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { addItem } = useCartStore();

  // URL state
  const currentCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 1,
  });

  // Sync search input when URL changes
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    loadCategories();
  }, []);

  // Fetch products when params change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadProducts() {
      try {
        const res = await api.getProducts({
          category: currentCategory || undefined,
          search: searchParams.get('search') || undefined,
          sort: currentSort,
          page: currentPage,
          per_page: 12,
        });

        if (isMounted && res.success && res.data) {
          setProducts(res.data);
          if (res.meta) {
            setMeta(res.meta);
          } else {
            setMeta({
              page: currentPage,
              limit: 12,
              total: res.data.length,
              total_pages: 1,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentCategory, searchParams, currentSort, currentPage]);

  // Helper to push URL updates
  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`/catalog?${params.toString()}`);
    });
  };

  // Handlers
  const handleCategorySelect = (categorySlug: string) => {
    updateUrl({
      category: categorySlug === currentCategory ? null : categorySlug,
      page: '1',
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({
      search: searchInput.trim() ? searchInput.trim() : null,
      page: '1',
    });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateUrl({ search: null, page: '1' });
  };

  const handleSortChange = (newSort: string) => {
    updateUrl({ sort: newSort, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    startTransition(() => {
      router.push('/catalog');
    });
  };

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

  // Active category display name
  const activeCategoryObj = useMemo(() => {
    return categories.find(
      (c) => c.slug === currentCategory || (currentCategory === 'pants' && c.slug === 'pants-cargo')
    );
  }, [categories, currentCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Catalog Header Banner */}
      <div className="mb-8 sm:mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              <Link href="/" className="hover:text-zinc-950 dark:hover:text-white">Beranda</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Katalog Pakaian</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : 'SEMUA KOLEKSI PAKAIAN'}
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl">
              Eksplorasi pakaian streetwear premium 100% heavyweight cotton dengan potongan boxy-oversized khas Stars Merch.
            </p>
          </div>

          <div className="text-sm text-zinc-500 font-mono">
            Menampilkan <span className="font-bold text-zinc-900 dark:text-white">{meta.total}</span> produk
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Search, and Sort */}
      <div className="space-y-4 mb-8">
        {/* Category Tabs (Horizontal Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              !currentCategory
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            Semua Produk
          </button>

          {categories.map((cat) => {
            const isSelected =
              currentCategory === cat.slug ||
              (currentCategory === 'pants' && cat.slug === 'pants-cargo');
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar: Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Instant Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md flex items-center"
          >
            <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari kaos, hoodie, celana, dll..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Hapus kata kunci pencarian"
                className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2 border border-zinc-200 dark:border-zinc-700">
              <ArrowUpDown className="h-4 w-4 text-zinc-500 shrink-0" />
              <span className="text-xs text-zinc-500 hidden sm:inline">Urutkan:</span>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white outline-none cursor-pointer pr-2"
                aria-label="Urutkan produk berdasarkan"
              >
                <option value="newest" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  Terbaru (Newest)
                </option>
                <option value="price_asc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  Harga: Termurah
                </option>
                <option value="price_desc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  Harga: Termahal
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {(currentCategory || searchParams.get('search')) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-zinc-400">Filter Aktif:</span>
            {activeCategoryObj && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium">
                Kategori: {activeCategoryObj.name}
                <button
                  type="button"
                  onClick={() => handleCategorySelect('')}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchParams.get('search') && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium">
                Pencarian: &quot;{searchParams.get('search')}&quot;
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="hover:text-red-500 ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline ml-1 cursor-pointer"
            >
              Reset Semua
            </button>
          </div>
        )}
      </div>

      {/* Product Grid Section (FR-2.1) */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 p-4 border border-zinc-200/60 dark:border-zinc-800 animate-pulse space-y-3"
            >
              <div className="aspect-4/5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 px-6">
          <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
            <PackageSearch className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">
            Tidak Ada Pakaian yang Ditemukan
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6">
            Kami tidak menemukan produk yang cocok dengan kriteria pencarian atau filter yang Anda pilih. Silakan gunakan kata kunci lain.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Image Frame */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={product.primary_image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                  {product.is_featured && (
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[9px] font-black uppercase tracking-wider shadow">
                      FEATURED
                    </span>
                  )}
                  {product.total_stock < 25 && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider shadow">
                      LOW STOCK
                    </span>
                  )}
                </div>

                {/* Floating Quick Action Overlay on Desktop */}
                <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 flex items-center gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow"
                  >
                    <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>Detail</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    title="Quick Add to Cart"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                    className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1 truncate">
                  {product.category.name}
                </span>

                <Link
                  href={`/product/${product.slug}`}
                  className="font-bold text-xs sm:text-base text-zinc-950 dark:text-white hover:underline line-clamp-1 mb-1 sm:mb-2"
                >
                  {product.name}
                </Link>

                {/* Color Swatches and Sizes */}
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-zinc-500 mb-3 sm:mb-4">
                  {/* Colors */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {product.available_colors.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        title={c.name}
                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-black/20 dark:border-white/20"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                    {product.available_colors.length > 3 && (
                      <span className="text-[9px] text-zinc-400">+{product.available_colors.length - 3}</span>
                    )}
                  </div>

                  {/* Sizes */}
                  <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-400">
                    {product.available_sizes.join(' · ')}
                  </span>
                </div>

                {/* Price and Action */}
                <div className="mt-auto pt-2.5 sm:pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs text-zinc-400 block -mb-0.5">Harga</span>
                    <span className="text-xs sm:text-base font-extrabold text-zinc-950 dark:text-white">
                      {formatRupiah(product.base_price)}
                    </span>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="text-[10px] sm:text-xs font-bold uppercase text-zinc-900 dark:text-white hover:underline block sm:hidden"
                  >
                    Beli
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta.total_pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1">
            {[...Array(meta.total_pages)].map((_, idx) => {
              const p = idx + 1;
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`h-9 w-9 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={currentPage >= meta.total_pages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
