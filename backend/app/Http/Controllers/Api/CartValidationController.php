<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartValidationController extends Controller
{
    /**
     * Validate cart items stock and current pricing.
     */
    public function validateCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'items.array' => 'Format daftar item keranjang tidak valid.',
            'items.min' => 'Keranjang belanja harus berisi minimal 1 item.',
            'items.*.variant_id.required' => 'ID varian produk wajib diisi.',
            'items.*.variant_id.integer' => 'ID varian produk harus berupa bilangan bulat.',
            'items.*.quantity.required' => 'Jumlah barang wajib diisi.',
            'items.*.quantity.integer' => 'Jumlah barang harus berupa bilangan bulat.',
            'items.*.quantity.min' => 'Jumlah barang minimal adalah 1.',
        ]);

        $items = $validated['items'];
        $variantIds = collect($items)->pluck('variant_id')->unique()->all();

        $variants = ProductVariant::with('product')
            ->whereIn('id', $variantIds)
            ->get()
            ->keyBy('id');

        $isValid = true;
        $validatedItems = [];
        $subtotal = 0;

        foreach ($items as $item) {
            $variantId = $item['variant_id'];
            $quantity = (int) $item['quantity'];

            /** @var ProductVariant|null $variant */
            $variant = $variants->get($variantId);

            if (! $variant || ! $variant->product || ! $variant->product->is_active) {
                $isValid = false;
                $validatedItems[] = [
                    'variant_id' => $variantId,
                    'product_name' => $variant?->product?->name ?? 'Produk tidak tersedia',
                    'variant_info' => $variant ? "Size {$variant->size} / {$variant->color_name}" : 'Varian tidak ditemukan',
                    'quantity' => $quantity,
                    'unit_price' => 0,
                    'subtotal' => 0,
                    'available_stock' => 0,
                    'in_stock' => false,
                ];
                continue;
            }

            $unitPrice = (float) $variant->product->base_price + (float) $variant->additional_price;
            $unitPrice = ((int) $unitPrice == $unitPrice) ? (int) $unitPrice : $unitPrice;
            $itemSubtotal = $unitPrice * $quantity;
            $availableStock = (int) $variant->stock_quantity;
            $inStock = $availableStock >= $quantity;

            if (! $inStock) {
                $isValid = false;
            }

            $subtotal += $itemSubtotal;

            $validatedItems[] = [
                'variant_id' => $variant->id,
                'product_name' => $variant->product->name,
                'variant_info' => "Size {$variant->size} / {$variant->color_name}",
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $itemSubtotal,
                'available_stock' => $availableStock,
                'in_stock' => $inStock,
            ];
        }

        $estimatedShipping = count($validatedItems) > 0 ? 20000 : 0;
        $grandTotal = $subtotal + $estimatedShipping;

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => [
                'is_valid' => $isValid,
                'items' => $validatedItems,
                'subtotal' => $subtotal,
                'estimated_shipping' => $estimatedShipping,
                'grand_total' => $grandTotal,
            ],
        ]);
    }
}
