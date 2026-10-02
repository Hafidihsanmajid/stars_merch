'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AdminProductItem, Category } from '@/types/api';
import { api, ApiClientError } from '@/lib/api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { formatRupiah } from '@/lib/utils';

export default function AdminProductsView() {
  const { token, user } = useAdminAuthStore();

  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch Categories for filter dropdown
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch {
        // ignore
      }
    }
    loadCategories();
  }, []);

  // Fetch Products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.getProducts(
        {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: search.trim() ? search.trim() : undefined,
          sort,
          page: currentPage,
          per_page: 10,
        },
        token || undefined
      );

      if (res.success && res.data) {
        setProducts(res.data);
        if (res.meta) {
          setTotalPages(res.meta.total_pages || 1);
          setTotalCount(res.meta.total || res.data.length);
        } else {
          setTotalPages(1);
          setTotalCount(res.data.length);
        }
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Gagal memuat inventaris produk.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, selectedCategory, selectedStatus, search, sort, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Aggregate stats
  const totalStockSum = products.reduce((acc, p) => acc + (p.total_stock || 0), 0);
  const activeCount = products.filter((p) => p.is_active).length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3" /> Admin Workspace
            </span>
            <span className="text-zinc-500 text-xs">•</span>
            <span className="text-xs text-zinc-400">Halo, {user?.name || 'Administrator'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Katalog & Inventaris Produk
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Kelola master pakaian streetwear, kontrol sisa stok fisik per SKU, dan terbitkan koleksi baru.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850 text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Produk</span>
            <Package className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <span className="text-[10px] text-zinc-500">Item terdaftar di database</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Stok Fisik Halaman</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{totalStockSum} pcs</div>
          <span className="text-[10px] text-zinc-500">Akumulasi seluruh varian</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Status Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeCount}</div>
          <span className="text-[10px] text-zinc-500">Tayang di etalase publik</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kategori Master</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{categories.length || 4}</div>
          <span className="text-[10px] text-zinc-500">Oversized, Hoodie, Pants, dll</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari berdasarkan nama produk, deskripsi, atau SKU..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active (Tayang)</option>
            <option value="draft">Draft (Disembunyikan)</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="price_asc">Harga: Terendah</option>
              <option value="price_desc">Harga: Tertinggi</option>
              <option value="name_asc">Nama: A - Z</option>
              <option value="name_desc">Nama: Z - A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Table Container */}
      <div className="mt-6 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] uppercase tracking-wider text-zinc-400 font-bold">
                <th className="py-3.5 px-4">Produk Pakaian</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Dasar</th>
                <th className="py-3.5 px-4">Total Stok</th>
                <th className="py-3.5 px-4">Varian & Media</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {loading ? (
                // Skeleton loading rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-zinc-800 rounded-lg shrink-0" />
                        <div className="space-y-2">
                          <div className="h-3 w-40 bg-zinc-800 rounded" />
                          <div className="h-2 w-24 bg-zinc-850 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><div className="h-3 w-20 bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-24 bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-16 bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-20 bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-16 bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-3 w-12 bg-zinc-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <Package className="w-10 h-10 text-zinc-600 mb-3" />
                      <h4 className="text-sm font-bold text-white uppercase">Tidak ada produk ditemukan</h4>
                      <p className="text-xs text-zinc-400 mt-1 mb-4">
                        Tidak ada pakaian yang sesuai dengan kata kunci pencarian atau filter yang dipilih.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          setSelectedCategory('all');
                          setSelectedStatus('all');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const stock = product.total_stock || 0;
                  const isLowStock = stock > 0 && stock <= 15;
                  const isSoldOut = stock === 0;

                  return (
                    <tr 
                      key={product.id} 
                      className="hover:bg-zinc-850/50 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                            {product.primary_image ? (
                              <Image
                                src={product.primary_image}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-emerald-400 transition-colors block leading-tight">
                              {product.name}
                            </span>
                            <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                          {product.category?.name || 'Streetwear'}
                        </span>
                      </td>

                      {/* Base Price */}
                      <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                        {formatRupiah(product.base_price)}
                      </td>

                      {/* Total Stock Physical */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isSoldOut
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                              : isLowStock
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSoldOut ? 'bg-rose-400' : isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                          {stock} pcs
                          {isSoldOut && ' (Habis)'}
                        </span>
                      </td>

                      {/* Variants & Images Counts */}
                      <td className="py-3 px-4 text-zinc-400 text-[11px]">
                        <div>{product.variants_count || 1} Varian SKU</div>
                        <div className="text-zinc-500 text-[10px]">{product.images_count || 1} Foto Galeri</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              product.is_active
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800/60'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Draft'}
                          </span>
                          {product.is_featured && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[9px] font-bold uppercase">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors"
                            title="Buka halaman etalase pembeli"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Lihat Toko</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="py-3 px-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/40">
          <div>
            Menampilkan halaman <strong className="text-white">{currentPage}</strong> dari{' '}
            <strong className="text-white">{totalPages}</strong> (Total {totalCount} produk)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
