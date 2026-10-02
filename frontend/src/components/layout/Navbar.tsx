'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, Sparkles, Ruler } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSizeChartStore } from '@/store/useSizeChartStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems, openDrawer } = useCartStore();
  const { open: openSizeChart } = useSizeChartStore();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const totalItems = mounted ? getTotalItems() : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/catalog' },
    { name: 'Oversized Tees', href: '/catalog?category=oversized-tees' },
    { name: 'Hoodies', href: '/catalog?category=hoodies-sweaters' },
    { name: 'Pants & Aksesori', href: '/catalog?category=pants' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] sm:text-xs font-semibold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Gratis Ongkir min. belanja Rp300.000 • Gunakan kode: <strong>STARS2026</strong></span>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Buka menu navigasi"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-black text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                ★
              </span>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tighter text-zinc-950 dark:text-white uppercase font-sans">
                  STARS MERCH
                </span>
                <span className="text-[9px] font-medium text-zinc-400 tracking-widest uppercase -mt-1 hidden sm:block">
                  Apparel & Streetwear
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-zinc-950 dark:text-white font-semibold bg-zinc-100 dark:bg-zinc-800/60'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Size Chart, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Box Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 animate-in fade-in duration-150"
                >
                  <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari pakaian..."
                    autoFocus
                    className="bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white outline-none w-28 sm:w-44 placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Cari produk"
                  className="p-2 sm:p-2.5 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Size Chart Modal Trigger */}
            <button
              type="button"
              onClick={openSizeChart}
              aria-label="Buka panduan ukuran"
              title="Panduan Ukuran"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <Ruler className="h-3.5 w-3.5" />
              <span>Size Guide</span>
            </button>

            {/* Shopping Cart Button with Dynamic Badge */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Buka keranjang belanja (${totalItems} item)`}
              className="relative p-2 sm:p-2.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95 shadow-sm flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow ring-2 ring-white dark:ring-zinc-950 animate-in zoom-in-75">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2 border border-zinc-200 dark:border-zinc-700">
              <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kaos, hoodie, dll..."
                className="bg-transparent text-sm text-zinc-900 dark:text-white outline-none w-full placeholder:text-zinc-400"
              />
            </form>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openSizeChart();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-left transition-colors cursor-pointer"
            >
              <Ruler className="h-4 w-4 text-zinc-400" />
              Panduan Ukuran (Size Guide)
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
