'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Ruler, 
  Plus, 
  Minus, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProductDetail, ProductVariant } from '@/types/api';
import { formatRupiah } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useSizeChartStore } from '@/store/useSizeChartStore';

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addItem, openDrawer } = useCartStore();
  const { open: openSizeChart } = useSizeChartStore();

  // Extract unique colors available across all variants
  const uniqueColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    product.variants.forEach((v) => {
      if (!map.has(v.color_name)) {
        map.set(v.color_name, { name: v.color_name, hex: v.color_hex });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  // Selected Color state (default to first color)
  const [selectedColor, setSelectedColor] = useState<string>(
    uniqueColors[0]?.name || product.variants[0]?.color_name || ''
  );

  // Available sizes for the currently selected color
  const variantsForColor = useMemo(() => {
    return product.variants.filter((v) => v.color_name === selectedColor);
  }, [product.variants, selectedColor]);

  // Extract unique sizes sorted
  const uniqueSizes = useMemo(() => {
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', 'OS'];
    const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
    return sizes.sort((a, b) => {
      const idxA = sizeOrder.indexOf(a);
      const idxB = sizeOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
  }, [product.variants]);

  // Selected Size state (default to first available size with stock, or first size)
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    const firstInStock = variantsForColor.find((v) => v.stock > 0);
    return firstInStock ? firstInStock.size : variantsForColor[0]?.size || uniqueSizes[0] || 'L';
  });

  // Quantity state
  const [quantity, setQuantity] = useState<number>(1);

  // Accordion toggle states
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  // Currently matched variant object based on selected color and size
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    return variantsForColor.find((v) => v.size === selectedSize);
  }, [variantsForColor, selectedSize]);

  // Calculated dynamic price
  const currentPrice = useMemo(() => {
    if (activeVariant) {
      return activeVariant.price;
    }
    return product.base_price;
  }, [activeVariant, product.base_price]);

  // Stock status
  const currentStock = activeVariant?.stock ?? 0;
  const isOutOfStock = currentStock === 0;

  // Handle color change: update color and ensure selected size is valid
  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const newVariants = product.variants.filter((v) => v.color_name === colorName);
    // If current selected size is out of stock in new color, prefer an in-stock size
    const currentSizeVariant = newVariants.find((v) => v.size === selectedSize);
    if (!currentSizeVariant || currentSizeVariant.stock === 0) {
      const inStock = newVariants.find((v) => v.stock > 0);
      if (inStock) {
        setSelectedSize(inStock.size);
      }
    }
    setQuantity(1);
  };

  // Handle size change
  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  // Quantity adjustments
  const handleIncreaseQty = () => {
    if (quantity < currentStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Primary image
  const primaryImage = product.images.find((img) => img.is_primary)?.image_url || product.images[0]?.image_url || '';

  // Add to Cart action (FR-3.5)
  const handleAddToCart = () => {
    if (!activeVariant || isOutOfStock) return;

    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      name: product.name,
      size: activeVariant.size,
      color: activeVariant.color_name,
      colorHex: activeVariant.color_hex,
      price: currentPrice,
      quantity,
      image: primaryImage,
      maxStock: activeVariant.stock,
    });

    openDrawer();
  };

  // Buy Now action
  const handleBuyNow = () => {
    if (!activeVariant || isOutOfStock) return;

    addItem({
      variantId: activeVariant.id,
      productId: product.id,
      name: product.name,
      size: activeVariant.size,
      color: activeVariant.color_name,
      colorHex: activeVariant.color_hex,
      price: currentPrice,
      quantity,
      image: primaryImage,
      maxStock: activeVariant.stock,
    });

    router.push('/checkout');
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Breadcrumb & Category */}
      <div>
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
          <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">Beranda</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-zinc-900 dark:hover:text-white">Katalog</Link>
          <span>/</span>
          <Link 
            href={`/catalog?category=${product.category.slug}`}
            className="hover:text-zinc-900 dark:hover:text-white"
          >
            {product.category.name}
          </Link>
        </nav>

        {/* Product Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 dark:text-white uppercase tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Dynamic Price Display */}
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
            {formatRupiah(currentPrice)}
          </span>
          {activeVariant?.additional_price ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              (+{formatRupiah(activeVariant.additional_price)} untuk varian {activeVariant.size})
            </span>
          ) : null}
        </div>
      </div>

      <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* FR-3.3: Color Variant Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            PILIHAN WARNA: <span className="font-semibold text-zinc-600 dark:text-zinc-400 normal-case">{selectedColor}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {uniqueColors.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorChange(color.name)}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border border-black/20 dark:border-white/20 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="truncate">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FR-3.2: Size Variant Selection with Out-of-Stock Strikethrough */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            PILIHAN UKURAN (SIZE): <span className="font-semibold text-zinc-600 dark:text-zinc-400">{selectedSize}</span>
          </span>

          {/* Size Chart Trigger (PRD FR-1.4) */}
          <button
            type="button"
            onClick={openSizeChart}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:underline cursor-pointer"
          >
            <Ruler className="h-3.5 w-3.5" />
            <span>Panduan Ukuran</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
          {uniqueSizes.map((size) => {
            const variantForSize = variantsForColor.find((v) => v.size === size);
            const sizeStock = variantForSize?.stock ?? 0;
            const isSizeSoldOut = sizeStock === 0;
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                disabled={isSizeSoldOut}
                onClick={() => handleSizeChange(size)}
                title={isSizeSoldOut ? `Ukuran ${size} habis untuk warna ${selectedColor}` : `Pilih ukuran ${size}`}
                className={`relative h-12 rounded-xl text-sm font-bold uppercase transition-all flex items-center justify-center cursor-pointer ${
                  isSizeSoldOut
                    ? 'border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-2 ring-zinc-950 dark:ring-white'
                    : 'border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <span>{size}</span>

                {/* Strikethrough line for sold out sizes (FR-3.2) */}
                {isSizeSoldOut && (
                  <span className="absolute inset-x-2 h-0.5 bg-red-400/80 -rotate-12 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FR-3.4: Dynamic Stock Indicator */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-bold">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Stok Habis untuk kombinasi ini</span>
          </div>
        ) : currentStock <= 5 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Tersisa {currentStock} pcs — Segera amankan pesanan!</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Stok Tersedia ({currentStock} pcs)</span>
          </div>
        )}
      </div>

      {/* FR-3.5: Quantity Selector & Action Buttons */}
      <div className="space-y-4 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            JUMLAH:
          </span>
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 p-1">
            <button
              type="button"
              onClick={handleDecreaseQty}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Kurangi jumlah"
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 text-sm font-bold min-w-10 text-center text-zinc-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncreaseQty}
              disabled={quantity >= currentStock || isOutOfStock}
              aria-label="Tambah jumlah"
              className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Add to Cart */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Tambah ke Keranjang</span>
          </button>

          {/* Buy Now */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 border-zinc-950 dark:border-white text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 font-extrabold text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
          >
            <span>Beli Sekarang</span>
          </button>
        </div>
      </div>

      {/* Assurance Badges */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
        <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <Truck className="h-4 w-4 text-zinc-600 dark:text-zinc-300 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Kirim 24 Jam</span>
          <span className="text-[10px] text-zinc-500">Se-Indonesia</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <RotateCcw className="h-4 w-4 text-zinc-600 dark:text-zinc-300 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white">Retur 7 Hari</span>
          <span className="text-[10px] text-zinc-500">Garansi Ukuran</span>
        </div>
        <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
          <ShieldCheck className="h-4 w-4 text-zinc-600 dark:text-zinc-300 mb-1" />
          <span className="text-[11px] font-bold text-zinc-900 dark:text-white">100% Original</span>
          <span className="text-[10px] text-zinc-500">Authentic Brand</span>
        </div>
      </div>

      {/* Accordions: Specs, Care Instructions, Delivery */}
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-t border-zinc-200 dark:border-zinc-800 pt-4">
        {/* Description & Specs */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider"
          >
            <span>Deskripsi & Spesifikasi Produk</span>
            {openAccordion === 'specs' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openAccordion === 'specs' && (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 space-y-3 leading-relaxed">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Material: 100% 24s Heavyweight Combed Cotton (240 GSM).</li>
                <li>Fit: Signature Boxy-Oversized dengan Drop Shoulder.</li>
                <li>Rib Leher: 3 cm Rib tebal elastis anti-kendur.</li>
                <li>Jahitan: Rantai ganda bahu dan kelim jarum dobel (twin-needle).</li>
                <li>Aplikasi Grafis: Sablon High-Density Plastisol Discharge awet dicuci.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Care Instructions */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider"
          >
            <span>Petunjuk Perawatan (Care Guide)</span>
            {openAccordion === 'care' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openAccordion === 'care' && (
            <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
              <p>• Cuci menggunakan air dingin dengan deterjen lembut.</p>
              <p>• Balik pakaian saat dicuci dan disetrika (bagian dalam di luar).</p>
              <p>• Jangan menyetrika langsung di atas sablon grafis.</p>
              <p>• Hindari penggunaan pemutih pakaian keras.</p>
              <p>• Jemur di tempat teduh terhindar dari sinar matahari langsung.</p>
            </div>
          )}
        </div>

        {/* Shipping & Return Policy */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
            className="w-full flex items-center justify-between text-left text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider"
          >
            <span>Pengiriman & Garansi Tukar Ukuran</span>
            {openAccordion === 'shipping' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openAccordion === 'shipping' && (
            <div className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
              <p>• Pesanan sebelum pukul 15.00 WIB dikirim pada hari yang sama.</p>
              <p>• Gratis ongkir untuk pesanan minimum Rp300.000 menggunakan kupon STARS2026.</p>
              <p>• Garansi tukar ukuran 7 hari sejak produk diterima dalam keadaan label utuh dan belum dicuci.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
