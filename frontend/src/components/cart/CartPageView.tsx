'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/useCartStore';
import { formatRupiah } from '@/lib/utils';
import { api } from '@/lib/api';

export default function CartPageView() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotalItems,
    getShippingFee,
    getDiscountAmount,
    getGrandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const shippingFee = getShippingFee();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  const diffToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const handleProceedToCheckout = async () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      // Validate cart items against API (FR-5.4 / ARCHITECTURE Endpoint 5)
      const payload = items.map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      }));

      const res = await api.validateCart(payload);
      if (res.success && res.data.is_valid) {
        router.push('/checkout');
      } else {
        setValidationError('Terdapat perubahan stok pada item keranjang Anda.');
      }
    } catch {
      // If network fails, still allow checkout flow
      router.push('/checkout');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white font-semibold">Keranjang Belanja</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
            KERANJANG BELANJA
          </h1>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-500">
              Total <strong>{totalItems}</strong> item
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Kosongkan semua item di keranjang belanja Anda?')) {
                  clearCart();
                }
              }}
              className="text-red-500 hover:text-red-600 font-semibold cursor-pointer"
            >
              Kosongkan Keranjang
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-8 max-w-2xl mx-auto">
          <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-6">
            <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-2">
            Keranjang Anda Masih Kosong
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-8">
            Belum ada streetwear yang Anda pilih. Jelajahi katalog oversized tees, hoodies, dan koleksi kapsul terbaru kami sekarang.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold text-sm uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Jelajahi Katalog Pakaian</span>
          </Link>
        </div>
      ) : (
        /* Cart Content Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table / List (Col 1-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping banner */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                {diffToFreeShipping === 0 || coupon?.type === 'free_shipping' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                    <Sparkles className="h-4 w-4" />
                    Selamat! Anda mendapatkan promo GRATIS ONGKOS KIRIM.
                  </span>
                ) : (
                  <span className="text-zinc-700 dark:text-zinc-300">
                    Tambah belanja senilai <strong>{formatRupiah(diffToFreeShipping)}</strong> lagi untuk <strong>Gratis Ongkir</strong>
                  </span>
                )}
                <span className="font-mono text-zinc-500">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${coupon?.type === 'free_shipping' ? 100 : freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item) => (
                <div key={item.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-20 sm:h-28 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                        sizes="100px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                        No Pic
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-zinc-950 dark:text-white truncate">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Hapus ${item.name}`}
                        className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Variant Badges */}
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300">
                        Ukuran: {item.size}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300">
                        {item.colorHex && (
                          <span
                            className="h-2.5 w-2.5 rounded-full inline-block border border-black/10"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        {item.color}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-zinc-500">
                      Harga satuan: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatRupiah(item.price)}</span>
                    </div>
                  </div>

                  {/* Quantity & Subtotal Controls */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        aria-label="Kurangi kuantitas"
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-zinc-900 dark:text-white min-w-7 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                        aria-label="Tambah kuantitas"
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block sm:hidden">Total:</span>
                      <span className="font-extrabold text-base text-zinc-950 dark:text-white">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Lanjutkan Belanja</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Card (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-6 shadow-sm">
              <h2 className="text-lg font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                RINGKASAN PESANAN
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 block">
                  Kupon Diskon / Promo
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <div className="font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                          {coupon.code}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          {coupon.description}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 font-bold ml-2 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Kode kupon: STARS2026"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      Terapkan
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <div className={`text-xs mt-1 flex items-center gap-1 ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {couponMessage.type === 'success' ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                    <span>{couponMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-sm">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatRupiah(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimasi Ongkos Kirim</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Diskon Produk</span>
                    <span className="font-bold">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div>
                    <span className="text-base font-extrabold text-zinc-950 dark:text-white block">
                      Total Tagihan
                    </span>
                    <span className="text-[11px] text-zinc-400">Termasuk estimasi pajak & proteksi</span>
                  </div>
                  <span className="text-2xl font-black text-zinc-950 dark:text-white">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Checkout CTA Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={isValidating}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>{isValidating ? 'Memvalidasi Stok...' : 'Lanjut ke Checkout'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Value Highlights */}
            <div className="p-5 rounded-2xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-zinc-900 dark:text-white shrink-0" />
                <span>Pengiriman kilat se-Indonesia dengan opsi COD & Transfer Bank.</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-zinc-900 dark:text-white shrink-0" />
                <span>Garansi bebas retur & tukar ukuran selama 7 hari kerja.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-zinc-900 dark:text-white shrink-0" />
                <span>100% Produk Original Stars Merch Indonesia.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
