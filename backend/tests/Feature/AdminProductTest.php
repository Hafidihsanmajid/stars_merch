<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    private string $adminToken;
    private User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(AdminUserSeeder::class);
        $this->seed(CategorySeeder::class);
        $this->seed(ProductSeeder::class);

        $this->adminUser = User::where('email', 'admin@starsmerch.com')->first();
        $this->adminToken = $this->adminUser->createToken('admin-test-token')->plainTextToken;
    }

    public function test_unauthenticated_request_to_admin_products_returns_401(): void
    {
        $this->getJson('/api/v1/admin/products')
            ->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'UNAUTHENTICATED');

        $this->postJson('/api/v1/admin/products', [])
            ->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'UNAUTHENTICATED');
    }

    public function test_non_admin_cannot_access_admin_products(): void
    {
        $customer = User::create([
            'name' => 'Regular Customer',
            'email' => 'customer@starsmerch.com',
            'password' => Hash::make('secret123'),
            'role' => 'customer',
        ]);
        $customerToken = $customer->createToken('customer-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$customerToken}")
            ->getJson('/api/v1/admin/products')
            ->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'FORBIDDEN');

        $this->withHeader('Authorization', "Bearer {$customerToken}")
            ->postJson('/api/v1/admin/products', [])
            ->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'FORBIDDEN');
    }

    public function test_admin_can_list_products_with_inventory_metadata(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'category' => ['id', 'name', 'slug'],
                        'base_price',
                        'primary_image',
                        'total_stock',
                        'images_count',
                        'variants_count',
                        'is_featured',
                        'is_active',
                        'status',
                    ],
                ],
                'meta' => [
                    'page',
                    'limit',
                    'total',
                    'total_pages',
                ],
            ]);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_admin_can_filter_products_by_category_and_status(): void
    {
        // 1. Filter by category
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/products?category=oversized-tees');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        foreach ($response->json('data') as $item) {
            $this->assertEquals('oversized-tees', $item['category']['slug']);
        }

        // 2. Filter by status active
        $responseActive = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/products?status=active');

        $responseActive->assertStatus(200);
        foreach ($responseActive->json('data') as $item) {
            $this->assertTrue($item['is_active']);
            $this->assertEquals('active', $item['status']);
        }
    }

    public function test_admin_can_search_products_by_name_or_variant_sku(): void
    {
        // Search by product name
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/products?search=Cosmic');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertGreaterThanOrEqual(1, count($response->json('data')));

        // Search by variant SKU
        $responseSku = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/v1/admin/products?search=STM-CSM-BLK-S');

        $responseSku->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertGreaterThanOrEqual(1, count($responseSku->json('data')));
    }

    public function test_admin_can_store_new_product_with_images_and_variants_atomically(): void
    {
        $category = Category::first();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Stars Cyber Heavy Tee',
            'slug' => 'stars-cyber-heavy-tee',
            'description' => 'Heavyweight 240 GSM oversized graphic streetwear tee.',
            'base_price' => 199000,
            'is_featured' => true,
            'is_active' => true,
            'images' => [
                [
                    'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
                    'alt_text' => 'Stars Cyber Heavy Tee Depan',
                    'is_primary' => true,
                    'sort_order' => 0,
                ],
                [
                    'image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
                    'alt_text' => 'Stars Cyber Heavy Tee Belakang',
                    'is_primary' => false,
                    'sort_order' => 1,
                ],
            ],
            'variants' => [
                [
                    'size' => 'M',
                    'color_name' => 'Cyber Black',
                    'color_hex' => '#111111',
                    'sku' => 'STM-CYBER-BLK-M',
                    'additional_price' => 0,
                    'stock_quantity' => 20,
                ],
                [
                    'size' => 'L',
                    'color_name' => 'Cyber Black',
                    'color_hex' => '#111111',
                    'sku' => 'STM-CYBER-BLK-L',
                    'additional_price' => 0,
                    'stock_quantity' => 25,
                ],
                [
                    'size' => 'XL',
                    'color_name' => 'Cyber Black',
                    'color_hex' => '#111111',
                    'sku' => 'STM-CYBER-BLK-XL',
                    'additional_price' => 10000,
                    'stock_quantity' => 15,
                ],
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 201)
            ->assertJsonPath('message', 'Produk pakaian dan varian berhasil ditambahkan ke inventaris.')
            ->assertJsonPath('data.name', 'Stars Cyber Heavy Tee')
            ->assertJsonPath('data.slug', 'stars-cyber-heavy-tee')
            ->assertJsonPath('data.base_price', 199000)
            ->assertJsonPath('data.category.id', $category->id)
            ->assertJsonPath('data.images_count', 2)
            ->assertJsonPath('data.variants_count', 3)
            ->assertJsonPath('data.total_stock', 60)
            ->assertJsonPath('data.is_featured', true)
            ->assertJsonPath('data.is_active', true);

        $productId = $response->json('data.id');

        // Verify in database
        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name' => 'Stars Cyber Heavy Tee',
            'slug' => 'stars-cyber-heavy-tee',
        ]);

        $this->assertCount(2, Product::find($productId)->images);
        $this->assertDatabaseHas('product_images', [
            'product_id' => $productId,
            'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
            'is_primary' => true,
        ]);
        $this->assertDatabaseHas('product_variants', [
            'product_id' => $productId,
            'sku' => 'STM-CYBER-BLK-M',
            'stock_quantity' => 20,
        ]);
    }

    public function test_store_product_validates_required_fields(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/products', []);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED')
            ->assertJsonStructure([
                'error' => [
                    'details' => [
                        'category_id',
                        'name',
                        'description',
                        'base_price',
                        'images',
                        'variants',
                    ],
                ],
            ]);
    }

    public function test_store_product_rolls_back_atomically_if_payload_contains_duplicate_sku(): void
    {
        $category = Category::first();
        $initialProductCount = Product::count();
        $initialVariantCount = ProductVariant::count();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Duplicate SKU Product',
            'description' => 'Test atomic rollback.',
            'base_price' => 150000,
            'images' => [
                [
                    'image_url' => 'https://example.com/img1.jpg',
                    'is_primary' => true,
                ],
            ],
            'variants' => [
                [
                    'size' => 'M',
                    'color_name' => 'Black',
                    'color_hex' => '#000000',
                    'sku' => 'STM-DUP-SKU-TEST',
                    'stock_quantity' => 10,
                ],
                [
                    'size' => 'L',
                    'color_name' => 'Black',
                    'color_hex' => '#000000',
                    'sku' => 'STM-DUP-SKU-TEST', // Duplicate inside payload
                    'stock_quantity' => 15,
                ],
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');

        // Verify atomic rollback (no products or variants were left orphan)
        $this->assertEquals($initialProductCount, Product::count());
        $this->assertEquals($initialVariantCount, ProductVariant::count());
        $this->assertDatabaseMissing('products', ['name' => 'Duplicate SKU Product']);
    }

    public function test_store_product_rolls_back_atomically_if_sku_already_exists_in_database(): void
    {
        $existingVariant = ProductVariant::first();
        $category = Category::first();
        $initialProductCount = Product::count();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Existing SKU Collision Product',
            'description' => 'Test database rollback.',
            'base_price' => 175000,
            'images' => [
                [
                    'image_url' => 'https://example.com/collision.jpg',
                    'is_primary' => true,
                ],
            ],
            'variants' => [
                [
                    'size' => 'M',
                    'color_name' => 'Grey',
                    'color_hex' => '#888888',
                    'sku' => $existingVariant->sku, // Existing SKU in DB
                    'stock_quantity' => 10,
                ],
            ],
        ];

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/products', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED');

        // Verify atomic rollback
        $this->assertEquals($initialProductCount, Product::count());
        $this->assertDatabaseMissing('products', ['name' => 'Existing SKU Collision Product']);
    }

    public function test_newly_created_product_is_accessible_in_public_catalog_and_pdp(): void
    {
        $category = Category::first();

        $payload = [
            'category_id' => $category->id,
            'name' => 'Stars Exclusive Neon Hoodie',
            'slug' => 'stars-exclusive-neon-hoodie',
            'description' => 'Limited edition streetwear hoodie.',
            'base_price' => 349000,
            'is_featured' => false,
            'is_active' => true,
            'images' => [
                [
                    'image_url' => 'https://example.com/neon-front.jpg',
                    'alt_text' => 'Front Look',
                    'is_primary' => true,
                    'sort_order' => 0,
                ],
            ],
            'variants' => [
                [
                    'size' => 'L',
                    'color_name' => 'Neon Green',
                    'color_hex' => '#39FF14',
                    'sku' => 'STM-NEON-GRN-L',
                    'additional_price' => 0,
                    'stock_quantity' => 18,
                ],
            ],
        ];

        // 1. Admin creates product
        $storeResponse = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/v1/admin/products', $payload);

        $storeResponse->assertStatus(201);

        // 2. Public Catalog contains the new product
        $catalogResponse = $this->getJson('/api/v1/products?search=Neon');
        $catalogResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $productFound = collect($catalogResponse->json('data'))->firstWhere('slug', 'stars-exclusive-neon-hoodie');
        $this->assertNotNull($productFound);
        $this->assertEquals('Stars Exclusive Neon Hoodie', $productFound['name']);
        $this->assertEquals(349000, $productFound['base_price']);
        $this->assertEquals(18, $productFound['total_stock']);

        // 3. Public PDP detail returns product with image and variant
        $pdpResponse = $this->getJson('/api/v1/products/stars-exclusive-neon-hoodie');
        $pdpResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Stars Exclusive Neon Hoodie')
            ->assertJsonPath('data.variants.0.sku', 'STM-NEON-GRN-L')
            ->assertJsonPath('data.variants.0.stock', 18);
    }
}
