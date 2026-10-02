import type { Metadata } from 'next';
import CheckoutView from '@/components/checkout/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout Pesanan | Stars Merch',
  description: 'Lengkapi alamat pengiriman dan pilih metode pembayaran untuk menyelesaikan pesanan streetwear Stars Merch Anda.',
};

export default function CheckoutPage() {
  return (
    <div className="flex-1 w-full bg-white dark:bg-zinc-950">
      <CheckoutView />
    </div>
  );
}
