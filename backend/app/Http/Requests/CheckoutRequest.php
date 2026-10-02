<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            'customer_name' => ['required', 'string', 'max:120'],
            'customer_email' => ['required', 'email', 'max:150'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_postal_code' => ['required', 'string', 'max:10'],
            'payment_method' => [
                'required',
                'string',
                'in:bank_transfer_bca,bank_transfer_mandiri,bank_transfer_bni,bank_transfer_bri,manual_bank_transfer,cod',
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
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
            'customer_name.required' => 'Nama lengkap wajib diisi.',
            'customer_name.max' => 'Nama lengkap maksimal 120 karakter.',
            'customer_email.required' => 'Alamat email wajib diisi.',
            'customer_email.email' => 'Format email tidak valid.',
            'customer_email.max' => 'Alamat email maksimal 150 karakter.',
            'customer_phone.required' => 'Nomor WhatsApp / telepon wajib diisi.',
            'customer_phone.max' => 'Nomor telepon maksimal 30 karakter.',
            'shipping_address.required' => 'Alamat pengiriman lengkap wajib diisi.',
            'shipping_city.required' => 'Kota pengiriman wajib diisi.',
            'shipping_postal_code.required' => 'Kode pos wajib diisi.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.in' => 'Metode pembayaran yang dipilih tidak valid.',
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'items.array' => 'Daftar item belanja tidak valid.',
            'items.min' => 'Pesanan harus berisi minimal 1 item.',
            'items.*.variant_id.required' => 'ID varian produk wajib diisi.',
            'items.*.variant_id.integer' => 'ID varian harus berupa bilangan bulat.',
            'items.*.quantity.required' => 'Jumlah barang wajib diisi.',
            'items.*.quantity.integer' => 'Jumlah barang harus berupa bilangan bulat.',
            'items.*.quantity.min' => 'Jumlah barang minimal 1.',
        ];
    }
}
