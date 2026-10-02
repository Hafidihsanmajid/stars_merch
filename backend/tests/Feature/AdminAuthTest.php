<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(AdminUserSeeder::class);
    }

    public function test_default_admin_seeder_creates_admin_user(): void
    {
        $admin = User::where('email', 'admin@starsmerch.com')->first();

        $this->assertNotNull($admin);
        $this->assertEquals('Admin Stars Merch', $admin->name);
        $this->assertEquals('admin', $admin->role);
        $this->assertTrue(Hash::check('secretpassword', $admin->password));
        $this->assertTrue($admin->isAdmin());
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@starsmerch.com',
            'password' => 'secretpassword',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonPath('data.user.email', 'admin@starsmerch.com')
            ->assertJsonPath('data.user.role', 'admin')
            ->assertJsonPath('data.admin.email', 'admin@starsmerch.com')
            ->assertJsonStructure([
                'success',
                'statusCode',
                'message',
                'data' => [
                    'token',
                    'user' => ['id', 'name', 'email', 'role'],
                    'admin' => ['id', 'name', 'email', 'role'],
                ],
            ]);

        $this->assertNotEmpty($response->json('data.token'));
    }

    public function test_admin_login_fails_with_invalid_password(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@starsmerch.com',
            'password' => 'wrongpassword123',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 401)
            ->assertJsonPath('error.code', 'AUTHENTICATION_FAILED')
            ->assertJsonPath('error.message', 'Email atau password salah.');
    }

    public function test_admin_login_fails_with_non_existent_email(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'nobody@starsmerch.com',
            'password' => 'secretpassword',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 401)
            ->assertJsonPath('error.code', 'AUTHENTICATION_FAILED')
            ->assertJsonPath('error.message', 'Email atau password salah.');
    }

    public function test_admin_login_fails_when_user_is_not_admin(): void
    {
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'customer@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 403)
            ->assertJsonPath('error.code', 'FORBIDDEN')
            ->assertJsonPath('error.message', 'Akses ditolak. Pengguna bukan administrator.');
    }

    public function test_admin_login_fails_validation_for_missing_or_invalid_fields(): void
    {
        $response = $this->postJson('/api/v1/admin/login', [
            'email' => 'not-an-email',
            'password' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 422)
            ->assertJsonPath('error.code', 'VALIDATION_FAILED')
            ->assertJsonStructure([
                'success',
                'statusCode',
                'error' => [
                    'code',
                    'message',
                    'details' => [
                        'email',
                        'password',
                    ],
                ],
            ]);
    }

    public function test_authenticated_admin_can_access_me_profile(): void
    {
        $loginResponse = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@starsmerch.com',
            'password' => 'secretpassword',
        ]);

        $token = $loginResponse->json('data.token');

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/me');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonPath('data.user.email', 'admin@starsmerch.com')
            ->assertJsonPath('data.user.role', 'admin');
    }

    public function test_unauthenticated_request_to_admin_me_is_rejected_with_401(): void
    {
        $response = $this->getJson('/api/v1/admin/me');

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 401)
            ->assertJsonPath('error.code', 'UNAUTHENTICATED');
    }

    public function test_admin_can_logout_and_token_is_revoked(): void
    {
        $loginResponse = $this->postJson('/api/v1/admin/login', [
            'email' => 'admin@starsmerch.com',
            'password' => 'secretpassword',
        ]);

        $token = $loginResponse->json('data.token');

        $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/admin/logout');

        $logoutResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('statusCode', 200)
            ->assertJsonPath('message', 'Logout berhasil.');

        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Reset auth guard in-memory cache to simulate subsequent HTTP request
        $this->app['auth']->forgetGuards();

        // Token should now be invalid
        $afterLogoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/admin/me');

        $afterLogoutResponse->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 401)
            ->assertJsonPath('error.code', 'UNAUTHENTICATED');
    }

    public function test_non_admin_token_cannot_access_protected_admin_routes(): void
    {
        $customer = User::create([
            'name' => 'Regular Customer',
            'email' => 'regular@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        $customerToken = $customer->createToken('customer-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$customerToken}")
            ->getJson('/api/v1/admin/me');

        $response->assertStatus(403)
            ->assertJsonPath('success', false)
            ->assertJsonPath('statusCode', 403)
            ->assertJsonPath('error.code', 'FORBIDDEN')
            ->assertJsonPath('error.message', 'Akses ditolak. Anda tidak memiliki hak akses administrator.');
    }
}
