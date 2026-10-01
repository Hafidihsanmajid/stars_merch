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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 30)->unique('idx_orders_order_number');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->string('customer_name', 120);
            $table->string('customer_email', 150);
            $table->string('customer_phone', 30);
            $table->text('shipping_address');
            $table->string('shipping_city', 100);
            $table->string('shipping_postal_code', 10);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_cost', 10, 2)->default(0.00);
            $table->decimal('total_amount', 12, 2);
            $table->string('payment_method', 50);
            $table->string('payment_status', 30)->default('pending');
            $table->string('order_status', 30)->default('unprocessed');
            $table->text('notes')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();

            $table->index(['customer_email', 'order_number'], 'idx_orders_customer_lookup');
            $table->index(['order_status', 'payment_status'], 'idx_orders_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
