<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $primaryImage = $this->primaryImage?->image_url ?? $this->images->first()?->image_url;

        $availableSizes = $this->variants
            ->pluck('size')
            ->unique()
            ->values()
            ->all();

        $availableColors = $this->variants
            ->unique('color_name')
            ->map(fn($v) => [
                'name' => $v->color_name,
                'hex' => $v->color_hex,
            ])
            ->values()
            ->all();

        $price = (float) $this->base_price;
        $formattedPrice = ((int) $price == $price) ? (int) $price : $price;

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
            'available_sizes' => $availableSizes,
            'available_colors' => $availableColors,
            'total_stock' => (int) $this->variants->sum('stock_quantity'),
            'is_featured' => (bool) $this->is_featured,
        ];
    }
}
