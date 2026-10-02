<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Oversized T-Shirts',
                'slug' => 'oversized-tees',
                'description' => 'Heavyweight cotton oversized tees with relaxed boxy fit',
                'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'Hoodies & Sweaters',
                'slug' => 'hoodies-sweaters',
                'description' => 'Comfortable heavyweight fleece hoodies and streetwear crewnecks',
                'image_url' => 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => 'Pants & Cargo',
                'slug' => 'pants-cargo',
                'description' => 'Utilitarian cargo pants and relaxed streetwear trousers',
                'image_url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
                'is_active' => true,
            ],
            [
                'id' => 4,
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Everyday streetwear caps, beanies, and tote bags',
                'image_url' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['id' => $category['id']], $category);
        }
    }
}
