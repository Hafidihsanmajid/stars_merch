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
use Tests\TestCase;

class AdminLifecycleAndRealtimeStorefrontTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AdminUserSeeder::class);
        $this->seed(CategorySeeder::class);
        $this->seed(ProductSeeder::class);
    }

    /**
     * QA-03: Complete Admin Product Creation to Real-Time Storefront Shopping Lifecycle
     * 
     * 1. Admin Login (Sanctum Token)
     * 2. Verify Admin Profile (/admin/me)
     * 3. Create New Streetwear Product with Images and Matrix Variants (/admin/products)
     * 4. Verify Real-Time Presence in Homepage Featured Showcase (/products/featured)
     * 5. Verify Real-Time Search & Category Filter in Public Catalog (/products)
     * 6. Verify Public Product Detail Page (/products/{slug}) with Variants
     * 7. Customer Validates Cart with Newly Created Variant (/cart/validate)
     * 8. Customer Completes Checkout (/checkout) with Atomic Stock Decrement
     * 9. Admin Dashboard Reflects Real-Time Stock Decrement (/admin/products)
     * 10. Admin Logout and Token Revocation (/admin/logout)
     */
    public function test_complete_admin_lifecycle_and_realtime_storefront_integration(): void
    {
        // -----------------------------------------------------------------
        // Step 1: Admin Login via API (Sanctum Token Generation)
        // -----------------------------------------------------------------
        $loginResponse = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@starsmerch.com',
            'password' => 'secretpassword',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonPath('data.user.role', 'admin');

        $adminToken = $loginResponse->json('data.token');
        $this->assertNotEmpty($adminToken);

        // -----------------------------------------------------------------
        // Step 2: Verify Admin Session Integrity (/admin/me)
        // -----------------------------------------------------------------
        $meResponse = $this->withHeader('Authorization', "Bearer {$adminToken}")
            ->getJson('/api/v1/admin/me');

        $meResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'admin@starsmerch.com')
            ->assertJsonPath('data.user.role', 'admin');

        // -----------------------------------------------------------------
        // Step 3: Admin Creates New Streetwear Product Atomically (/admin/products)
        // -----------------------------------------------------------------
        $hoodieCategory = Category::where('slug', 'hoodies-sweaters')->first();
        $this->assertNotNull($hoodieCategory);

        $newProductPayload = [
            'category_id' => $hoodieCategory->id,
            'name' => 'Stars Phantom Oversized Hoodie',
            'slug' => 'stars-phantom-oversized-hoodie',
            'description' => 'Heavyweight 400 GSM French Terry Cotton dengan vintage washed finish dan sablon plastisol.',
            'base_price' => 389000,
            'is_featured' => true,
            'is_active' => true,
            'images' => [
                [
                    'image_url' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
                    'alt_text' => 'Stars Phantom Hoodie Tampak Depan',
                    'is_primary' => true,
                    'sort_order' => 0,
                ],
                [
                    'image_url' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b3',
                    'alt_text' => 'Stars Phantom Hoodie Tampak Belakang',
                    'is_primary' => false,
                    'sort_order' => 1,
                ],
            ],
            'variants' => [
                [
                    'size' => 'M',
                    'color_name' => 'Phantom Grey',
                    'color_hex' => '#3A3D40',
                    'sku' => 'STM-PHANTOM-GRY-M',
                    'additional_price' => 0,
                    'stock_quantity' => 20,
                ],
                [
                    'size' => 'L',
                    'color_name' => 'Phantom Grey',
                    'color_hex' => '#3A3D40',
                    'sku' => 'STM-PHANTOM-GRY-L',
                    'additional_price' => 0,
                    'stock_quantity' => 30,
                ],
                [
                    'size' => 'XL',
                    'color_name' => 'Phantom Grey',
                    'color_hex' => '#3A3D40',
                    'sku' => 'STM-PHANTOM-GRY-XL',
                    'additional_price' => 15000,
                    'stock_quantity' => 15,
                ],
            ],
        ];

        $storeResponse = $this->withHeader('Authorization', "Bearer {$adminToken}")
            ->postJson('/api/v1/admin/products', $newProductPayload);

        $storeResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 201)
            ->assertJsonPath('data.name', 'Stars Phantom Oversized Hoodie')
            ->assertJsonPath('data.slug', 'stars-phantom-oversized-hoodie')
            ->assertJsonPath('data.base_price', 389000)
            ->assertJsonPath('data.images_count', 2)
            ->assertJsonPath('data.variants_count', 3)
            ->assertJsonPath('data.total_stock', 65); // 20 + 30 + 15 = 65

        $createdProductId = $storeResponse->json('data.id');
        $this->assertDatabaseHas('products', ['id' => $createdProductId]);

        // -----------------------------------------------------------------
        // Step 4: Real-Time Storefront Homepage Featured Showcase Verification
        // -----------------------------------------------------------------
        $featuredResponse = $this->getJson('/api/v1/products/featured');
        $featuredResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $featuredProducts = collect($featuredResponse->json('data'));
        $foundInFeatured = $featuredProducts->firstWhere('slug', 'stars-phantom-oversized-hoodie');
        $this->assertNotNull($foundInFeatured, 'Produk baru wajib langsung muncul di Featured Products.');
        $this->assertEquals(389000, $foundInFeatured['base_price']);
        $this->assertEquals(65, $foundInFeatured['total_stock']);

        // -----------------------------------------------------------------
        // Step 5: Real-Time Storefront Catalog Filter & Search Verification
        // -----------------------------------------------------------------
        $searchResponse = $this->getJson('/api/v1/products?search=Phantom&category=hoodies-sweaters');
        $searchResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $searchList = collect($searchResponse->json('data'));
        $foundInSearch = $searchList->firstWhere('slug', 'stars-phantom-oversized-hoodie');
        $this->assertNotNull($foundInSearch, 'Produk baru wajib dapat dicari di katalog publik.');
        $this->assertEquals('Stars Phantom Oversized Hoodie', $foundInSearch['name']);
        $this->assertEquals('https://images.unsplash.com/photo-1556905055-8f358a7a47b2', $foundInSearch['primary_image']);

        // -----------------------------------------------------------------
        // Step 6: Real-Time Public Product Detail Page (PDP) Verification
        // -----------------------------------------------------------------
        $pdpResponse = $this->getJson('/api/v1/products/stars-phantom-oversized-hoodie');
        $pdpResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Stars Phantom Oversized Hoodie')
            ->assertJsonCount(2, 'data.images')
            ->assertJsonCount(3, 'data.variants');

        $pdpVariants = collect($pdpResponse->json('data.variants'));

        $varL = $pdpVariants->firstWhere('sku', 'STM-PHANTOM-GRY-L');
        $this->assertNotNull($varL);
        $this->assertEquals(30, $varL['stock']);
        $this->assertEquals(389000, $varL['price']);

        $varXL = $pdpVariants->firstWhere('sku', 'STM-PHANTOM-GRY-XL');
        $this->assertNotNull($varXL);
        $this->assertEquals(15, $varXL['stock']);
        $this->assertEquals(404000, $varXL['price']); // 389000 + 15000 = 404000

        $variantIdL = $varL['id'];
        $variantIdXL = $varXL['id'];

        // -----------------------------------------------------------------
        // Step 7: Customer Validates Cart with Newly Created Variants
        // -----------------------------------------------------------------
        $cartValidateResponse = $this->postJson('/api/v1/cart/validate', [
            'items' => [
                ['variant_id' => $variantIdL, 'quantity' => 2], // 2 x 389000 = 778000
                ['variant_id' => $variantIdXL, 'quantity' => 1], // 1 x 404000 = 404000
            ],
        ]);

        $cartValidateResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_valid', true)
            ->assertJsonPath('data.subtotal', 1182000)
            ->assertJsonPath('data.estimated_shipping', 20000)
            ->assertJsonPath('data.grand_total', 1202000);

        // -----------------------------------------------------------------
        // Step 8: Customer Completes Checkout (Atomic Stock Decrement)
        // -----------------------------------------------------------------
        $checkoutResponse = $this->postJson('/api/v1/checkout', [
            'customer_name' => 'Fajar Nugraha',
            'customer_email' => 'fajar.nugraha@example.com',
            'customer_phone' => '081298765432',
            'shipping_address' => 'Jl. Senopati Raya No. 45',
            'shipping_city' => 'Jakarta Selatan',
            'shipping_postal_code' => '12190',
            'payment_method' => 'bank_transfer_bca',
            'notes' => 'Tolong bubble wrap ganda',
            'items' => [
                ['variant_id' => $variantIdL, 'quantity' => 2],
                ['variant_id' => $variantIdXL, 'quantity' => 1],
            ],
        ]);

        $checkoutResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 201)
            ->assertJsonPath('data.total_amount', 1202000);

        $orderNumber = $checkoutResponse->json('data.order_number');
        $this->assertNotEmpty($orderNumber);

        // Verify Database Stock Decrement
        $this->assertEquals(28, ProductVariant::find($variantIdL)->stock_quantity); // 30 - 2 = 28
        $this->assertEquals(14, ProductVariant::find($variantIdXL)->stock_quantity); // 15 - 1 = 14

        // -----------------------------------------------------------------
        // Step 9: Admin Dashboard Reflects Real-Time Stock Decrement
        // -----------------------------------------------------------------
        $adminProductResponse = $this->withHeader('Authorization', "Bearer {$adminToken}")
            ->getJson('/api/v1/admin/products?search=STM-PHANTOM');

        $adminProductResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $adminProductItem = collect($adminProductResponse->json('data'))->firstWhere('slug', 'stars-phantom-oversized-hoodie');
        $this->assertNotNull($adminProductItem);
        // Initial was 65, 3 units purchased -> total_stock must now be 62!
        $this->assertEquals(62, $adminProductItem['total_stock']);

        // -----------------------------------------------------------------
        // Step 10: Admin Logout & Session Token Revocation
        // -----------------------------------------------------------------
        $logoutResponse = $this->withHeader('Authorization', "Bearer {$adminToken}")
            ->postJson('/api/v1/admin/logout');

        $logoutResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonPath('message', 'Logout berhasil.');

        // Token must be deleted from personal_access_tokens
        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Reset auth guard in-memory cache to simulate subsequent HTTP request
        $this->app['auth']->forgetGuards();

        // Token must now be rejected with 401
        $rejectedResponse = $this->withHeader('Authorization', "Bearer {$adminToken}")
            ->getJson('/api/v1/admin/me');

        $rejectedResponse->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'UNAUTHENTICATED');
    }
}
