'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Clock, 
  Building2, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  Printer, 
  ShoppingBag,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { OrderDetail, PaymentInstructions } from '@/types/api';
import { api } from '@/lib/api';
import { formatRupiah } from '@/lib/utils';

export default function OrderSuccessView() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get('order') || '';
  const emailParam = searchParams.get('email') || '';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [paymentInstructions, setPaymentInstructions] = useState<PaymentInstructions | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    // Check if session storage has recent payment instructions
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('stars_last_order');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.order_number === orderNumberParam) {
            setPaymentInstructions(parsed.payment_instructions || null);
          }
        } catch {
          // ignore
        }
      }
    }

    async function loadOrder() {
      if (!orderNumberParam) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getOrder(orderNumberParam, emailParam);
        if (res.success && res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderNumberParam, emailParam]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-3/4 mx-auto" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
        <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
      </div>
    );
  }

  const orderNum = order?.order_number || orderNumberParam || 'STM-202610-0001';
  const paymentMethod = order?.payment_method || 'bank_transfer_bca';
  const totalAmount = order?.pricing?.total_amount || 0;

  // Fallback instructions if not present in API or session
  const activeInstructions: PaymentInstructions = paymentInstructions || {
    bank_name: paymentMethod === 'bank_transfer_mandiri' ? 'Bank Mandiri' : 'Bank Central Asia (BCA)',
    account_number: paymentMethod === 'bank_transfer_mandiri' ? '137-00-192831-2' : '8720-1928-31',
    account_holder: 'PT STARS MERCH INDONESIA',
    unique_code: 18,
    transfer_amount: totalAmount || 219018,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 mb-2">
          <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 stroke-[2]" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest">
          PESANAN BERHASIL DITERIMA
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
          TERIMA KASIH ATAS PESANAN ANDA!
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Nomor invoice pesanan Anda adalah <strong className="text-zinc-950 dark:text-white font-mono">{orderNum}</strong>. Konfirmasi detail pemesanan telah dikirim ke alamat email Anda.
        </p>

        {/* Invoice Code Copy Box */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono">
          <span className="text-zinc-500">Invoice:</span>
          <span className="font-bold text-zinc-900 dark:text-white">{orderNum}</span>
          <button
            type="button"
            onClick={() => handleCopy(orderNum, 'order_number')}
            className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Salin nomor pesanan"
          >
            {copiedField === 'order_number' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Payment Instructions Box (FR-5.5) */}
        {paymentMethod === 'cod' ? (
          /* COD Instructions */
          <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                  Pembayaran Cash on Delivery (COD)
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Pembayaran tunai saat barang diantar oleh kurir.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-amber-200 dark:border-amber-900/50 space-y-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>• Mohon siapkan uang tunai pas sebesar <strong>{formatRupiah(totalAmount || 219000)}</strong> saat kurir tiba di alamat Anda.</p>
              <p>• Paket akan dikirimkan dalam 24 jam dengan resi pelacakan.</p>
            </div>
          </div>
        ) : (
          /* Bank Transfer Instructions (BCA / Mandiri) */
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white text-zinc-950 flex items-center justify-center font-black">
                  {paymentMethod === 'bank_transfer_mandiri' ? (
                    <CreditCard className="h-6 w-6 text-blue-700" />
                  ) : (
                    <Building2 className="h-6 w-6 text-blue-800" />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                    INSTRUKSI PEMBAYARAN MANUAL
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                    {activeInstructions.bank_name}
                  </h3>
                </div>
              </div>

              {/* Deadline Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>Batas Waktu: 24 Jam</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Number Box */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                  Nomor Rekening Tujuan
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-wider text-white">
                    {activeInstructions.account_number}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeInstructions.account_number, 'account_number')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    {copiedField === 'account_number' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'account_number' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="text-xs text-zinc-400 pt-1">
                  Atas Nama: <strong className="text-white">{activeInstructions.account_holder}</strong>
                </div>
              </div>

              {/* Transfer Amount with Unique Code */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">
                  Jumlah Transfer Tepat
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400">
                    {formatRupiah(activeInstructions.transfer_amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeInstructions.transfer_amount.toString(), 'transfer_amount')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
                  >
                    {copiedField === 'transfer_amount' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedField === 'transfer_amount' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-amber-400/90 pt-1">
                  *Transfer persis hingga digit terakhir untuk verifikasi otomatis instan.
                </p>
              </div>
            </div>

            {/* Transfer Steps */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 space-y-2 leading-relaxed">
              <div className="font-bold text-zinc-300 uppercase tracking-wider">
                Langkah Pembayaran:
              </div>
              <p>1. Masuk ke aplikasi m-Banking atau ATM bank Anda.</p>
              <p>2. Pilih menu <strong>Transfer ke Rekening Bank</strong> dan masukkan nomor rekening di atas.</p>
              <p>3. Masukkan nominal transfer <strong>{formatRupiah(activeInstructions.transfer_amount)}</strong> sesuai angka tertera.</p>
              <p>4. Simpan bukti transfer Anda. Pembayaran akan diverifikasi dalam 5-15 menit.</p>
            </div>
          </div>
        )}

        {/* Order Details & Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-6">
          <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-3">
            Rincian Pesanan
          </h2>

          {/* Customer & Shipping Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                Penerima Paket:
              </span>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">{order?.customer?.name || 'Rian Pratama'}</p>
              <p>{order?.customer?.email || emailParam || 'customer@example.com'}</p>
              <p>{order?.customer?.phone || '081234567890'}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
                Alamat Tujuan:
              </span>
              <p className="text-zinc-800 dark:text-zinc-200">{order?.shipping?.address || 'Jl. Senopati No. 88, Kebayoran Baru'}</p>
              <p>{order?.shipping?.city || 'Jakarta Selatan'}, {order?.shipping?.postal_code || '12190'}</p>
              {order?.notes && (
                <p className="italic text-zinc-500 pt-1">Catatan: &ldquo;{order.notes}&rdquo;</p>
              )}
            </div>
          </div>

          {/* Purchased Items Table */}
          {order?.items && order.items.length > 0 && (
            <div className="pt-2">
              <span className="font-bold text-xs uppercase tracking-wider text-zinc-950 dark:text-white block mb-3">
                Item yang Dibeli:
              </span>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border-y border-zinc-200 dark:border-zinc-800 text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-white">{it.product_name}</div>
                      <div className="text-zinc-500">{it.variant_info} × {it.quantity}</div>
                    </div>
                    <div className="font-bold text-zinc-900 dark:text-white font-mono">
                      {formatRupiah(it.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center justify-between">
              <span>Subtotal Produk</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {formatRupiah(order?.pricing?.subtotal || 199000)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Biaya Pengiriman</span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {order?.pricing?.shipping_cost === 0 ? 'GRATIS' : formatRupiah(order?.pricing?.shipping_cost || 20000)}
              </span>
            </div>
            <div className="flex items-baseline justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 text-sm">
              <span className="font-bold text-zinc-950 dark:text-white">Total Tagihan</span>
              <span className="text-xl font-black text-zinc-950 dark:text-white">
                {formatRupiah(totalAmount || 219000)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Invoice</span>
            </button>

            <Link
              href="/catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Belanja Lagi</span>
            </Link>
          </div>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            <span>Kembali ke Beranda</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
