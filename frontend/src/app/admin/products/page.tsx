import AdminProductsView from '@/components/admin/AdminProductsView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog & Inventaris Produk | Admin Stars Merch',
  description: 'Manajemen produk pakaian, stok fisik per SKU, dan status publikasi.',
};

export default function AdminProductsPage() {
  return <AdminProductsView />;
}
