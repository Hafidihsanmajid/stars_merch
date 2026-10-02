import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login | Stars Merch',
  description: 'Masuk ke portal administrasi Stars Merch.',
};

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
          <p className="text-xs">Memuat halaman login...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
