'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Ruler, 
  HelpCircle, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  CheckCircle2,
  Mail
} from 'lucide-react';
import { useSizeChartStore } from '@/store/useSizeChartStore';

export default function Footer() {
  const pathname = usePathname();
  const { open: openSizeChart } = useSizeChartStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }


  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-300">
      {/* Newsletter & Brand Highlight Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                STARS CLUB MEMBERSHIP
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
                DAPATKAN DISKON 10% UNTUK DROP PERTAMA
              </h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-md">
                Jadilah yang pertama mengetahui perilisan koleksi *limited edition*, restock varian, dan promo eksklusif.
              </p>
            </div>

            <div>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>Terima kasih! Kode voucher 10% telah dikirim ke email Anda.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan alamat email Anda"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950 font-black text-sm tracking-tighter">
                ★
              </span>
              <span className="font-black text-xl tracking-tight text-white uppercase">
                STARS MERCH
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Platform apparel direct-to-consumer (D2C) untuk streetwear modern. Menghadirkan siluet boxy-oversized dengan material 100% 24s Heavyweight Cotton terbaik.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.34 6.34 0 0 0 1.87-4.49V8.52a8.27 8.27 0 0 0 4.84 1.56V6.69z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Katalog Produk
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=oversized-tees" className="hover:text-white transition-colors">
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=hoodies-sweaters" className="hover:text-white transition-colors">
                  Hoodies & Sweaters
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=pants" className="hover:text-white transition-colors">
                  Cargo & Pants
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=accessories" className="hover:text-white transition-colors">
                  Aksesori
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Size Guide Trigger */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Bantuan Pelanggan
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={openSizeChart}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Ruler className="h-4 w-4 text-zinc-500" />
                  <span>Panduan Ukuran</span>
                </button>
              </li>
              <li>
                <Link href="/faq" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <HelpCircle className="h-4 w-4 text-zinc-500" />
                  <span>FAQ & Pertanyaan</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Truck className="h-4 w-4 text-zinc-500" />
                  <span>Pengiriman & Ongkir</span>
                </Link>
              </li>
              <li>
                <Link href="/returns" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <ShieldCheck className="h-4 w-4 text-zinc-500" />
                  <span>Garansi Retur Ukuran</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Informasi Brand
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Tentang Stars Merch
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} PT Stars Merch Indonesia. All rights reserved.</p>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <p>Designed for Modern Streetwear Enthusiasts</p>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-zinc-500 mr-1 text-[11px]">Metode Pembayaran:</span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono font-semibold text-zinc-300">
              BCA
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono font-semibold text-zinc-300">
              MANDIRI
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono font-semibold text-zinc-300">
              BNI
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono font-semibold text-zinc-300">
              BRI
            </span>
            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 font-mono font-semibold text-amber-400">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
