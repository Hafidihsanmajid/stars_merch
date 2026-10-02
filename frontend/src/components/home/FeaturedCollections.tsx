import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedCollections() {
  const collections = [
    {
      title: 'Oversized Heavy Tees',
      slug: 'oversized-tees',
      tag: 'MOST POPULAR',
      description: 'Potongan boxy dengan siluet bahu turun, menggunakan 100% 24s combed cotton 240 GSM.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      span: 'md:col-span-2 md:row-span-2 min-h-[420px]',
    },
    {
      title: 'Heavyweight Hoodies',
      slug: 'hoodies-sweaters',
      tag: 'ESSENTIAL COMFORT',
      description: '330 GSM fleece katun tebal dengan double-layered hood & kantong kanguru lapang.',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      span: 'min-h-[280px]',
    },
    {
      title: 'Cargo & Relaxed Pants',
      slug: 'pants',
      tag: 'TACTICAL UTILITY',
      description: 'Material ripstop tahan gesekan dengan multi-pocket modular untuk mobilitas tinggi.',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
      span: 'min-h-[280px]',
    },
    {
      title: 'Streetwear Accessories',
      slug: 'accessories',
      tag: 'NEW ACCENTS',
      description: 'Topi, sling bags, dan kaus kaki premium pelengkap gaya harian Anda.',
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop',
      span: 'md:col-span-2 min-h-[260px]',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              CURATED CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-2">
              FEATURED COLLECTIONS
            </h2>
          </div>
          <Link
            href="/catalog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:underline group"
          >
            Lihat Semua Koleksi
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((item) => (
            <Link
              key={item.slug}
              href={`/catalog?category=${item.slug}`}
              className={`group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-end p-6 sm:p-8 ${item.span} transition-all duration-300 hover:shadow-2xl`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>

              {/* Foreground Information */}
              <div className="relative z-10 space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-widest text-white uppercase mb-1">
                  {item.tag}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <div className="h-10 w-10 rounded-full bg-white text-zinc-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-zinc-300 line-clamp-2 max-w-lg">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
