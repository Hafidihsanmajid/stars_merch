<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $basePrice = $this->product ? (float) $this->product->base_price : 0;
        $totalPrice = $basePrice + (float) $this->additional_price;
        $formattedPrice = ((int) $totalPrice == $totalPrice) ? (int) $totalPrice : $totalPrice;

        return [
            'id' => $this->id,
            'size' => $this->size,
            'color_name' => $this->color_name,
            'color_hex' => $this->color_hex,
            'sku' => $this->sku,
            'price' => $formattedPrice,
            'stock' => (int) $this->stock_quantity,
        ];
    }
}
