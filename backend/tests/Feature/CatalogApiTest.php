<?php

namespace Tests\Feature;

use Database\Seeders\CategorySeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->seed(ProductSeeder::class);
    }

    public function test_can_list_categories(): void
    {
        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'description',
                        'image_url',
                        'products_count',
                    ],
                ],
            ])
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200);

        $this->assertCount(4, $response->json('data'));
    }

    public function test_can_list_products_with_pagination(): void
    {
        $response = $this->getJson('/api/v1/products?per_page=4');

        $response->assertStatus(200)
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
                        'available_sizes',
                        'available_colors' => [
                            '*' => ['name', 'hex'],
                        ],
                        'total_stock',
                        'is_featured',
                    ],
                ],
                'meta' => [
                    'page',
                    'limit',
                    'total',
                    'total_pages',
                ],
            ])
            ->assertJsonPath('meta.limit', 4)
            ->assertJsonPath('meta.total', 8)
            ->assertJsonPath('meta.total_pages', 2);
    }

    public function test_can_filter_products_by_category(): void
    {
        $response = $this->getJson('/api/v1/products?category=oversized-tees');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertNotEmpty($data);
        foreach ($data as $product) {
            $this->assertEquals('oversized-tees', $product['category']['slug']);
        }
    }

    public function test_can_search_products(): void
    {
        $response = $this->getJson('/api/v1/products?search=Cosmic');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertCount(1, $data);
        $this->assertEquals('stars-cosmic-heavy-tee', $data[0]['slug']);
    }

    public function test_can_sort_products_by_price_ascending(): void
    {
        $response = $this->getJson('/api/v1/products?sort=price_asc');

        $response->assertStatus(200);
        $prices = collect($response->json('data'))->pluck('base_price')->all();
        $sortedPrices = $prices;
        sort($sortedPrices);

        $this->assertEquals($sortedPrices, $prices);
    }

    public function test_can_list_featured_products(): void
    {
        $response = $this->getJson('/api/v1/products/featured');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'is_featured',
                    ],
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $product) {
            $this->assertTrue($product['is_featured']);
        }
    }

    public function test_can_get_product_detail_by_slug(): void
    {
        $response = $this->getJson('/api/v1/products/stars-cosmic-heavy-tee');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'statusCode',
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'description',
                    'base_price',
                    'category' => ['id', 'name', 'slug'],
                    'images' => [
                        '*' => ['id', 'image_url', 'alt_text', 'is_primary'],
                    ],
                    'variants' => [
                        '*' => [
                            'id',
                            'size',
                            'color_name',
                            'color_hex',
                            'sku',
                            'price',
                            'stock',
                        ],
                    ],
                ],
            ])
            ->assertJsonPath('data.name', 'Stars Cosmic Heavy Tee')
            ->assertJsonPath('data.base_price', 199000);

        // Check variant 101 and 104 specifics
        $variants = collect($response->json('data.variants'));
        $v101 = $variants->firstWhere('id', 101);
        $this->assertNotNull($v101);
        $this->assertEquals('S', $v101['size']);
        $this->assertEquals(199000, $v101['price']);
        $this->assertEquals(12, $v101['stock']);

        $v104 = $variants->firstWhere('id', 104);
        $this->assertNotNull($v104);
        $this->assertEquals('XL', $v104['size']);
        $this->assertEquals(209000, $v104['price']); // 199000 + 10000
        $this->assertEquals(4, $v104['stock']);
    }

    public function test_returns_404_for_unknown_product_slug(): void
    {
        $response = $this->getJson('/api/v1/products/non-existent-product');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'statusCode' => 404,
                'error' => [
                    'code' => 'NOT_FOUND',
                    'message' => 'Produk tidak ditemukan.',
                ],
            ]);
    }
}
