'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      {/* Background Streetwear Atmosphere / Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop"
          alt="Stars Merch Streetwear Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35 scale-105 animate-in fade-in duration-700"
        />
        {/* Gradients & Vignette for Streetwear Aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-zinc-950/50 to-zinc-950" />
      </div>

      {/* Decorative Grid Lines / Streetwear Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Drop Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 animate-in slide-in-from-top-4 duration-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>DROP 01 // COSMIC STREETWEAR</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.95] max-w-4xl text-balance">
          DEFINING THE <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">BOXY OVERSIZED</span> ERA.
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed text-balance">
          Koleksi pakaian streetwear D2C premium berpotongan boxy-oversized khas dengan material <strong>100% 24s Heavyweight Cotton</strong>. Didesain untuk ketahanan, kenyamanan harian, dan identitas autentik.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-zinc-950 font-extrabold text-sm sm:text-base tracking-wider uppercase hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl cursor-pointer"
          >
            <span>Shop Collection</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/catalog?category=oversized-tees"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700 hover:border-zinc-500 text-white font-bold text-sm sm:text-base tracking-wider uppercase hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Explore Oversized Tees
          </Link>
        </div>

        {/* Quick Quality Highlights */}
        <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-12 border-t border-white/10 pt-8 w-full max-w-2xl text-center">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">240 GSM</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Heavy Cotton</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">BOXY FIT</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Drop Shoulder</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white">LIMITED</div>
            <div className="text-xs text-zinc-400 uppercase tracking-wider mt-0.5">Numbered Batch</div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1 text-zinc-500 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll Down</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  );
}
