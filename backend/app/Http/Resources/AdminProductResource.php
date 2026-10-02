<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminProductResource extends JsonResource
{
    /**
     * Transform the resource into an array for admin inventory dashboard.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primaryImage = $this->primaryImage?->image_url ?? $this->images->first()?->image_url;

        $price = (float) $this->base_price;
        $formattedPrice = ((int) $price == $price) ? (int) $price : $price;

        $totalStock = (int) $this->variants->sum('stock_quantity');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'base_price' => $formattedPrice,
            'primary_image' => $primaryImage,
            'total_stock' => $totalStock,
            'images_count' => $this->images->count(),
            'variants_count' => $this->variants->count(),
            'is_featured' => (bool) $this->is_featured,
            'is_active' => (bool) $this->is_active,
            'status' => $this->is_active ? 'active' : 'draft',
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
