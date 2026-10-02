<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\ProductVariant;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * Execute atomic order checkout and stock decrement.
     */
    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $order = DB::transaction(function () use ($request) {
            $shippingCost = 20000.00; // Flat rate shipping
            $subtotal = 0.00;
            $orderItemsData = [];

            // 1. Validate & Lock stock for each item
            foreach ($request->input('items') as $index => $itemInput) {
                $variantId = $itemInput['variant_id'];
                $quantity = (int) $itemInput['quantity'];

                /** @var ProductVariant|null $variant */
                $variant = ProductVariant::where('id', $variantId)
                    ->lockForUpdate()
                    ->with('product')
                    ->first();

                if (! $variant || ! $variant->product || ! $variant->product->is_active) {
                    throw ValidationException::withMessages([
                        "items.{$index}.variant_id" => ['Varian produk tidak ditemukan atau tidak aktif.'],
                    ]);
                }

                if ($variant->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        "items.{$index}.quantity" => [
                            "Stok tidak mencukupi untuk {$variant->product->name} ({$variant->size} / {$variant->color_name}). Sisa stok: {$variant->stock_quantity}.",
                        ],
                    ]);
                }

                // Decrement stock atomically
                $variant->decrement('stock_quantity', $quantity);

                // Compute price snapshots
                $unitPrice = (float) $variant->product->base_price + (float) $variant->additional_price;
                $subtotalPrice = $unitPrice * $quantity;
                $subtotal += $subtotalPrice;

                $orderItemsData[] = [
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_info' => "Size {$variant->size} / {$variant->color_name}",
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal_price' => $subtotalPrice,
                ];
            }

            // 2. Upsert customer profile
            $customer = Customer::updateOrCreate(
                ['email' => $request->input('customer_email')],
                [
                    'name' => $request->input('customer_name'),
                    'phone' => $request->input('customer_phone'),
                    'address' => $request->input('shipping_address'),
                    'city' => $request->input('shipping_city'),
                    'postal_code' => $request->input('shipping_postal_code'),
                ]
            );

            // 3. Generate unique Order Number
            $prefix = 'STM-' . date('Ym') . '-';
            $lastOrder = Order::where('order_number', 'like', $prefix . '%')
                ->lockForUpdate()
                ->orderBy('id', 'desc')
                ->first();

            $sequence = 1;
            if ($lastOrder && preg_match('/-(\d+)$/', $lastOrder->order_number, $matches)) {
                $sequence = (int) $matches[1] + 1;
            }
            $orderNumber = $prefix . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);

            // 4. Create Order
            $totalAmount = $subtotal + $shippingCost;

            $newOrder = Order::create([
                'order_number' => $orderNumber,
                'customer_id' => $customer->id,
                'customer_name' => $request->input('customer_name'),
                'customer_email' => $request->input('customer_email'),
                'customer_phone' => $request->input('customer_phone'),
                'shipping_address' => $request->input('shipping_address'),
                'shipping_city' => $request->input('shipping_city'),
                'shipping_postal_code' => $request->input('shipping_postal_code'),
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'total_amount' => $totalAmount,
                'payment_method' => $request->input('payment_method'),
                'payment_status' => 'pending',
                'order_status' => 'unprocessed',
                'notes' => $request->input('notes'),
            ]);

            // 5. Create Order Items
            foreach ($orderItemsData as $itemData) {
                $newOrder->items()->create($itemData);
            }

            return $newOrder;
        });

        // 6. Build Payment Instructions
        $paymentInstructions = $this->buildPaymentInstructions(
            $order->payment_method,
            (float) $order->total_amount,
            $order->id
        );

        $total = (float) $order->total_amount;
        $formattedTotal = ((int) $total == $total) ? (int) $total : $total;

        return response()->json([
            'success' => true,
            'statusCode' => 201,
            'message' => 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.',
            'data' => [
                'order_number' => $order->order_number,
                'total_amount' => $formattedTotal,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status' => $order->order_status,
                'payment_instructions' => $paymentInstructions,
            ],
        ], 201);
    }

    /**
     * Get order details for public tracking / success confirmation.
     */
    public function show(Request $request, string $order_number): JsonResponse
    {
        $order = Order::with('items')->where('order_number', $order_number)->first();

        if (! $order) {
            return response()->json([
                'success' => false,
                'statusCode' => 404,
                'error' => [
                    'code' => 'ORDER_NOT_FOUND',
                    'message' => 'Pesanan tidak ditemukan.',
                ],
            ], 404);
        }

        // Privacy check if email parameter is provided
        if ($request->filled('email') && strtolower(trim($request->query('email'))) !== strtolower(trim($order->customer_email))) {
            return response()->json([
                'success' => false,
                'statusCode' => 404,
                'error' => [
                    'code' => 'ORDER_NOT_FOUND',
                    'message' => 'Pesanan tidak ditemukan atau email tidak sesuai.',
                ],
            ], 404);
        }

        $items = $order->items->map(function ($item) {
            $unitPrice = (float) $item->unit_price;
            $subtotalPrice = (float) $item->subtotal_price;

            return [
                'product_name' => $item->product_name,
                'variant_info' => $item->variant_info,
                'quantity' => (int) $item->quantity,
                'unit_price' => ((int) $unitPrice == $unitPrice) ? (int) $unitPrice : $unitPrice,
                'subtotal' => ((int) $subtotalPrice == $subtotalPrice) ? (int) $subtotalPrice : $subtotalPrice,
            ];
        });

        $subtotal = (float) $order->subtotal;
        $shippingCost = (float) $order->shipping_cost;
        $totalAmount = (float) $order->total_amount;

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => [
                'order_number' => $order->order_number,
                'created_at' => $order->created_at->toISOString(),
                'customer' => [
                    'name' => $order->customer_name,
                    'email' => $order->customer_email,
                    'phone' => $order->customer_phone,
                ],
                'shipping' => [
                    'address' => $order->shipping_address,
                    'city' => $order->shipping_city,
                    'postal_code' => $order->shipping_postal_code,
                ],
                'items' => $items,
                'pricing' => [
                    'subtotal' => ((int) $subtotal == $subtotal) ? (int) $subtotal : $subtotal,
                    'shipping_cost' => ((int) $shippingCost == $shippingCost) ? (int) $shippingCost : $shippingCost,
                    'total_amount' => ((int) $totalAmount == $totalAmount) ? (int) $totalAmount : $totalAmount,
                ],
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status' => $order->order_status,
            ],
        ]);
    }

    /**
     * Build payment instructions according to payment method.
     */
    private function buildPaymentInstructions(string $method, float $totalAmount, int $orderId): array
    {
        $uniqueCode = ($orderId % 90) + 10;
        $transferAmount = (int) $totalAmount + $uniqueCode;
        $deadline = Carbon::now()->addHours(24)->toIso8601String();

        return match ($method) {
            'bank_transfer_bca', 'manual_bank_transfer' => [
                'bank_name' => 'Bank Central Asia (BCA)',
                'account_number' => '8720-1928-31',
                'account_holder' => 'PT STARS MERCH INDONESIA',
                'unique_code' => $uniqueCode,
                'transfer_amount' => $transferAmount,
                'deadline' => $deadline,
            ],
            'bank_transfer_mandiri' => [
                'bank_name' => 'Bank Mandiri',
                'account_number' => '137-00-192831-2',
                'account_holder' => 'PT STARS MERCH INDONESIA',
                'unique_code' => $uniqueCode,
                'transfer_amount' => $transferAmount,
                'deadline' => $deadline,
            ],
            'bank_transfer_bni' => [
                'bank_name' => 'Bank Negara Indonesia (BNI)',
                'account_number' => '089-1928-312',
                'account_holder' => 'PT STARS MERCH INDONESIA',
                'unique_code' => $uniqueCode,
                'transfer_amount' => $transferAmount,
                'deadline' => $deadline,
            ],
            'bank_transfer_bri' => [
                'bank_name' => 'Bank Rakyat Indonesia (BRI)',
                'account_number' => '0341-01-001928-30-5',
                'account_holder' => 'PT STARS MERCH INDONESIA',
                'unique_code' => $uniqueCode,
                'transfer_amount' => $transferAmount,
                'deadline' => $deadline,
            ],
            'cod' => [
                'payment_type' => 'Cash on Delivery (COD)',
                'instructions' => 'Siapkan uang tunai sejumlah pas saat pesanan diantarkan oleh kurir ke alamat tujuan.',
                'transfer_amount' => (int) $totalAmount,
                'deadline' => null,
            ],
            default => [
                'payment_type' => $method,
                'transfer_amount' => (int) $totalAmount,
                'deadline' => $deadline,
            ],
        };
    }
}
