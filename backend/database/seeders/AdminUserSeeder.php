<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@starsmerch.com'],
            [
                'name' => 'Admin Stars Merch',
                'password' => Hash::make('secretpassword'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
