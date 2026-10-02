'use client';

import { useEffect } from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { useSizeChartStore } from '@/store/useSizeChartStore';

export default function SizeChartModal() {
  const { isOpen, close } = useSizeChartStore();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={close}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            <h2 id="size-chart-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Panduan Ukuran (Size Guide)
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Tutup panduan ukuran"
            className="rounded-lg p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Fit Description */}
          <div className="flex items-start gap-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-4 border border-zinc-200/60 dark:border-zinc-700/50">
            <Info className="h-5 w-5 text-zinc-600 dark:text-zinc-300 mt-0.5 shrink-0" />
            <div className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Boxy-Oversized Signature Fit:</span> Potongan bahu turun (*drop shoulder*) dengan siluet kotak lebar. Pilih ukuran normal Anda untuk *streetwear look* santai, atau turun satu ukuran jika menginginkan ukuran pas tubuh (*regular fit*).
            </div>
          </div>

          {/* Measurements Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-xs uppercase font-semibold text-zinc-700 dark:text-zinc-300 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Ukuran</th>
                  <th className="px-4 py-3">Lebar Dada (cm)</th>
                  <th className="px-4 py-3">Panjang Badan (cm)</th>
                  <th className="px-4 py-3">Lebar Bahu (cm)</th>
                  <th className="px-4 py-3">Panjang Lengan (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">S</td>
                  <td className="px-4 py-3">54</td>
                  <td className="px-4 py-3">70</td>
                  <td className="px-4 py-3">50</td>
                  <td className="px-4 py-3">23</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">M</td>
                  <td className="px-4 py-3">57</td>
                  <td className="px-4 py-3">72</td>
                  <td className="px-4 py-3">52</td>
                  <td className="px-4 py-3">24</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">L</td>
                  <td className="px-4 py-3">60</td>
                  <td className="px-4 py-3">74</td>
                  <td className="px-4 py-3">54</td>
                  <td className="px-4 py-3">25</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">XL</td>
                  <td className="px-4 py-3">63</td>
                  <td className="px-4 py-3">76</td>
                  <td className="px-4 py-3">56</td>
                  <td className="px-4 py-3">26</td>
                </tr>
                <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3 font-bold text-zinc-900 dark:text-white">XXL</td>
                  <td className="px-4 py-3">66</td>
                  <td className="px-4 py-3">78</td>
                  <td className="px-4 py-3">58</td>
                  <td className="px-4 py-3">27</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tolerance note */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
            * Toleransi ukuran jahitan & perlakuan bahan sekitar 1 - 2 cm.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={close}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
