import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-12 sm:py-16 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-8 sm:p-14 lg:p-20">
          {/* Background Streetwear Texture */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1600&auto=format&fit=crop"
              alt="Stars Merch Streetwear Drop"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold tracking-widest uppercase">
              <Flame className="h-4 w-4" />
              <span>LIMITED CAPSULE RELEASE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight">
              STARS ACID-WASH <br />
              <span className="text-zinc-400">VINTAGE EDITION</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Dibuat dengan teknik pewarnaan acid-wash manual sehingga tiap helai kaos memiliki corak unik yang tidak akan pernah sama. Dilengkapi sablon timbul plastisol HD bertekstur.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/catalog?category=oversized-tees"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-zinc-950 font-extrabold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg cursor-pointer"
              >
                <span>Dapatkan Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-zinc-400 font-mono">
                *Stok terbatas hanya 100 pcs per varian
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
