import CreateProductForm from '@/components/admin/CreateProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tambah Produk Pakaian Baru | Admin Stars Merch',
  description: 'Formulir penambahan produk pakaian baru, galeri foto, dan matriks varian fisik.',
};

export default function NewProductPage() {
  return <CreateProductForm />;
}
