<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\ProductVariant;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EndToEndShoppingFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->seed(ProductSeeder::class);
    }

    /**
     * QA-01: End-to-End Complete User Journey
     * 1. Browse featured -> 2. Filter catalog -> 3. View PDP -> 4. Cart validate -> 5. Checkout -> 6. Stock verification -> 7. Order tracking
     */
    public function test_complete_end_to_end_shopping_and_inventory_decrement_flow(): void
    {
        // -------------------------------------------------------------
        // Step 1: Browse Featured Products on Homepage (FR-1.1 & FR-1.2)
        // -------------------------------------------------------------
        $featuredResponse = $this->getJson('/api/v1/products/featured');
        $featuredResponse->assertStatus(200)
            ->assertJsonPath('success', true);
        $featuredProducts = $featuredResponse->json('data');
        $this->assertNotEmpty($featuredProducts);
        $this->assertTrue($featuredProducts[0]['is_featured']);

        // -------------------------------------------------------------
        // Step 2: Browse Catalog with Category Filter & Search (FR-2.1 - FR-2.4)
        // -------------------------------------------------------------
        $catalogResponse = $this->getJson('/api/v1/products?category=oversized-tees&search=cosmic');
        $catalogResponse->assertStatus(200)
            ->assertJsonPath('success', true);
        $this->assertGreaterThanOrEqual(1, count($catalogResponse->json('data')));

        $productSlug = $catalogResponse->json('data.0.slug');
        $this->assertEquals('stars-cosmic-heavy-tee', $productSlug);

        // -------------------------------------------------------------
        // Step 3: View Product Detail Page (PDP) & Select Variants (FR-3.1 - FR-3.4)
        // -------------------------------------------------------------
        $pdpResponse = $this->getJson("/api/v1/products/{$productSlug}");
        $pdpResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.slug', 'stars-cosmic-heavy-tee');

        $variants = $pdpResponse->json('data.variants');
        $this->assertNotEmpty($variants);

        // Variant 103: Size L, Cosmic Black, stock = 8
        $variantL = collect($variants)->firstWhere('id', 103);
        $this->assertNotNull($variantL);
        $this->assertEquals('L', $variantL['size']);
        $this->assertEquals(8, $variantL['stock']);

        // Variant 104: Size XL, Cosmic Black, stock = 4, additional_price = 10000
        $variantXL = collect($variants)->firstWhere('id', 104);
        $this->assertNotNull($variantXL);
        $this->assertEquals('XL', $variantXL['size']);
        $this->assertEquals(4, $variantXL['stock']);

        // -------------------------------------------------------------
        // Step 4: Validate Shopping Cart (FR-4.1 - FR-4.5)
        // -------------------------------------------------------------
        $cartPayload = [
            'items' => [
                ['variant_id' => 103, 'quantity' => 2], // 2 x 199.000 = 398.000
                ['variant_id' => 104, 'quantity' => 1], // 1 x 209.000 = 209.000
            ],
        ];

        $cartValidation = $this->postJson('/api/v1/cart/validate', $cartPayload);
        $cartValidation->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_valid', true)
            ->assertJsonPath('data.subtotal', 607000)
            ->assertJsonPath('data.estimated_shipping', 20000)
            ->assertJsonPath('data.grand_total', 627000);

        // -------------------------------------------------------------
        // Step 5: Checkout Order Submission (FR-5.1 - FR-5.4)
        // -------------------------------------------------------------
        $initialStock103 = ProductVariant::find(103)->stock_quantity; // 8
        $initialStock104 = ProductVariant::find(104)->stock_quantity; // 4

        $checkoutPayload = [
            'customer_name' => 'Dimas Wicaksono',
            'customer_email' => 'dimas.wicaksono@example.com',
            'customer_phone' => '081234567890',
            'shipping_address' => 'Jl. Boulevard Gading Serpong No. 12',
            'shipping_city' => 'Tangerang',
            'shipping_postal_code' => '15810',
            'payment_method' => 'bank_transfer_bca',
            'notes' => 'Tolong kirim sebelum jam 5 sore',
            'items' => [
                ['variant_id' => 103, 'quantity' => 2],
                ['variant_id' => 104, 'quantity' => 1],
            ],
        ];

        $checkoutResponse = $this->postJson('/api/v1/checkout', $checkoutPayload);
        $checkoutResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 201)
            ->assertJsonPath('data.total_amount', 627000)
            ->assertJsonPath('data.payment_method', 'bank_transfer_bca')
            ->assertJsonPath('data.payment_status', 'pending');

        $orderNumber = $checkoutResponse->json('data.order_number');
        $this->assertNotEmpty($orderNumber);
        $this->assertStringStartsWith('STM-', $orderNumber);

        // -------------------------------------------------------------
        // Step 6: Database & Inventory Decrement Verification (SQLite ACID)
        // -------------------------------------------------------------
        $this->assertEquals($initialStock103 - 2, ProductVariant::find(103)->stock_quantity); // 8 - 2 = 6
        $this->assertEquals($initialStock104 - 1, ProductVariant::find(104)->stock_quantity); // 4 - 1 = 3

        $this->assertDatabaseHas('customers', [
            'email' => 'dimas.wicaksono@example.com',
            'name' => 'Dimas Wicaksono',
            'phone' => '081234567890',
            'city' => 'Tangerang',
        ]);

        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'customer_email' => 'dimas.wicaksono@example.com',
            'total_amount' => 627000.00,
            'payment_status' => 'pending',
            'order_status' => 'unprocessed',
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_variant_id' => 103,
            'quantity' => 2,
            'unit_price' => 199000.00,
        ]);

        $this->assertDatabaseHas('order_items', [
            'product_variant_id' => 104,
            'quantity' => 1,
            'unit_price' => 209000.00,
        ]);

        // -------------------------------------------------------------
        // Step 7: Order Tracking & Confirmation (FR-5.5)
        // -------------------------------------------------------------
        $trackingResponse = $this->getJson("/api/v1/orders/{$orderNumber}?email=dimas.wicaksono@example.com");
        $trackingResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_number', $orderNumber)
            ->assertJsonPath('data.customer.name', 'Dimas Wicaksono')
            ->assertJsonPath('data.pricing.total_amount', 627000);

        // -------------------------------------------------------------
        // Step 8: Stock Protection Guard (Out of stock rollback verification)
        // Attempting to buy 5 units of Variant 104 when only 3 remain
        // -------------------------------------------------------------
        $invalidCheckout = $this->postJson('/api/v1/checkout', [
            'customer_name' => 'Other Buyer',
            'customer_email' => 'other@example.com',
            'customer_phone' => '081999999999',
            'shipping_address' => 'Jl. Thamrin No. 1',
            'shipping_city' => 'Jakarta',
            'shipping_postal_code' => '10350',
            'payment_method' => 'cod',
            'items' => [
                ['variant_id' => 104, 'quantity' => 5], // Exceeds available stock (3)
            ],
        ]);

        $invalidCheckout->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED')
            ->assertJsonStructure(['error' => ['details' => ['items.0.quantity']]]);

        // Stock must remain unchanged at 3
        $this->assertEquals(3, ProductVariant::find(104)->stock_quantity);
    }
}
