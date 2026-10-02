'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers, 
  AlertCircle, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { StoreProductVariantPayload } from '@/types/api';
import { formatRupiah } from '@/lib/utils';

interface ColorPreset {
  name: string;
  hex: string;
}

const STREETWEAR_COLOR_PRESETS: ColorPreset[] = [
  { name: 'Cosmic Black', hex: '#1E1E24' },
  { name: 'Vintage Charcoal', hex: '#2F3542' },
  { name: 'Acid Washed Grey', hex: '#4A4E69' },
  { name: 'Sand Beige', hex: '#D8C3A5' },
  { name: 'Off-White', hex: '#F5F5F5' },
  { name: 'Midnight Navy', hex: '#1B263B' },
  { name: 'Sage Green', hex: '#588157' },
];

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

interface VariantMatrixBuilderProps {
  productSlug: string;
  variants: StoreProductVariantPayload[];
  onChange: (variants: StoreProductVariantPayload[]) => void;
}

export default function VariantMatrixBuilder({
  productSlug,
  variants,
  onChange,
}: VariantMatrixBuilderProps) {
  // Generator State
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState<ColorPreset[]>([
    { name: 'Cosmic Black', hex: '#1E1E24' },
  ]);
  const [defaultStock, setDefaultStock] = useState<number>(20);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#3b82f6');

  // Toggle size selection
  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Toggle color selection
  const handleToggleColor = (color: ColorPreset) => {
    const exists = selectedColors.some((c) => c.name.toLowerCase() === color.name.toLowerCase());
    if (exists) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c.name.toLowerCase() !== color.name.toLowerCase()));
      }
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Add custom color
  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customColorName.trim()) return;

    const newColor: ColorPreset = {
      name: customColorName.trim(),
      hex: customColorHex.trim() || '#1E1E24',
    };

    if (!selectedColors.some((c) => c.name.toLowerCase() === newColor.name.toLowerCase())) {
      setSelectedColors([...selectedColors, newColor]);
    }
    setCustomColorName('');
  };

  // Helper to generate clean SKU
  const generateSkuCode = (slug: string, colorName: string, size: string) => {
    const slugCode = slug
      .replace(/^stars-/, '')
      .split('-')
      .slice(0, 2)
      .join('')
      .toUpperCase()
      .substring(0, 6) || 'ITEM';

    const colorCode = colorName
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .substring(0, 4) || 'CLR';

    return `STM-${slugCode}-${colorCode}-${size}`.toUpperCase();
  };

  // Trigger Matrix Generation
  const handleGenerateMatrix = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) return;

    const cleanSlug = productSlug.trim() || 'streetwear';
    const newVariants: StoreProductVariantPayload[] = [];

    for (const color of selectedColors) {
      for (const size of selectedSizes) {
        const sku = generateSkuCode(cleanSlug, color.name, size);
        newVariants.push({
          size,
          color_name: color.name,
          color_hex: color.hex,
          sku,
          additional_price: size === 'XXL' ? 15000 : 0,
          stock_quantity: defaultStock,
        });
      }
    }

    onChange(newVariants);
  };

  // Single variant change
  const handleVariantChange = (index: number, field: keyof StoreProductVariantPayload, value: string | number) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  // Remove single variant
  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Add a single custom row
  const handleAddSingleRow = () => {
    const cleanSlug = productSlug.trim() || 'item';
    const randomSuffix = Math.floor(10 + Math.random() * 89);
    const newVariant: StoreProductVariantPayload = {
      size: 'L',
      color_name: 'Custom Shade',
      color_hex: '#1E1E24',
      sku: `STM-${cleanSlug.substring(0, 4).toUpperCase()}-CUSTOM-${randomSuffix}`,
      additional_price: 0,
      stock_quantity: 15,
    };
    onChange([...variants, newVariant]);
  };

  // Duplicate SKU check
  const skuList = variants.map((v) => v.sku.toUpperCase());
  const hasDuplicateSku = new Set(skuList).size !== skuList.length;

  const totalStockCount = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white uppercase tracking-tight">
            Visual Variant Matrix Builder
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Buat matriks kombinasi ukuran dan warna secara otomatis untuk menghasilkan SKU unik dan kuantitas stok fisik.
        </p>
      </div>

      {/* Generator Control Panel */}
      <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-5">
        {/* Step 1: Size Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            1. Pilih Ukuran Pakaian yang Tersedia
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleToggleSize(size)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    isSelected
                      ? 'bg-white text-zinc-950 shadow-md ring-2 ring-white/20'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Color Palette Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
            2. Pilih Warna Streetwear
          </label>
          <div className="flex flex-wrap gap-2">
            {STREETWEAR_COLOR_PRESETS.map((color) => {
              const isSelected = selectedColors.some((c) => c.name.toLowerCase() === color.name.toLowerCase());
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => handleToggleColor(color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-zinc-850 text-white border border-emerald-500/80 shadow-sm'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Custom Color Input Form */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={customColorHex}
              onChange={(e) => setCustomColorHex(e.target.value)}
              className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0.5"
              title="Pilih warna custom"
            />
            <input
              type="text"
              value={customColorName}
              onChange={(e) => setCustomColorName(e.target.value)}
              placeholder="Nama warna baru (misal: Washed Olive)"
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              + Tambah Warna
            </button>
          </div>
        </div>

        {/* Step 3: Default Stock and Action */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-300 font-medium">Stok Awal per Kombinasi:</label>
            <input
              type="number"
              min={0}
              value={defaultStock}
              onChange={(e) => setDefaultStock(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white text-center focus:outline-none focus:border-zinc-500 font-mono"
            />
            <span className="text-xs text-zinc-500">pcs</span>
          </div>

          <button
            type="button"
            onClick={handleGenerateMatrix}
            disabled={selectedSizes.length === 0 || selectedColors.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Matriks ({selectedSizes.length} Ukuran × {selectedColors.length} Warna)</span>
          </button>
        </div>
      </div>

      {/* Duplicate SKU Warning Banner */}
      {hasDuplicateSku && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Terdapat SKU duplikat di dalam daftar varian! Setiap varian harus memiliki kode SKU yang unik.</span>
        </div>
      )}

      {/* Generated Variants Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Daftar Varian Pakaian Terdaftar ({variants.length} Varian)
            </h4>
            <span className="text-[11px] text-zinc-400">
              Total Akumulasi Stok Fisik: <strong className="text-emerald-400">{totalStockCount} pcs</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddSingleRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Varian Manual</span>
          </button>
        </div>

        {variants.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            Belum ada varian produk. Klik tombol <strong>&ldquo;Generate Matriks&rdquo;</strong> di atas untuk membuat varian otomatis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-950/60">
                  <th className="py-2.5 px-3">Ukuran</th>
                  <th className="py-2.5 px-3">Warna & Swatch</th>
                  <th className="py-2.5 px-3">SKU Unik</th>
                  <th className="py-2.5 px-3">Tambahan Harga (IDR)</th>
                  <th className="py-2.5 px-3">Stok Fisik (pcs)</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {variants.map((variant, index) => {
                  return (
                    <tr key={index} className="hover:bg-zinc-850/40 transition-colors">
                      {/* Size */}
                      <td className="py-2.5 px-3">
                        <select
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-white font-bold focus:outline-none"
                        >
                          {AVAILABLE_SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      {/* Color */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={variant.color_hex}
                            onChange={(e) => handleVariantChange(index, 'color_hex', e.target.value)}
                            className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 cursor-pointer p-0"
                            title="Ubah swatch warna"
                          />
                          <input
                            type="text"
                            value={variant.color_name}
                            onChange={(e) => handleVariantChange(index, 'color_name', e.target.value)}
                            className="w-32 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs text-white focus:outline-none"
                          />
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value.toUpperCase())}
                          className="w-48 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-white focus:outline-none focus:border-zinc-500 uppercase"
                          placeholder="STM-TEE-BLK-L"
                        />
                      </td>

                      {/* Additional Price */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1">
                          <span className="text-zinc-500 text-[11px]">+Rp</span>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={variant.additional_price || 0}
                            onChange={(e) => handleVariantChange(index, 'additional_price', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-24 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-white focus:outline-none text-right"
                          />
                        </div>
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min={0}
                          value={variant.stock_quantity}
                          onChange={(e) => handleVariantChange(index, 'stock_quantity', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-20 px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-emerald-400 font-bold focus:outline-none text-center"
                        />
                      </td>

                      {/* Remove Button */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Hapus varian ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
