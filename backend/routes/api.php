<?php

use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\CartValidationController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // Cart Validation
    Route::post('/cart/validate', [CartValidationController::class, 'validateCart']);

    // Checkout & Orders
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    Route::get('/orders/{order_number}', [CheckoutController::class, 'show']);

    // Admin Authentication & Protected Portal Routes
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function () {
            Route::get('/me', [AdminAuthController::class, 'me']);
            Route::post('/logout', [AdminAuthController::class, 'logout']);

            // Product Management
            Route::get('/products', [AdminProductController::class, 'index']);
            Route::post('/products', [AdminProductController::class, 'store']);
            Route::get('/products/{id}', [AdminProductController::class, 'show']);
        });
    });
});
