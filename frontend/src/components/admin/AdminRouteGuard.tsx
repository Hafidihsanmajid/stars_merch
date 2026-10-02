'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import AdminHeader from './AdminHeader';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading, checkAuth } = useAdminAuthStore();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setMounted(true);
    // Trigger auth verification on mount
    checkAuth();
  }, [checkAuth]);

  // Handle redirects once initialized
  useEffect(() => {
    if (!mounted || !isInitialized) return;

    if (!isLoginPage && !isAuthenticated) {
      // Redirect to login with original destination
      const redirectParam = encodeURIComponent(pathname);
      router.replace(`/admin/login?redirect=${redirectParam}`);
    } else if (isLoginPage && isAuthenticated) {
      // Already authenticated, navigate away from login
      router.replace('/admin/products');
    }
  }, [mounted, isInitialized, isAuthenticated, isLoginPage, pathname, router]);

  // For the login page, render immediately or after check
  if (isLoginPage) {
    if (isInitialized && isAuthenticated) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-3" />
          <p className="text-sm font-medium">Mengarahkan ke Dashboard Admin...</p>
        </div>
      );
    }
    return <>{children}</>;
  }

  // If still checking authentication status for protected routes
  if (!mounted || !isInitialized || (!isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-300">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 shadow-lg shadow-black/50">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight uppercase">
            Memverifikasi Sesi Admin
          </h2>
          <p className="text-xs text-zinc-400 mt-1 mb-6">
            Mohon tunggu, sistem sedang memeriksa otorisasi kredensial keamanan...
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Memvalidasi token Laravel Sanctum</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated, hold until redirect fires
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mb-2" />
        <p className="text-xs">Sesi tidak valid, mengalihkan ke halaman login...</p>
      </div>
    );
  }

  // Authenticated: Render Admin Header + Admin Content
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <AdminHeader />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
