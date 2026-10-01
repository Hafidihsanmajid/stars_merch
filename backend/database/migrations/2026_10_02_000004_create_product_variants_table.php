<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('size', 10);
            $table->string('color_name', 50);
            $table->string('color_hex', 7);
            $table->string('sku', 50)->unique('idx_variants_sku');
            $table->decimal('additional_price', 10, 2)->default(0.00);
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();

            $table->index('product_id', 'idx_variants_product');
            $table->index(['product_id', 'stock_quantity'], 'idx_variants_stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
