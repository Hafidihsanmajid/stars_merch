'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/useCartStore';
import { formatRupiah } from '@/lib/utils';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotalItems,
    getShippingFee,
    getDiscountAmount,
    getGrandTotal,
    coupon,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!mounted) return null;

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const shippingFee = getShippingFee();
  const discountAmount = getDiscountAmount();
  const grandTotal = getGrandTotal();

  // Free shipping progress
  const diffToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div
      aria-hidden={!isDrawerOpen}
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isDrawerOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeDrawer}
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang Belanja"
          className={`w-screen max-w-md transform bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl transition ease-in-out duration-300 flex flex-col ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Keranjang Belanja
                </h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Tutup keranjang"
                className="rounded-lg p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  {diffToFreeShipping === 0 || coupon?.type === 'free_shipping' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <Sparkles className="h-3.5 w-3.5" />
                      🎉 Selamat! Anda berhak Gratis Ongkir!
                    </span>
                  ) : (
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Tambah <strong>{formatRupiah(diffToFreeShipping)}</strong> lagi untuk <strong>Gratis Ongkir</strong>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-zinc-400">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${coupon?.type === 'free_shipping' ? 100 : freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mb-4 text-zinc-400">
                  <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Keranjang Masih Kosong
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                  Anda belum menambahkan item ke keranjang. Jelajahi koleksi streetwear terbaru kami.
                </p>
                <Link
                  href="/catalog"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
                >
                  Mulai Belanja
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((item) => (
                  <li key={`${item.variantId}`} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400">
                          No Pic
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Variant Badges */}
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                            Size: {item.size}
                          </span>
                          <span className="flex items-center gap-1.5 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                            {item.colorHex && (
                              <span
                                className="h-2 w-2 rounded-full inline-block border border-black/10"
                                style={{ backgroundColor: item.colorHex }}
                              />
                            )}
                            {item.color}
                          </span>
                        </div>
                      </div>

                      {/* Price & Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {formatRupiah(item.price * item.quantity)}
                        </span>

                        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Kurangi kuantitas"
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold min-w-6 text-center text-zinc-800 dark:text-zinc-200">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                            aria-label="Tambah kuantitas"
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-6 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Diskon Kupon ({coupon?.code})</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-bold text-zinc-950 dark:text-white pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span>Total Tagihan</span>
                  <span>{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Lanjut ke Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold text-center border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Halaman Keranjang</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
