import { Suspense } from 'react';
import type { Metadata } from 'next';
import OrderSuccessView from '@/components/checkout/OrderSuccessView';

export const metadata: Metadata = {
  title: 'Konfirmasi Pesanan Sukses | Stars Merch',
  description: 'Pesanan streetwear Stars Merch Anda telah berhasil dibuat. Simpan nomor invoice dan lakukan pembayaran.',
};

function OrderSuccessFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
      <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-3/4 mx-auto" />
      <div className="h-64 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
      <div className="h-48 bg-zinc-100 dark:bg-zinc-900 rounded-3xl" />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="flex-1 w-full bg-white dark:bg-zinc-950">
      <Suspense fallback={<OrderSuccessFallback />}>
        <OrderSuccessView />
      </Suspense>
    </div>
  );
}
