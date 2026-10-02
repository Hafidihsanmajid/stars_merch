'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Package, 
  PlusCircle, 
  ExternalLink, 
  LogOut, 
  User, 
  Menu, 
  X,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAdminAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.push('/admin/login');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    {
      name: 'Katalog Produk',
      href: '/admin/products',
      icon: Package,
      active: pathname === '/admin/products' || pathname === '/admin',
    },
    {
      name: 'Tambah Produk',
      href: '/admin/products/new',
      icon: PlusCircle,
      active: pathname === '/admin/products/new',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand & Portal Badge */}
          <div className="flex items-center gap-6">
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-white text-zinc-950 flex items-center justify-center font-black tracking-tighter text-lg shadow-sm transition-transform group-hover:scale-105">
                ★
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-tight text-base sm:text-lg uppercase text-white leading-none">
                  STARS MERCH
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 inline" /> Admin Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-zinc-800 pl-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      link.active
                        ? 'bg-zinc-800/90 text-white shadow-inner'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Storefront Link & Admin Profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {/* Storefront preview link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors border border-zinc-800/80"
              title="Buka etalase toko di tab baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Toko</span>
            </Link>

            {/* Admin User Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-200 leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono leading-tight">
                  {user?.email || 'admin@starsmerch.com'}
                </span>
              </div>
              <span className="ml-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                {user?.role || 'ADMIN'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut || isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-rose-900/40 transition-colors disabled:opacity-50"
              title="Keluar dari sesi admin"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
              aria-label="Toggle Menu Admin"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-200">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {user?.email || 'admin@starsmerch.com'}
              </span>
            </div>
            <span className="ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {user?.role || 'ADMIN'}
            </span>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                    link.active
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Toko Publik</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut || isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>Keluar dari Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
