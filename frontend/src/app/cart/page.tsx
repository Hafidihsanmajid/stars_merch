import type { Metadata } from 'next';
import CartPageView from '@/components/cart/CartPageView';

export const metadata: Metadata = {
  title: 'Keranjang Belanja | Stars Merch',
  description: 'Tinjau item pakaian streetwear pilihan Anda, gunakan kupon promo, dan lanjutkan ke pembayaran.',
};

export default function CartPage() {
  return (
    <div className="flex-1 w-full bg-white dark:bg-zinc-950">
      <CartPageView />
    </div>
  );
}
