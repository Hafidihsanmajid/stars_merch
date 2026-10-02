import { Sparkles, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export default function ValuePropositions() {
  const propositions = [
    {
      icon: Sparkles,
      title: '100% Heavyweight Cotton',
      subtitle: '240 GSM 24s Combed',
      description:
        'Material katun pilihan dengan ketebalan kokoh, tidak mudah melar, dan memiliki sirkulasi udara optimal yang nyaman digunakan seharian.',
    },
    {
      icon: Truck,
      title: 'Pengiriman Cepat & Aman',
      subtitle: 'Dispatched in 24 Hours',
      description:
        'Kemasan proteksi ganda tahan cuaca. Pengiriman ke seluruh Indonesia dengan konfirmasi resi instan dan opsi Cash on Delivery (COD).',
    },
    {
      icon: RotateCcw,
      title: 'Garansi Bebas Tukar Ukuran',
      subtitle: '7 Days Return Policy',
      description:
        'Ukuran kurang pas? Nikmati kemudahan fasilitas tukar ukuran dalam 7 hari kerja tanpa proses yang berbelit-belit.',
    },
    {
      icon: ShieldCheck,
      title: 'Jahitan & Sablon Premium',
      subtitle: 'Reinforced Construction',
      description:
        'Rib leher tebal anti-kendur dengan jahitan rantai bahu ganda, serta aplikasi sablon beresolusi tinggi tahan pencucian mesin bertahun-tahun.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            THE STARS STANDARD
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 dark:text-white uppercase tracking-tight mt-2">
            KOMITMEN KUALITAS & KEPUASAN ANDA
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3">
            Setiap jengkal produk Stars Merch diproduksi dengan standar presisi tinggi untuk menghadirkan kenyamanan dan kebanggaan streetwear autentik.
          </p>
        </div>

        {/* Proposition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {propositions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all hover:shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 stroke-[1.75]" />
                </div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                  {item.subtitle}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
