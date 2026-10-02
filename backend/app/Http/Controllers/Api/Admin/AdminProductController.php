<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\AdminProductResource;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminProductController extends Controller
{
    /**
     * Display a paginated list of all products in the admin inventory.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['category', 'primaryImage', 'images', 'variants']);

        // Filter by category (slug or id)
        if ($request->filled('category')) {
            $categoryParam = $request->query('category');
            $query->whereHas('category', function ($q) use ($categoryParam) {
                if (is_numeric($categoryParam)) {
                    $q->where('id', (int) $categoryParam);
                } else {
                    $q->where('slug', $categoryParam);
                }
            });
        }

        // Filter by publication status (all, active, draft)
        $status = strtolower($request->query('status', 'all'));
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'draft' || $status === 'inactive') {
            $query->where('is_active', false);
        }

        // Search by product name, description, or variant SKU
        if ($request->filled('search')) {
            $search = '%' . trim($request->query('search')) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                    ->orWhere('description', 'like', $search)
                    ->orWhereHas('variants', function ($vq) use ($search) {
                        $vq->where('sku', 'like', $search);
                    });
            });
        }

        // Sorting
        $sort = $request->query('sort', 'newest');
        match ($sort) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'price_asc' => $query->orderBy('base_price', 'asc'),
            'price_desc' => $query->orderBy('base_price', 'desc'),
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        // Pagination
        $perPage = (int) $request->query('per_page', $request->query('limit', 12));
        $perPage = max(1, min($perPage, 100));

        $paginator = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'data' => AdminProductResource::collection($paginator->items()),
            'meta' => [
                'page' => $paginator->currentPage(),
                'limit' => $paginator->perPage(),
                'total' => $paginator->total(),
                'total_pages' => $paginator->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created product with images and variants atomically.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = DB::transaction(function () use ($request) {
            // 1. Generate unique slug
            $baseSlug = $request->filled('slug')
                ? Str::slug($request->input('slug'))
                : Str::slug($request->input('name'));

            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            // 2. Insert master product record
            /** @var Product $product */
            $product = Product::create([
                'category_id' => $request->input('category_id'),
                'name' => $request->input('name'),
                'slug' => $slug,
                'description' => $request->input('description'),
                'base_price' => $request->input('base_price'),
                'is_featured' => $request->boolean('is_featured', false),
                'is_active' => $request->boolean('is_active', true),
            ]);

            // 3. Insert gallery images
            $imagesData = $request->input('images', []);
            $hasPrimary = collect($imagesData)->contains(fn ($img) => ! empty($img['is_primary']));

            foreach ($imagesData as $index => $imgData) {
                $isPrimary = ! empty($imgData['is_primary']) || (! $hasPrimary && $index === 0);
                $product->images()->create([
                    'image_url' => $imgData['image_url'],
                    'alt_text' => $imgData['alt_text'] ?? $product->name,
                    'is_primary' => $isPrimary,
                    'sort_order' => $imgData['sort_order'] ?? $index,
                ]);
            }

            // 4. Validate & Insert product variants
            $variantsData = $request->input('variants', []);
            $seenSkus = [];

            foreach ($variantsData as $index => $varData) {
                $sku = strtoupper(trim($varData['sku']));

                // Atomic duplicate SKU check inside payload
                if (in_array($sku, $seenSkus, true)) {
                    throw ValidationException::withMessages([
                        "variants.{$index}.sku" => ["Terdapat SKU duplikat '{$sku}' di dalam daftar varian yang dikirim."],
                    ]);
                }
                $seenSkus[] = $sku;

                // Atomic duplicate SKU check against existing records
                if (ProductVariant::where('sku', $sku)->exists()) {
                    throw ValidationException::withMessages([
                        "variants.{$index}.sku" => ["SKU '{$sku}' sudah digunakan oleh produk lain."],
                    ]);
                }

                $product->variants()->create([
                    'size' => strtoupper(trim($varData['size'])),
                    'color_name' => trim($varData['color_name']),
                    'color_hex' => trim($varData['color_hex']),
                    'sku' => $sku,
                    'additional_price' => $varData['additional_price'] ?? 0,
                    'stock_quantity' => (int) $varData['stock_quantity'],
                ]);
            }

            return $product;
        });

        // Load relations for response
        $product->load(['category', 'images', 'variants']);

        $price = (float) $product->base_price;
        $formattedPrice = ((int) $price == $price) ? (int) $price : $price;

        return response()->json([
            'success' => true,
            'statusCode' => 201,
            'message' => 'Produk pakaian dan varian berhasil ditambahkan ke inventaris.',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'base_price' => $formattedPrice,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ],
                'images_count' => $product->images->count(),
                'variants_count' => $product->variants->count(),
                'total_stock' => (int) $product->variants->sum('stock_quantity'),
                'is_featured' => (bool) $product->is_featured,
                'is_active' => (bool) $product->is_active,
            ],
        ], 201);
    }

    /**
     * Display the specified product detail for admin review.
     */
    public function show(int|string $id): JsonResponse
    {
        $product = Product::query()
            ->with(['category', 'images', 'variants'])
            ->where('id', $id)
            ->orWhere('slug', $id)
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
