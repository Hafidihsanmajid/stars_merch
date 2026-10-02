<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Order;
use App\Models\ProductVariant;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->seed(ProductSeeder::class);
    }

    public function test_can_validate_cart_with_available_stock(): void
    {
        // Variant 101 has stock 12, Variant 104 has stock 4
        $payload = [
            'items' => [
                ['variant_id' => 101, 'quantity' => 2],
                ['variant_id' => 104, 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/v1/cart/validate', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_valid', true)
            ->assertJsonPath('data.subtotal', 607000)
            ->assertJsonPath('data.estimated_shipping', 20000)
            ->assertJsonPath('data.grand_total', 627000);

        $this->assertCount(2, $response->json('data.items'));
        $this->assertTrue($response->json('data.items.0.in_stock'));
        $this->assertTrue($response->json('data.items.1.in_stock'));
    }

    public function test_cart_validation_marks_invalid_when_stock_insufficient(): void
    {
        // Variant 102 has stock 0
        $payload = [
            'items' => [
                ['variant_id' => 102, 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/v1/cart/validate', $payload);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.is_valid', false)
            ->assertJsonPath('data.items.0.in_stock', false);
    }

    public function test_cart_validation_fails_with_422_on_empty_items(): void
    {
        $response = $this->postJson('/api/v1/cart/validate', ['items' => []]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 422)
            ->assertJsonStructure(['error' => ['code', 'message', 'details']]);
    }

    public function test_checkout_successfully_creates_order_and_decrements_stock(): void
    {
        $variant101 = ProductVariant::find(101);
        $initialStock101 = $variant101->stock_quantity; // 12

        $variant104 = ProductVariant::find(104);
        $initialStock104 = $variant104->stock_quantity; // 4

        $payload = [
            'customer_name' => 'Rian Pratama',
            'customer_email' => 'rian.pratama@example.com',
            'customer_phone' => '081298765432',
            'shipping_address' => 'Jl. Senopati No. 88, Kebayoran Baru',
            'shipping_city' => 'Jakarta Selatan',
            'shipping_postal_code' => '12190',
            'payment_method' => 'bank_transfer_bca',
            'notes' => 'Tolong packing double bubble wrap',
            'items' => [
                ['variant_id' => 101, 'quantity' => 2],
                ['variant_id' => 104, 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/v1/checkout', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 201)
            ->assertJsonPath('data.total_amount', 627000)
            ->assertJsonPath('data.payment_method', 'bank_transfer_bca')
            ->assertJsonPath('data.payment_status', 'pending')
            ->assertJsonPath('data.order_status', 'unprocessed')
            ->assertJsonStructure([
                'data' => [
                    'order_number',
                    'total_amount',
                    'payment_method',
                    'payment_status',
                    'order_status',
                    'payment_instructions' => [
                        'bank_name',
                        'account_number',
                        'account_holder',
                        'unique_code',
                        'transfer_amount',
                        'deadline',
                    ],
                ],
            ]);

        $orderNumber = $response->json('data.order_number');
        $this->assertStringStartsWith('STM-', $orderNumber);

        // Verify stock decremented
        $this->assertEquals($initialStock101 - 2, $variant101->fresh()->stock_quantity);
        $this->assertEquals($initialStock104 - 1, $variant104->fresh()->stock_quantity);

        // Verify customer record created
        $this->assertDatabaseHas('customers', [
            'email' => 'rian.pratama@example.com',
            'name' => 'Rian Pratama',
        ]);

        // Verify order and order items in database
        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'customer_email' => 'rian.pratama@example.com',
            'total_amount' => 627000.00,
        ]);

        $this->assertDatabaseCount('order_items', 2);
    }

    public function test_checkout_fails_atomically_if_stock_exceeded(): void
    {
        $variant104 = ProductVariant::find(104);
        $initialStock = $variant104->stock_quantity; // 4

        // Request 10 items when only 4 are in stock
        $payload = [
            'customer_name' => 'Budi Santoso',
            'customer_email' => 'budi@example.com',
            'customer_phone' => '081234567890',
            'shipping_address' => 'Jl. Bintang No. 10',
            'shipping_city' => 'Bandung',
            'shipping_postal_code' => '40115',
            'payment_method' => 'bank_transfer_mandiri',
            'items' => [
                ['variant_id' => 104, 'quantity' => 10],
            ],
        ];

        $response = $this->postJson('/api/v1/checkout', $payload);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 422);

        // Verify stock was NOT decremented (atomic rollback)
        $this->assertEquals($initialStock, $variant104->fresh()->stock_quantity);

        // Verify no order was created
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_can_view_order_details_by_order_number(): void
    {
        // First, create an order
        $payload = [
            'customer_name' => 'Rian Pratama',
            'customer_email' => 'rian.pratama@example.com',
            'customer_phone' => '081298765432',
            'shipping_address' => 'Jl. Senopati No. 88, Kebayoran Baru',
            'shipping_city' => 'Jakarta Selatan',
            'shipping_postal_code' => '12190',
            'payment_method' => 'bank_transfer_bca',
            'items' => [
                ['variant_id' => 101, 'quantity' => 2],
            ],
        ];

        $checkoutResponse = $this->postJson('/api/v1/checkout', $payload);
        $orderNumber = $checkoutResponse->json('data.order_number');

        // View order without email
        $response = $this->getJson("/api/v1/orders/{$orderNumber}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.order_number', $orderNumber)
            ->assertJsonPath('data.customer.email', 'rian.pratama@example.com')
            ->assertJsonPath('data.items.0.product_name', 'Stars Cosmic Heavy Tee')
            ->assertJsonPath('data.items.0.quantity', 2);

        // View order with matching email
        $responseWithEmail = $this->getJson("/api/v1/orders/{$orderNumber}?email=rian.pratama@example.com");
        $responseWithEmail->assertStatus(200);

        // View order with wrong email returns 404
        $responseWrongEmail = $this->getJson("/api/v1/orders/{$orderNumber}?email=wrong@example.com");
        $responseWrongEmail->assertStatus(404);
    }

    public function test_view_order_returns_404_for_unknown_order(): void
    {
        $response = $this->getJson('/api/v1/orders/STM-UNKNOWN-9999');

        $response->assertStatus(404)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 404);
    }
}
