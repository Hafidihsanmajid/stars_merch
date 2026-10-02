'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Package, 
  Camera, 
  Plus, 
  Trash2, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Layers,
  Info
} from 'lucide-react';
import { 
  Category, 
  StoreProductPayload, 
  StoreProductImagePayload, 
  StoreProductVariantPayload 
} from '@/types/api';
import { api, ApiClientError } from '@/lib/api';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { formatRupiah } from '@/lib/utils';
import VariantMatrixBuilder from './VariantMatrixBuilder';

// Preset sample image sets for rapid testing
const IMAGE_PRESETS = [
  {
    label: 'Streetwear Vintage Hoodie',
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan Hoodie',
        is_primary: true,
        sort_order: 0,
      },
      {
        image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b3?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Belakang Hoodie',
        is_primary: false,
        sort_order: 1,
      },
    ],
  },
  {
    label: 'Acid-Wash Heavy Tee',
    images: [
      {
        image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Tampak Depan Acid Wash',
        is_primary: true,
        sort_order: 0,
      },
      {
        image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        alt_text: 'Detail Sablon Belakang',
        is_primary: false,
        sort_order: 1,
      },
    ],
  },
];

export default function CreateProductForm() {
  const router = useRouter();
  const { token } = useAdminAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [basePrice, setBasePrice] = useState<number>(229000);
  const [description, setDescription] = useState(
    '100% 24s Heavyweight Cotton (240 GSM). Potongan boxy-oversized dengan washed vintage finishing, jahitan rantai ganda, dan sablon plastisol premium tahan lama.'
  );
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Images state
  const [images, setImages] = useState<StoreProductImagePayload[]>([
    {
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Foto Produk Utama',
      is_primary: true,
      sort_order: 0,
    },
  ]);

  // Variants state
  const [variants, setVariants] = useState<StoreProductVariantPayload[]>([
    {
      size: 'S',
      color_name: 'Cosmic Black',
      color_hex: '#1E1E24',
      sku: 'STM-NEW-BLK-S',
      additional_price: 0,
      stock_quantity: 20,
    },
    {
      size: 'M',
      color_name: 'Cosmic Black',
      color_hex: '#1E1E24',
      sku: 'STM-NEW-BLK-M',
      additional_price: 0,
      stock_quantity: 30,
    },
    {
      size: 'L',
      color_name: 'Cosmic Black',
      color_hex: '#1E1E24',
      sku: 'STM-NEW-BLK-L',
      additional_price: 0,
      stock_quantity: 25,
    },
    {
      size: 'XL',
      color_name: 'Cosmic Black',
      color_hex: '#1E1E24',
      sku: 'STM-NEW-BLK-XL',
      additional_price: 10000,
      stock_quantity: 15,
    },
  ]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCategories();
        if (res.success && res.data?.length) {
          setCategories(res.data);
          setCategoryId(res.data[0].id);
        }
      } catch {
        // Fallback default category
        setCategoryId(1);
      }
    }
    loadCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  // Image actions
  const handleAddImage = () => {
    setImages([
      ...images,
      {
        image_url: '',
        alt_text: name ? `${name} Galeri` : 'Foto Produk',
        is_primary: images.length === 0,
        sort_order: images.length,
      },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If the removed image was primary, mark the first one as primary
    if (images[index].is_primary && updated.length > 0) {
      updated[0].is_primary = true;
    }
    setImages(updated);
  };

  const handleSetPrimaryImage = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    setImages(updated);
  };

  const handleImageFieldChange = (index: number, field: keyof StoreProductImagePayload, value: string) => {
    const updated = [...images];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setImages(updated);
  };

  const handleApplyImagePreset = (presetImages: StoreProductImagePayload[]) => {
    setImages(presetImages);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorDetails(null);
    setSuccessMessage(null);

    // Client-side Validations
    if (!name.trim()) {
      setErrorMessage('Nama produk wajib diisi.');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Kategori produk wajib dipilih.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Deskripsi produk wajib diisi.');
      return;
    }

    if (basePrice <= 0) {
      setErrorMessage('Harga dasar produk harus lebih dari 0.');
      return;
    }

    if (images.length === 0 || !images[0].image_url.trim()) {
      setErrorMessage('Minimal satu foto galeri produk harus disertakan.');
      return;
    }

    if (variants.length === 0) {
      setErrorMessage('Minimal satu varian pakaian (ukuran & warna) harus dibuat.');
      return;
    }

    // SKU Duplication Check
    const skuList = variants.map((v) => v.sku.trim().toUpperCase());
    const duplicates = skuList.filter((item, index) => skuList.indexOf(item) !== index);
    if (duplicates.length > 0) {
      setErrorMessage(`Terdapat kode SKU kembar: '${duplicates[0]}'. Setiap varian wajib memiliki SKU unik.`);
      return;
    }

    // Construct Payload
    const payload: StoreProductPayload = {
      category_id: Number(categoryId),
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      base_price: Number(basePrice),
      is_featured: isFeatured,
      is_active: isActive,
      images: images.map((img, i) => ({
        image_url: img.image_url.trim(),
        alt_text: img.alt_text?.trim() || name.trim(),
        is_primary: Boolean(img.is_primary),
        sort_order: i,
      })),
      variants: variants.map((v) => ({
        size: v.size.trim().toUpperCase(),
        color_name: v.color_name.trim(),
        color_hex: v.color_hex.trim(),
        sku: v.sku.trim().toUpperCase(),
        additional_price: Number(v.additional_price) || 0,
        stock_quantity: Number(v.stock_quantity) || 0,
      })),
    };

    setSubmitting(true);
    try {
      const res = await api.admin.createProduct(payload, token || undefined);
      if (res.success && res.data) {
        setSuccessMessage(
          `Produk '${res.data.name}' berhasil ditambahkan ke inventaris dengan ${res.data.variants_count} varian (Total Stok: ${res.data.total_stock} pcs)!`
        );
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
        if (err.details) {
          setErrorDetails(err.details);
        }
      } else {
        setErrorMessage('Terjadi kesalahan saat memproses penyimpanan produk baru.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Back Navigation Bar */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Inventaris Produk</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3" /> New Streetwear Drop
          </span>
          <span className="text-zinc-500 text-xs">•</span>
          <span className="text-xs text-zinc-400">Atomic Transaction Guard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Tambah Produk Pakaian Baru
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Daftarkan koleksi pakaian baru dengan foto galeri dan matriks varian fisik (ukuran & warna).
        </p>
      </div>

      {/* Notification Banners */}
      {errorMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-rose-100">{errorMessage}</div>
            {errorDetails && (
              <ul className="list-disc list-inside mt-2 space-y-0.5 text-rose-300">
                {Object.entries(errorDetails).map(([key, msgs]) => (
                  <li key={key}>
                    <span className="font-mono">{key}</span>: {msgs.join(', ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="font-bold text-sm text-emerald-100">{successMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* SECTION 1: MASTER PRODUCT INFORMATION */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
            <Package className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-tight">
              1. Informasi Master Pakaian
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label htmlFor="prod-name" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Nama Produk Pakaian <span className="text-rose-400">*</span>
              </label>
              <input
                id="prod-name"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Stars Cyberpunk Acid Hoodie"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              {slug && (
                <div className="mt-1.5 text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                  <span>URL Slug:</span>
                  <span className="text-zinc-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    /product/{slug}
                  </span>
                </div>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="prod-cat" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Kategori Pakaian <span className="text-rose-400">*</span>
              </label>
              <select
                id="prod-cat"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-500"
              >
                <option value="" disabled>Pilih Kategori...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label htmlFor="prod-price" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Harga Dasar (IDR) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                  Rp
                </span>
                <input
                  id="prod-price"
                  type="number"
                  min={0}
                  step={1000}
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="229000"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>
              <span className="mt-1 text-[11px] text-zinc-500 block">
                Format: <strong className="text-zinc-300">{formatRupiah(basePrice)}</strong>
              </span>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="prod-desc" className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Deskripsi & Spesifikasi Bahan <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="prod-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rincian material katun, GSM, fitting boxy/oversized, petunjuk perawatan cuci..."
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Toggles: Active & Featured */}
            <div className="md:col-span-2 flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-white">Publikasikan Langsung (Active)</span>
                  <span className="text-[11px] text-zinc-500">Produk langsung dapat dicari di katalog publik</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-zinc-900"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase text-white">Sorot di Beranda (Featured)</span>
                  <span className="text-[11px] text-zinc-500">Tampilkan di Showcase Produk Pilihan Beranda</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCT IMAGE GALLERY */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-tight">
                  2. Galeri Foto Produk ({images.length} Foto)
                </h2>
                <span className="text-xs text-zinc-400">
                  Minimal 1 foto wajib diisi. Tandai bintang pada foto yang menjadi gambar utama (thumbnail etalase).
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Preset Foto:</span>
              {IMAGE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyImagePreset(p.images)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center gap-4"
              >
                {/* Thumbnail Preview */}
                <div className="relative w-16 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-700">
                  {img.image_url ? (
                    <Image
                      src={img.image_url}
                      alt={img.alt_text || 'Preview'}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px] text-center p-1">
                      No Image
                    </div>
                  )}
                </div>

                {/* URL and Alt Inputs */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                      URL Gambar Foto
                    </label>
                    <input
                      type="url"
                      required
                      value={img.image_url}
                      onChange={(e) => handleImageFieldChange(index, 'image_url', e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                      Teks Alt (SEO & Aksesibilitas)
                    </label>
                    <input
                      type="text"
                      value={img.alt_text || ''}
                      onChange={(e) => handleImageFieldChange(index, 'alt_text', e.target.value)}
                      placeholder="Tampak Depan Baju"
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                {/* Primary Toggle & Remove */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(index)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      img.is_primary
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/80 shadow-sm'
                        : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
                    }`}
                    title={img.is_primary ? 'Gambar Utama Terpilih' : 'Jadikan Gambar Utama'}
                  >
                    <Star className={`w-3.5 h-3.5 ${img.is_primary ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{img.is_primary ? 'Utama' : 'Set Utama'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={images.length <= 1}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Hapus foto ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddImage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Foto Galeri Baru</span>
          </button>
        </div>

        {/* SECTION 3: VISUAL VARIANT MATRIX BUILDER */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
          <VariantMatrixBuilder
            productSlug={slug}
            variants={variants}
            onChange={setVariants}
          />
        </div>

        {/* SUBMIT BUTTON BAR */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block uppercase">Ringkasan Drop Baru</span>
              <span className="text-[11px] text-zinc-400">
                {variants.length} Varian SKU • {images.length} Foto • Stok Fisik Total:{' '}
                <strong className="text-emerald-400">
                  {variants.reduce((acc, v) => acc + (Number(v.stock_quantity) || 0), 0)} pcs
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/admin/products"
              className="flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-white/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Simpan & Terbitkan Produk</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
