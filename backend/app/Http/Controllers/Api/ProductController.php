<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get paginated products with filtering, searching, and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['category', 'primaryImage', 'images', 'variants']);

        // Filter by category slug
        if ($request->filled('category')) {
            $categorySlug = $request->query('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Search in product name or description
        if ($request->filled('search')) {
            $search = '%' . trim($request->query('search')) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('description', 'like', $search);
            });
        }

        // Sorting
        $sort = $request->query('sort', 'newest');
        match ($sort) {
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        // Pagination
        $perPage = (int) $request->query('per_page', $request->query('limit', 12));
        $perPage = max(1, min($perPage, 50)); // Clamp between 1 and 50

        $paginator = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => ProductResource::collection($paginator->items()),
            'meta' => [
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'total' => $paginator->total(),
                'total_pages' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * Get featured products for hero/landing showcase.
     */
    public function featured(): JsonResponse
    {
        $featured = Product::query()
            ->where('is_active', true)
            ->where('is_featured', true)
            ->with(['category', 'primaryImage', 'images', 'variants'])
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => ProductResource::collection($featured),
        ]);
    }

    /**
     * Get single product detail by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with([
                'category',
                'images' => fn($q) => $q->orderBy('sort_order', 'asc'),
                'variants.product',
            ])
            ->first();

        if (! $product) {
            return response()->json([
                'success' => false,
                'statusCode' => 404,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Produk tidak ditemukan.',
                ],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => new ProductDetailResource($product),
        ]);
    }
}
