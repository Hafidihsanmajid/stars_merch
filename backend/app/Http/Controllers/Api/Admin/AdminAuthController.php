<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    /**
     * Authenticate admin user and issue Sanctum token.
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'statusCode' => 401,
                'error' => [
                    'code' => 'AUTHENTICATION_FAILED',
                    'message' => 'Email atau password salah.',
                ],
            ], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'statusCode' => 403,
                'error' => [
                    'code' => 'FORBIDDEN',
                    'message' => 'Akses ditolak. Pengguna bukan administrator.',
                ],
            ], 403);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        $adminData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => $adminData,
                'admin' => $adminData,
            ],
        ]);
    }

    /**
     * Retrieve authenticated admin profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $adminData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'message' => 'Profil admin berhasil diambil.',
            'data' => [
                'user' => $adminData,
                'admin' => $adminData,
            ],
        ]);
    }

    /**
     * Revoke current Sanctum token (logout).
     */
    public function logout(Request $request): JsonResponse
    {
        /** @var \Laravel\Sanctum\PersonalAccessToken|null $token */
        $token = $request->user()->currentAccessToken();
        if ($token) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'statusCode' => 200,
            'message' => 'Logout berhasil.',
            'data' => null,
        ]);
    }
}
