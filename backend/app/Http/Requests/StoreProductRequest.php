<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:180', 'unique:products,slug'],
            'description' => ['required', 'string'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'is_featured' => ['nullable', 'boolean'],
            'is_active' => ['nullable', 'boolean'],
            'images' => ['required', 'array', 'min:1'],
            'images.*.image_url' => ['required', 'string', 'max:255'],
            'images.*.alt_text' => ['nullable', 'string', 'max:150'],
            'images.*.is_primary' => ['nullable', 'boolean'],
            'images.*.sort_order' => ['nullable', 'integer', 'min:0'],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.size' => ['required', 'string', 'max:10'],
            'variants.*.color_name' => ['required', 'string', 'max:50'],
            'variants.*.color_hex' => ['required', 'string', 'max:10'],
            'variants.*.sku' => ['required', 'string', 'max:50', 'distinct', 'unique:product_variants,sku'],
            'variants.*.additional_price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori produk wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk maksimal 150 karakter.',
            'slug.unique' => 'Slug produk sudah digunakan.',
            'description.required' => 'Deskripsi produk wajib diisi.',
            'base_price.required' => 'Harga dasar produk wajib diisi.',
            'base_price.numeric' => 'Harga dasar harus berupa angka.',
            'base_price.min' => 'Harga dasar minimal 0.',
            'images.required' => 'Minimal satu gambar produk harus disertakan.',
            'images.array' => 'Format galeri gambar tidak valid.',
            'images.min' => 'Minimal satu gambar produk harus disertakan.',
            'images.*.image_url.required' => 'URL gambar wajib diisi.',
            'images.*.image_url.max' => 'URL gambar maksimal 255 karakter.',
            'variants.required' => 'Minimal satu varian produk harus disertakan.',
            'variants.array' => 'Format daftar varian tidak valid.',
            'variants.min' => 'Minimal satu varian produk harus disertakan.',
            'variants.*.size.required' => 'Ukuran varian wajib diisi.',
            'variants.*.color_name.required' => 'Nama warna varian wajib diisi.',
            'variants.*.color_hex.required' => 'Kode HEX warna wajib diisi.',
            'variants.*.sku.required' => 'SKU varian wajib diisi.',
            'variants.*.sku.distinct' => 'Terdapat SKU duplikat di dalam daftar varian yang dikirim.',
            'variants.*.sku.unique' => 'SKU varian sudah digunakan oleh produk lain.',
            'variants.*.stock_quantity.required' => 'Kuantitas stok wajib diisi.',
            'variants.*.stock_quantity.integer' => 'Kuantitas stok harus berupa bilangan bulat.',
            'variants.*.stock_quantity.min' => 'Kuantitas stok tidak boleh bernilai negatif.',
        ];
    }
}
